import Blog from "../models/Blog.js";
import mongoose from "mongoose";

/**
 * ADMIN: Create Blog
 * Image upload on Cloudinary
 */
export const createBlog = async (req, res) => {
  try {
    const { title, summary, content, category, author } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({
        message: "title, summary, content and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image file missing (field name must be 'image')",
      });
    }

    const imageUrl = req.file.path;

    const blog = await Blog.create({
      title,
      summary,
      content,
      category,
      author: author || "admin",
      imageUrl,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      message: "Failed to create blog",
    });
  }
};

/**
 * PUBLIC: Get All Blogs (with pagination)
 */
export const getBlogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 6);
    const skip = (page - 1) * limit;

    const { category } = req.query;

    const filter = category
      ? { category, isPublished: true }
      : { isPublished: true };

    const [blogs, totalItems] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id title summary author category imageUrl publishedAt"),
      Blog.countDocuments(filter),
    ]);

    return res.status(200).json({
      data: blogs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
};

/**
 * PUBLIC: Get Blog By ID
 */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Invalid Mongo ID safety
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      data: blog,
    });
  } catch (error) {
    console.error("Get blog by id error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * ADMIN: Delete Blog
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({
      message: "Server error while deleting blog",
    });
  }
};
