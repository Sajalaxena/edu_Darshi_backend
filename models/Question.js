import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    options: {
      type: [String],
      required: true,
      validate: (v) => v.length >= 2,
    },

    correctAnswer: { type: String, required: true },

    explanation: String,

    solutionVideoUrl: String,

    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },

    hasBeenShown: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
