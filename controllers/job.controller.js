import mongoose from "mongoose";
import Job from "../models/Job.js";
import xlsx from "xlsx";

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

const parseExcelDateToISO = (val) => {
  if (!val) return "";
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof val === "string") {
    const parts = val.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2,"0")}-${parts[2].padStart(2,"0")}`;
      if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
    }
  }
  return String(val);
};

export const bulkUploadJobs = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ message: "Empty file" });
    }

    const jobs = rows.map((r, index) => {
      if (!r.title || !r.deadline) {
        throw new Error(`Invalid row at line ${index + 2}: Title and Deadline are required.`);
      }

      return {
        title: r.title,
        institution: r.institution || "",
        designation: r.designation || "",
        area: r.area || "",
        location: r.location || "",
        postedDate: parseExcelDateToISO(r.postedDate),
        deadline: parseExcelDateToISO(r.deadline),
        description: r.description || "",
        externalLink: r.externalLink || "",
      };
    });

    await Job.insertMany(jobs);

    res.status(201).json({
      message: "Bulk upload successful",
      count: jobs.length,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
