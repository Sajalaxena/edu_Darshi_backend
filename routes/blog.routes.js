import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

import uploadBlogImage from "../middleware/uploadBlogImage.js";

const router = express.Router();

// PUBLIC
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// ADMIN
router.post(
  "/admin/upload",
  uploadBlogImage.single("image"), // 👈 VERY IMPORTANT
  createBlog,
);

// ADMIN: Update blog
router.put(
  "/admin/:id",
  uploadBlogImage.single("image"), // image OPTIONAL
  updateBlog,
);

router.delete("/admin/:id", deleteBlog);

export default router;
