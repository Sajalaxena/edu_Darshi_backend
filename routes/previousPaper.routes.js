import express from "express";
import {
  createPaper,
  getPapers,
  deletePaper,
} from "../controllers/previousPaper.controller.js";

const router = express.Router();

/**
 * ADMIN
 */
router.post("/admin/upload", createPaper);
router.delete("/admin/:id", deletePaper);
/**
 * PUBLIC
 */
router.get("/", getPapers);

export default router;
