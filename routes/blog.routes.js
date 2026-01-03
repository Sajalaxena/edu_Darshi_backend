import express from "express";
import {
  createBlog,
  getBlogs,
  deleteBlog,
} from "../controllers/blog.controller.js";
import uploadBlogImage from "../middleware/uploadBlogImage.js";

const router = express.Router();

/**
 * ADMIN
 * Blog image upload (Cloudinary) + create blog
 */


router.post(
  "/admin/upload",
  uploadBlogImage.single("image"), // one file
  createBlog
);


router.delete("/admin/:id", deleteBlog);

/**
 * PUBLIC
 */
router.get("/", getBlogs);

export default router;
