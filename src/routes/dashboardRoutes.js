// src/routes/dashboardRoutes.js
import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Booking from "../models/Booking.js";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// GET /api/dashboard/overview
router.get("/overview", protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // ---- Orders today ----
    const todaysOrdersList = await Order.find({
      createdAt: { $gte: startOfDay },
    })
      .sort({ createdAt: -1 })
      .lean();

    const todaysOrders = todaysOrdersList.length;
    const pendingOrders = todaysOrdersList.filter(
      (o) => o.status === "Pending" || o.status === "Preparing"
    ).length;
    const completedOrders = todaysOrdersList.filter(
      (o) => o.status === "Completed"
    ).length;

    const revenueToday = todaysOrdersList
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // ---- Active reservations (today / upcoming) ----
    const activeReservations = await Booking.countDocuments({
      status: { $in: ["Confirmed", "Upcoming"] },
    });

    // ---- Popular item today (by title) ----
    let popularItemName = null;
    let popularItemCount = 0;

    if (todaysOrdersList.length) {
      const counts = new Map();
      for (const order of todaysOrdersList) {
        (order.items || []).forEach((it) => {
          const key = it.title || "Unknown";
          counts.set(key, (counts.get(key) || 0) + (it.quantity || 1));
        });
      }
      for (const [title, count] of counts.entries()) {
        if (count > popularItemCount) {
          popularItemCount = count;
          popularItemName = title;
        }
      }
    }

    // ---- Recent activity (orders + bookings) ----
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .lean();

    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const activity = [];

    recentOrders.forEach((o) => {
      activity.push({
        id: `order-${o._id}`,
        type: "order",
        title: `Order #${o._id.toString().slice(-6)} · ${o.status}`,
        timeAgo: o.createdAt?.toLocaleString("en-IN") || "",
        detail: `Total: ₹${o.totalAmount || 0} · ${o.user?.name || "Guest"} (${
          o.source || "Online"
        })`,
      });
    });

    recentBookings.forEach((b) => {
      activity.push({
        id: `booking-${b._id}`,
        type: "booking",
        title: `Reservation · ${b.status || "Pending"}`,
        timeAgo: b.createdAt?.toLocaleString("en-IN") || "",
        detail: `${b.name || "Customer"} · ${b.date || ""} ${b.time || ""} · ${
          b.guests || ""
        } guests`,
      });
    });

    // Sort by createdAt desc (we still have createdAt in objects)
    activity.sort((a, b) => {
      const ad = new Date(a.timeAgo).getTime();
      const bd = new Date(b.timeAgo).getTime();
      return bd - ad;
    });

    const summary = {
      todaysOrders,
      pendingOrders,
      completedOrders,
      revenueToday,
      activeReservations,
      popularItemName,
      popularItemCount,
    };

    res.json({
      summary,
      recentActivity: activity.slice(0, 8),
    });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/summary", protect, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const todayRevenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    const activeReservations = await Booking.countDocuments({
      status: "Confirmed",
    });

    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    res.json({
      todayOrders,
      todayRevenue,
      activeReservations,
      pendingOrders,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
