import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  bulkUploadJobs,
} from "../controllers/job.controller.js";
import { upload } from "../middleware/uploadquestions.js";

const router = express.Router();

// ADMIN
router.post("/admin/upload", createJob);
router.post("/admin/bulk-upload", upload.single("file"), bulkUploadJobs);
router.put("/admin/:id", updateJob);
router.delete("/admin/:id", deleteJob);

// PUBLIC
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;
