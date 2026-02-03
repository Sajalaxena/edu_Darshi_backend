import express from "express";
import { upload } from "../middleware/uploadquestions.js";
import {
  bulkUploadFromFile,
  getTodayQuestion,
  submitAnswer,
  createSingleQuestion,
  deleteQuestion,
  getAllQuestions
} from "../controllers/question.controller.js";

const router = express.Router();

/* -------- PUBLIC -------- */
router.get("/today", getTodayQuestion);
router.post("/submit", submitAnswer);
// routes/question.routes.js
router.delete("/admin/:id", deleteQuestion);

/* -------- ADMIN -------- */
router.post("/admin", createSingleQuestion);
router.post("/admin/upload", upload.single("file"), bulkUploadFromFile);
// routes/question.routes.js
router.get("/admin/all", getAllQuestions);

export default router;
