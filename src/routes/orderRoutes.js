import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendNewOrderEmailToAdmin } from "../utils/emailService.js";

const router = express.Router();

// GET /api/orders  → admin list orders with optional status filter
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/:id  → get single order
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/orders/:id/status  → update only status
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/orders  → create new order (for public order page later)
router.post("/", protect, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      notes,
      source,
      customerName,
      customerPhone,
      customerAddress,
    } = req.body;

    if (!items || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!customerName || !customerPhone || !customerAddress) {
      return res
        .status(400)
        .json({ message: "Name, phone and address are required" });
    }

    const order = await Order.create({
      user: req.user._id, // ✅ always tied to logged-in user
      items,
      totalAmount,
      notes,
      source: source || "Online",
      customerName,
      customerPhone,
      customerAddress,
      status: "Pending", // default (optional if default in schema)
      paymentStatus: "Pending", // optional
    });

    // ✅ fire-and-forget email (no need to block response on success)
    sendNewOrderEmailToAdmin(order).catch((err) =>
      console.error("sendNewOrderEmailToAdmin error:", err)
    );

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
