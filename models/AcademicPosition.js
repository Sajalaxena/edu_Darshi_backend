import mongoose from "mongoose";

const academicPositionSchema = new mongoose.Schema(
  {
    positionType: {
      type: String,
      enum: ["masters", "phd", "postdoc", "project", "bs/bsc/b.tech"],
      required: true,
      lowercase: true,
    },
    courseName: {
      type: String,
      trim: true,
      default: "",
    },
    institution: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    areaOfResearch: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
      type: String,
      trim: true,
      default: "",
    },
    lastDate: {
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
    homePriority: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AcademicPosition", academicPositionSchema);
