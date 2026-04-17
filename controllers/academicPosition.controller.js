import mongoose from "mongoose";
import AcademicPosition from "../models/AcademicPosition.js";
import xlsx from "xlsx";

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
    if (req.query.homepage === "true") {
      filter.homePriority = { $in: [1, 2, 3, 4] };
      const items = await AcademicPosition.find(filter).sort({ homePriority: 1 });
      return res.json({ count: items.length, data: items });
    }
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

export const bulkUploadAcademicPositions = async (req, res) => {
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

    const positions = rows.map((r, index) => {
      if (!r.positionType || !r.lastDate) {
        throw new Error(`Invalid row at line ${index + 2}: Position Type and Last Date are required.`);
      }

      return {
        positionType: String(r.positionType).toLowerCase(),
        courseName: r.courseName || "",
        institution: r.institution || "",
        location: r.location || "",
        areaOfResearch: r.areaOfResearch || "",
        startDate: parseExcelDateToISO(r.startDate),
        lastDate: parseExcelDateToISO(r.lastDate),
        description: r.description || "",
        externalLink: r.externalLink || "",
        homePriority: r.homePriority ? Number(r.homePriority) : null,
      };
    });

    await AcademicPosition.insertMany(positions);

    res.status(201).json({
      message: "Bulk upload successful",
      count: positions.length,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
