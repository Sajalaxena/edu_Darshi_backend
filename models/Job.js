import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    area: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    postedDate: {
      type: String,
      default: "",
    },
    deadline: {
      type: String,
      required: true,
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

export default mongoose.model("Job", jobSchema);
