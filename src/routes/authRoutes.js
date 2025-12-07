import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

// Email utilities (from your emailService.js)
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendSigninEmail,
  sendForgetPasswordEmail,
  sendResetPasswordEmail,
} from "../utils/emailService.js";

// SMS utility (you implement this with Twilio / MSG91 etc.)
import { sendOtpSms } from "../utils/smsService.js";

const router = express.Router();

/* =========================
   HELPERS
========================= */

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const generateOTP = () => {
  // 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =========================
   POST /api/auth/signup
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 min

    const user = await User.create({
      name,
      email,
      phone,
      password,
      isVerified: false,
      emailVerificationOTP: otp,
      emailVerificationExpires: new Date(otpExpiry),
    });

    // 🚀 Send OTP via email
    try {
      await sendVerificationEmail(email, otp);
    } catch (err) {
      console.error("Failed to send verification email:", err.message);
      // you can decide whether to fail signup or not; here we still allow it
    }

    // 🚀 Send OTP via SMS (only if phone present)
    if (phone) {
      const normalizedPhone = phone.startsWith("+") ? phone : `+91${phone}`; // default to India
      try {
        await sendOtpSms({ to: normalizedPhone, otp });
      } catch (err) {
        console.error("Failed to send OTP SMS:", err.message);
      }
    }

    res.status(201).json({
      message: "User created, OTP sent to your email/phone.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      dev_otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   POST /api/auth/verify-email
   body: { email, otp }
========================= */
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.emailVerificationOTP ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({ message: "OTP expired or not set" });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // 🎉 Send welcome email after successful verification
    try {
      await sendWelcomeEmail(user.name, user.email);
    } catch (err) {
      console.error("Failed to send welcome email:", err.message);
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   POST /api/auth/resend-otp
   body: { email }
========================= */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 15 * 60 * 1000;

    user.emailVerificationOTP = otp;
    user.emailVerificationExpires = new Date(otpExpiry);
    await user.save();

    // Email
    try {
      await sendVerificationEmail(email, otp);
    } catch (err) {
      console.error("Failed to send verification email:", err.message);
    }

    // SMS
    if (user.phone) {
      const normalizedPhone = user.phone.startsWith("+")
        ? user.phone
        : `+91${user.phone}`;
      try {
        await sendOtpSms({ to: normalizedPhone, otp });
      } catch (err) {
        console.error("Failed to send OTP SMS:", err.message);
      }
    }

    res.json({
      message: "OTP resent to your email/phone.",
      dev_otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   POST /api/auth/signin
   body: { email or phone, password }
========================= */
router.post("/signin", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res
        .status(400)
        .json({ message: "Email or phone and password required" });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const token = generateToken(user._id, user.role);

    // 🔔 Optional: send sign-in alert email
    try {
      await sendSigninEmail(req, user.name, user.email);
    } catch (err) {
      console.error("Failed to send sign-in email:", err.message);
    }

    res.json({
      message: "Signed in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   POST /api/auth/forgot-password
   body: { email }
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.json({
        message: "If that email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/auth/reset-password/${resetToken}`;

    // ✉️ Send reset link email
    try {
      await sendForgetPasswordEmail(user.email, resetUrl);
    } catch (err) {
      console.error("Failed to send reset password email:", err.message);
    }

    res.json({
      message: "Password reset link generated",
      dev_reset_url:
        process.env.NODE_ENV === "development" ? resetUrl : undefined,
      dev_reset_token:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   POST /api/auth/reset-password/:token
   body: { password }
========================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = password; // will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // ✉️ Notify user that password was changed
    try {
      await sendResetPasswordEmail(user.name, user.email);
    } catch (err) {
      console.error("Failed to send reset success email:", err.message);
    }

    res.json({ message: "Password reset successful, please sign in" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET /api/auth/me
========================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
