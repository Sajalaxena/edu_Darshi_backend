import mongoose from "mongoose";
import Event from "../models/Event.js";

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
