import mongoose from "mongoose";
import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const item = await Job.create(req.body);
    res.status(201).json({ message: "Job created successfully", data: item });
  } catch (err) {
    res.status(400).json({ message: "Failed to create job", error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { institution: { $regex: req.query.search, $options: "i" } },
        { designation: { $regex: req.query.search, $options: "i" } },
        { area: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }
    const items = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid job ID" });
    const item = await Job.findById(id);
    if (!item) return res.status(404).json({ message: "Job not found" });
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid job ID" });
    const updated = await Job.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated successfully", data: updated });
  } catch (err) {
    res.status(400).json({ message: "Failed to update job", error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid job ID" });
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
