import Webinar from "../models/webinar.model.js";

/* ================= CREATE ================= */
export const createWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.create(req.body);
    res.status(201).json({
      message: "Webinar created successfully",
      data: webinar,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to create webinar",
      error: err.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ createdAt: -1 });
    res.json({
      data: webinars,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch webinars",
      error: err.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteWebinar = async (req, res) => {
  try {
    await Webinar.findByIdAndDelete(req.params.id);
    res.json({ message: "Webinar deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete webinar",
      error: err.message,
    });
  }
};
