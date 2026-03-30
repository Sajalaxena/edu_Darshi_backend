import express from "express";
import {
  createAcademicPosition,
  getAcademicPositions,
  getAcademicPositionById,
  updateAcademicPosition,
  deleteAcademicPosition,
  bulkUploadAcademicPositions,
} from "../controllers/academicPosition.controller.js";
import { upload } from "../middleware/uploadquestions.js";

const router = express.Router();

// ADMIN
router.post("/admin/upload", createAcademicPosition);
router.post("/admin/bulk-upload", upload.single("file"), bulkUploadAcademicPositions);
router.put("/admin/:id", updateAcademicPosition);
router.delete("/admin/:id", deleteAcademicPosition);

// PUBLIC
router.get("/", getAcademicPositions);
router.get("/:id", getAcademicPositionById);

export default router;
