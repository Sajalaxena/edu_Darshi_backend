import mongoose from "mongoose";

const researchNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["news", "research"],
      required: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    publishedDate: {
      type: String, // keep string for UI flexibility (Oct 2025 etc.)
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    externalLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ResearchNews", researchNewsSchema);
