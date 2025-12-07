import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/account/profile
 * -> data for /account (AccountProfile)
 */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -emailVerificationOTP -emailVerificationExpires -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Account profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/account/profile
 * body: { name?, phone? }
 */
router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
    }).select(
      "-password -emailVerificationOTP -emailVerificationExpires -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/account/change-password
 * body: { currentPassword, newPassword }
 */
router.patch("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // will be hashed by pre-save hook
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/account/orders
 * -> list orders for logged-in user (AccountOrders)
 */
router.get("/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    console.error("Account orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/account/reservations
 * -> list reservations for logged-in user (AccountReservations)
 */
router.get("/reservations", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("Account reservations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
