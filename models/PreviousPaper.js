import mongoose from "mongoose";

const previousPaperSchema = new mongoose.Schema(
  {
    exam: {
      type: String,
      required: true, // JAM, GATE, NET, etc.
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    paperPdfLink: {
      type: String,
      required: true, // Link to the paper PDF
    },
    solutionYoutubeLink: {
      type: String,
      required: false,
    },
    uploadedBy: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PreviousPaper", previousPaperSchema);
