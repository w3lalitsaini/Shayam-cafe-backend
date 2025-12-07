import express from "express";
import Booking from "../models/Booking.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/bookings  → admin list
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) filter.date = date;

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/bookings/:id/status  → admin update status
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/bookings  → public reservation request (from /reservations page)
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, phone, date, time, guests, type, notes } =
      req.body;

    if (!name || !date || !time || !guests) {
      return res.status(400).json({
        message: "Name, date, time and guests are required",
      });
    }

    const booking = await Booking.create({
      user: userId || null,
      name,
      email,
      phone,
      date,
      time,
      guests,
      type,
      notes,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
