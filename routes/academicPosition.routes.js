import express from "express";
import {
  createAcademicPosition,
  getAcademicPositions,
  getAcademicPositionById,
  updateAcademicPosition,
  deleteAcademicPosition,
} from "../controllers/academicPosition.controller.js";

const router = express.Router();

// ADMIN
router.post("/admin/upload", createAcademicPosition);
router.put("/admin/:id", updateAcademicPosition);
router.delete("/admin/:id", deleteAcademicPosition);

// PUBLIC
router.get("/", getAcademicPositions);
router.get("/:id", getAcademicPositionById);

export default router;
