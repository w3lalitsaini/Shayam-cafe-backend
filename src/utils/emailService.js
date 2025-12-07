// backend/utils/sendEmail.js
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import {
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  RESET_PASSWORD_EMAIL_TEMPLATE,
  SIGNIN_EMAIL_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_VERIFIED_EMAIL_TEMPLATE,
  NEW_ORDER_ADMIN_TEMPLATE,
} from "./emailtemplate.js";

// ===========================================
// GMAIL TRANSPORT (EMAIL_USER + EMAIL_PASS)
// Make sure EMAIL_PASS is a Gmail APP password
// ===========================================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // TLS (STARTTLS)
  secure: false, // must be false for port 587
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // your Gmail APP password
  },
});
// Optional: verify connection in logs (non-blocking)
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter verification failed:", err.message);
  } else {
    console.log("✅ Email transporter ready to send messages");
  }
});

const FROM_NAME = "Shree Shayam Café";
const FROM_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL_USER;

// Helper to build "from" field
const fromAddress = `"${FROM_NAME}" <${FROM_EMAIL}>`;

/* =========================
   GENERIC EMAIL HELPER
   (used by /api/contact etc.)
========================= */
export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
    html,
  };

  const response = await transporter.sendMail(mailOptions);
  console.log("✅ Generic email sent:", response.messageId);
};

/* =========================
   SEND VERIFICATION EMAIL
========================= */
export const sendVerificationEmail = async (email, otp) => {
  try {
    const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp);

    const response = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Verify your email – Shree Shayam Café",
      html,
    });

    console.log("✅ Verification email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Email OTP send error:", error);
    throw new Error("Could not send verification email");
  }
};

/* =========================
   SEND WELCOME EMAIL
========================= */
export const sendWelcomeEmail = async (name, email) => {
  try {
    const html = WELCOME_VERIFIED_EMAIL_TEMPLATE(name);

    const response = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "🎉 Welcome to Shree Shayam Café",
      html,
    });

    console.log("✅ Welcome email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Welcome email error:", error);
  }
};

/* =========================
   LOGIN ALERT MAIL
========================= */
export const sendSigninEmail = async (req, name, email) => {
  try {
    const html = SIGNIN_EMAIL_TEMPLATE(
      name,
      new Date().toLocaleString(),
      req.ip
    );

    const response = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "New login alert – Shree Shayam Café",
      html,
    });

    console.log("✅ Sign-in alert email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Sign-in email error:", error);
  }
};

/* =========================
   FORGET PASSWORD LINK
========================= */
export const sendForgetPasswordEmail = async (email, resetToken) => {
  try {
    const html = RESET_PASSWORD_EMAIL_TEMPLATE(resetToken);

    const response = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Reset your password – Shree Shayam Café",
      html,
    });

    console.log("✅ Password reset link email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Reset email error:", error);
    throw new Error("Could not send reset password email");
  }
};

/* =========================
   RESET SUCCESS MAIL
========================= */
export const sendResetPasswordEmail = async (name, email) => {
  try {
    const html = PASSWORD_RESET_SUCCESS_TEMPLATE(name);

    const response = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Password changed successfully ✔️",
      html,
    });

    console.log("✅ Reset success email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Reset success email error:", error);
  }
};

/* =========================
   NEW ORDER → ADMIN NOTIFY
========================= */
export const sendNewOrderEmailToAdmin = async (order) => {
  try {
    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_USER ||
      "sainilalit275@gmail.com";

    const html = NEW_ORDER_ADMIN_TEMPLATE(order);

    const response = await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `New order received – ${order._id}`,
      html,
    });

    console.log("✅ New order email sent:", response.messageId);
  } catch (err) {
    console.error("❌ Error sending new order email:", err);
  }
};
