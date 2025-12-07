import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },

    // Cloudinary URL or any image URL
    imageUrl: { type: String, default: "" },

    // 👇 NEW: Cloudinary public_id (for delete/update)
    imagePublicId: { type: String, default: "" },

    tag: { type: String, default: "" },
    badge: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
