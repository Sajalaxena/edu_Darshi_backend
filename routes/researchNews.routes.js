import express from "express";
import {
  createResearchNews,
  getResearchNews,
  deleteResearchNews,
} from "../controllers/researchNews.controller.js";

const router = express.Router();

/**
 * ADMIN
 */
router.post("/admin/research-news", createResearchNews);
router.delete("/admin/research-news/:id", deleteResearchNews);

/**
 * PUBLIC
 */
router.get("/research-news", getResearchNews);

export default router;
