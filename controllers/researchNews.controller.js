import ResearchNews from "../models/ResearchNews.js";

/**
 * ADMIN – Create research/news
 */
export const createResearchNews = async (req, res) => {
  try {
    const item = await ResearchNews.create(req.body);
    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to create item",
      error: err.message,
    });
  }
};

/**
 * PUBLIC – Get all research/news
 * Supports filter by type: ?type=news | research
 */
export const getResearchNews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const items = await ResearchNews.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      count: items.length,
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch items",
      error: err.message,
    });
  }
};

/**
 * ADMIN – Delete by ID
 */
export const deleteResearchNews = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ResearchNews.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete item",
      error: err.message,
    });
  }
};
