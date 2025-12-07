import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const cafeSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Brew Haven Café" },
    address: { type: String, default: "" },
    openingTime: { type: String, default: "08:00" }, // HH:mm
    closingTime: { type: String, default: "23:00" },
  },
  { _id: false }
);

const featuresSchema = new mongoose.Schema(
  {
    onlineOrders: { type: Boolean, default: true },
    reservations: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    owner: { type: ownerSchema, default: () => ({}) },
    cafe: { type: cafeSchema, default: () => ({}) },
    features: { type: featuresSchema, default: () => ({}) },

    // Optional extras for future:
    // theme: { type: String, default: "dark" },
    // announcement: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
