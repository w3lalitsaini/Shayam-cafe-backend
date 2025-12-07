import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    email: String,
    phone: String,

    date: { type: String, required: true }, // e.g. "2025-12-05"
    time: { type: String, required: true }, // e.g. "19:30"
    guests: { type: Number, required: true },

    type: {
      type: String,
      enum: ["Dine-in", "Birthday", "Meeting", "Other"],
      default: "Dine-in",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    notes: String,
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
