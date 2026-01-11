import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
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
  createBlog
);

router.delete("/admin/:id", deleteBlog);

export default router;
