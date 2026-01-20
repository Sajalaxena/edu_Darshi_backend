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

/* ================= UPDATE ================= */
export const updateWebinar = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Basic ObjectId safety (recommended)
    if (!id || id.length !== 24) {
      return res.status(400).json({
        message: "Invalid webinar ID",
      });
    }

    const updatedWebinar = await Webinar.findByIdAndUpdate(
      id,
      { $set: req.body }, // partial update
      { new: true, runValidators: true },
    );

    if (!updatedWebinar) {
      return res.status(404).json({
        message: "Webinar not found",
      });
    }

    res.status(200).json({
      message: "Webinar updated successfully",
      data: updatedWebinar,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to update webinar",
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
