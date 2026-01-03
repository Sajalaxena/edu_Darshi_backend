import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

// PUBLIC
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// ADMIN
router.post("/admin/upload", createBlog);
router.delete("/admin/:id", deleteBlog);

export default router;
