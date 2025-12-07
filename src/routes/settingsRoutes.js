import express from "express";
import Settings from "../models/Settings.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Always keep a single settings doc
const getSettingsDoc = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({}); // uses schema defaults
  }
  return settings;
};

// GET /api/settings  → admin fetch
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const settings = await getSettingsDoc();
    res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/settings  → admin update
router.put("/", protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body; // { owner, cafe, features }
    let settings = await getSettingsDoc();

    // merge shallowly – for more control you can do per field
    if (updates.owner) {
      settings.owner = { ...settings.owner.toObject(), ...updates.owner };
    }
    if (updates.cafe) {
      settings.cafe = { ...settings.cafe.toObject(), ...updates.cafe };
    }
    if (updates.features) {
      settings.features = {
        ...settings.features.toObject(),
        ...updates.features,
      };
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
