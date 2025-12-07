import express from "express";
import MenuItem from "../models/MenuItem.js";
import { protect, adminOnly } from "../middleware/auth.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ===== CLOUDINARY CONFIG =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "brewhaven/menu",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });

// ============================
// GET /api/menu  → public
// ============================
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// GET /api/menu/:id  → public
// ============================
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("Get item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// POST /api/menu  → admin create
// ============================
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // optional file
  async (req, res) => {
    try {
      const {
        title,
        category,
        price,
        description,
        imageUrl, // optional text URL
        tag,
        badge,
        isAvailable,
      } = req.body;

      if (!title || !category || !price) {
        return res
          .status(400)
          .json({ message: "Title, category and price are required" });
      }

      let finalImageUrl = imageUrl || "";
      let imagePublicId = "";

      // If file uploaded → upload to Cloudinary
      if (req.file && req.file.buffer) {
        try {
          const result = await uploadToCloudinary(req.file.buffer);
          finalImageUrl = result.secure_url;
          imagePublicId = result.public_id;
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          return res
            .status(500)
            .json({ message: "Image upload failed, please try again." });
        }
      }

      const item = await MenuItem.create({
        title,
        category,
        price: Number(price),
        description,
        imageUrl: finalImageUrl,
        imagePublicId,
        tag,
        badge,
        isAvailable:
          typeof isAvailable === "string"
            ? isAvailable === "true"
            : !!isAvailable,
      });

      res.status(201).json(item);
    } catch (err) {
      console.error("Create menu item error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ============================
// PATCH /api/menu/:id  → admin update
// supports new image file OR just fields
// ============================
router.patch(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"), // optional new file
  async (req, res) => {
    try {
      const item = await MenuItem.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });

      const updates = { ...req.body };

      if (updates.price !== undefined) {
        updates.price = Number(updates.price);
      }

      if (updates.isAvailable !== undefined) {
        updates.isAvailable =
          typeof updates.isAvailable === "string"
            ? updates.isAvailable === "true"
            : !!updates.isAvailable;
      }

      // If text imageUrl updated (no file)
      if (updates.imageUrl && !req.file) {
        // you might NOT want to auto-delete old Cloudinary image here,
        // but if you do:
        if (item.imagePublicId) {
          try {
            await cloudinary.uploader.destroy(item.imagePublicId);
          } catch (errDestroy) {
            console.error(
              "Cloudinary destroy error (update text URL):",
              errDestroy
            );
          }
        }
        // keep only the new URL, clear publicId
        updates.imagePublicId = "";
      }

      // If file uploaded → upload new and delete old from Cloudinary
      if (req.file && req.file.buffer) {
        try {
          const result = await uploadToCloudinary(req.file.buffer);

          // delete old image if existed
          if (item.imagePublicId) {
            try {
              await cloudinary.uploader.destroy(item.imagePublicId);
            } catch (errDestroy) {
              console.error(
                "Cloudinary destroy error (update file):",
                errDestroy
              );
            }
          }

          updates.imageUrl = result.secure_url;
          updates.imagePublicId = result.public_id;
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          return res
            .status(500)
            .json({ message: "Image upload failed, please try again." });
        }
      }

      const updated = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });

      res.json(updated);
    } catch (err) {
      console.error("Update menu item error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ============================
// DELETE /api/menu/:id  → admin delete
// delete DB doc + Cloudinary image
// ============================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // delete image from Cloudinary if present
    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (errDestroy) {
        console.error("Cloudinary destroy error (delete):", errDestroy);
        // we still continue with DB delete
      }
    }

    await item.deleteOne();

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Delete menu item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
