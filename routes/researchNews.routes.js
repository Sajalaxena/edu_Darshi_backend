import express from "express";
import {
  createResearchNews,
  getResearchNews,
  deleteResearchNews,
  getResearchNewsById,
  updateResearchNews,
} from "../controllers/researchNews.controller.js";

const router = express.Router();

/**
 * ADMIN
 */
router.post("/admin/upload", createResearchNews);
router.put("/admin/:id", updateResearchNews);

router.delete("/admin/:id", deleteResearchNews);

/**
 * PUBLIC
 */
router.get("/", getResearchNews);
router.get("/:id", getResearchNewsById);

export default router;
