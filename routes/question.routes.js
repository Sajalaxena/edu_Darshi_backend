import express from "express";
import {
  getTodayQuestion,
  submitAnswer,
  bulkUploadQuestions,
} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/", getTodayQuestion);          // GET /api/question
router.post("/submit", submitAnswer);       // POST /api/question/submit
router.post("/admin/bulk", bulkUploadQuestions);

export default router;
