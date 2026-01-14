import express from "express";
import { upload } from "../middleware/uploadquestions.js";
import {
  bulkUploadFromFile,
  getTodayQuestion,
  submitAnswer,
  createSingleQuestion,
} from "../controllers/question.controller.js";

const router = express.Router();

/* -------- PUBLIC -------- */
router.get("/today", getTodayQuestion);
router.post("/submit", submitAnswer);

/* -------- ADMIN -------- */
router.post("/admin", createSingleQuestion);
router.post(
  "/admin/upload",
  upload.single("file"),
  bulkUploadFromFile
);

export default router;
