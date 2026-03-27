import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

// ADMIN
router.post("/admin/upload", createEvent);
router.put("/admin/:id", updateEvent);
router.delete("/admin/:id", deleteEvent);

// PUBLIC
router.get("/", getEvents);
router.get("/:id", getEventById);

export default router;
