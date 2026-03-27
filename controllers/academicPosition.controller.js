import mongoose from "mongoose";
import AcademicPosition from "../models/AcademicPosition.js";

export const createAcademicPosition = async (req, res) => {
  try {
    const item = await AcademicPosition.create(req.body);
    res.status(201).json({ message: "Academic position created successfully", data: item });
  } catch (err) {
    res.status(400).json({ message: "Failed to create academic position", error: err.message });
  }
};

export const getAcademicPositions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.positionType) filter.positionType = req.query.positionType;
    if (req.query.search) {
      filter.$or = [
        { courseName: { $regex: req.query.search, $options: "i" } },
        { institution: { $regex: req.query.search, $options: "i" } },
        { areaOfResearch: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }
    const items = await AcademicPosition.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch academic positions", error: err.message });
  }
};

export const getAcademicPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });
    const item = await AcademicPosition.findById(id);
    if (!item) return res.status(404).json({ message: "Academic position not found" });
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateAcademicPosition = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });
    const updated = await AcademicPosition.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Academic position not found" });
    res.json({ message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(400).json({ message: "Failed to update", error: err.message });
  }
};

export const deleteAcademicPosition = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });
    const deleted = await AcademicPosition.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Academic position not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
