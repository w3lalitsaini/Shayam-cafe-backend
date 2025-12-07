import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

// helper: always return a settings doc
const getSettingsDoc = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// GET /api/content/about  → for /about page
router.get("/about", async (req, res) => {
  try {
    const s = await getSettingsDoc();
    res.json({
      cafeName: s.cafeName,
      tagline: s.tagline,
      aboutTitle: s.aboutTitle,
      aboutBody: s.aboutBody,
      address: s.address,
      city: s.city,
      phone: s.phone,
      email: s.email,
    });
  } catch (err) {
    console.error("About content error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
