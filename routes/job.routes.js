import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// ADMIN
router.post("/admin/upload", createJob);
router.put("/admin/:id", updateJob);
router.delete("/admin/:id", deleteJob);

// PUBLIC
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;
