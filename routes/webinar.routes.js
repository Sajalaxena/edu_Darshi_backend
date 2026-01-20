import express from "express";
import {
  createWebinar,
  getWebinars,
  deleteWebinar,
  updateWebinar,
} from "../controllers/webinar.controller.js";

const router = express.Router();

router.post("/", createWebinar);
router.get("/", getWebinars);
router.delete("/:id", deleteWebinar);
router.put("/admin/:id", updateWebinar);
export default router;
