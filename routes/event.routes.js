import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  bulkUploadEvents,
} from "../controllers/event.controller.js";
import { upload } from "../middleware/uploadquestions.js";

const router = express.Router();

// ADMIN
router.post("/admin/upload", createEvent);
router.post("/admin/bulk-upload", upload.single("file"), bulkUploadEvents);
router.put("/admin/:id", updateEvent);
router.delete("/admin/:id", deleteEvent);

// PUBLIC
router.get("/", getEvents);
router.get("/:id", getEventById);

export default router;
