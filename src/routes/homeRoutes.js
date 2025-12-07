import express from "express";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET /api/home  → data for Home page
router.get("/", async (req, res) => {
  try {
    // Specials: items with badge "Special" or fallback to latest few
    let specials = await MenuItem.find({ badge: "Special", isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    if (!specials.length) {
      specials = await MenuItem.find({ isAvailable: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();
    }

    const [totalItems, totalOrders, totalBookings] = await Promise.all([
      MenuItem.countDocuments(),
      Order.countDocuments(),
      Booking.countDocuments(),
    ]);

    res.json({
      specials,
      stats: {
        totalItems,
        totalOrders,
        totalBookings,
      },
    });
  } catch (err) {
    console.error("Home summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
