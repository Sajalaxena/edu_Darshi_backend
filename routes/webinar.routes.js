import express from "express";
import {
  createWebinar,
  getWebinars,
  deleteWebinar,
} from "../controllers/webinar.controller.js";

const router = express.Router();

router.post("/", createWebinar);
router.get("/", getWebinars);
router.delete("/:id", deleteWebinar);

export default router;
