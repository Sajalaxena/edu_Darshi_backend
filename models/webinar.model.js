import mongoose from "mongoose";

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // keep string for flexibility (12 Feb 2026)
      required: true,
    },
    time: {
      type: String, // 7:00 PM IST
      required: true,
    },
    platform: {
      type: String, // Zoom / YouTube
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    registrationLink: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Webinar", webinarSchema);
