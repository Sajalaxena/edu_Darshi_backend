import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      required: true, // short text shown on blog card
      maxlength: 500,
    },

    content: {
      type: String,
      required: true, // full description (Read More)
    },

    category: {
      type: String,
      required: true, // AI, ML, Java, Web, DSA, etc.
      index: true,
    },

    imageUrl: {
      type: String,
      required: true, // Cloudinary image URL
    },

    author: {
      type: String,
      default: "admin",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now, // used by frontend
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Blog", blogSchema);
