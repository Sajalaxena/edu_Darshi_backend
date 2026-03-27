import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: ["workshop", "seminar", "conference"],
      default: "conference",
      lowercase: true,
    },
    subSubject: {
      type: String,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      enum: ["UG", "PG", "School", "Teaching Enrichment", "All"],
      default: "All",
    },
    venue: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
      type: String,
      required: true,
    },
    applicationDeadline: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    externalLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
