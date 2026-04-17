import mongoose from "mongoose";
import Event from "../models/Event.js";
import xlsx from "xlsx";

export const createEvent = async (req, res) => {
  try {
    const item = await Event.create(req.body);
    res.status(201).json({ message: "Event created successfully", data: item });
  } catch (err) {
    res.status(400).json({ message: "Failed to create event", error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.homepage === "true") {
      filter.homePriority = { $in: [1, 2, 3, 4] };
      const items = await Event.find(filter).sort({ homePriority: 1 });
      return res.json({ count: items.length, data: items });
    }
    if (req.query.eventType) filter.eventType = req.query.eventType;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.subSubject) filter.subSubject = { $regex: req.query.subSubject, $options: "i" };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { venue: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }
    const items = await Event.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid event ID" });
    const item = await Event.findById(id);
    if (!item) return res.status(404).json({ message: "Event not found" });
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid event ID" });
    const updated = await Event.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully", data: updated });
  } catch (err) {
    res.status(400).json({ message: "Failed to update event", error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid event ID" });
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const parseExcelDateToText = (val) => {
  if (!val) return "";
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  return String(val);
};

export const bulkUploadEvents = async (req, res) => {
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

    const events = rows.map((r, index) => {
      if (!r.title || !r.startDate) {
        throw new Error(`Invalid row at line ${index + 2}: title and startDate are required.`);
      }

      return {
        title: r.title,
        eventType: r.eventType || "conference",
        subSubject: r.subSubject || "",
        level: r.level ? String(r.level).split(/[,\/]+/).map(l => l.trim()) : ["UG"],
        venue: r.venue || "",
        startDate: parseExcelDateToText(r.startDate),
        applicationDeadline: parseExcelDateToText(r.applicationDeadline),
        description: r.description || "",
        externalLink: r.externalLink || "",
        homePriority: r.homePriority ? Number(r.homePriority) : null,
      };
    });

    await Event.insertMany(events);

    res.status(201).json({
      message: "Bulk upload successful",
      count: events.length,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
