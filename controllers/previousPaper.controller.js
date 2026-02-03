import PreviousPaper from "../models/PreviousPaper.js";

/**
 * ADMIN: Create paper (Google Drive link)
 */
export const createPaper = async (req, res) => {
  try {
    const { exam, subject, year, paperPdfLink, solutionYoutubeLink } = req.body;

    if (!paperPdfLink.startsWith("https://drive.google.com")) {
      return res.status(400).json({
        message: "Invalid Google Drive link",
      });
    }

    const paper = await PreviousPaper.create({
      exam,
      subject,
      year,
      paperPdfLink,
      solutionYoutubeLink,
    });

    res.status(201).json({
      message: "Previous paper added successfully",
      paper,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create paper",
      error: error.message,
    });
  }
};

/**
 * PUBLIC: Fetch papers
 */
export const getPapers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      PreviousPaper.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      PreviousPaper.countDocuments(),
    ]);

    res.json({
      data: papers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch papers" });
  }
};

/**
 * DELETE /api/previous-papers/:id
 * Admin only
 */
export const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await PreviousPaper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Previous paper not found",
      });
    }

    await paper.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Previous paper deleted successfully",
    });
  } catch (err) {
    console.error("Delete paper error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting paper",
    });
  }
};

/**
 * PUT /api/previous-papers/admin/:id
 * Admin only
 */
export const updatePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { exam, subject, year, paperPdfLink, solutionYoutubeLink } = req.body;

    if (paperPdfLink && !paperPdfLink.startsWith("https://drive.google.com")) {
      return res.status(400).json({
        message: "Invalid Google Drive link",
      });
    }

    const updatedPaper = await PreviousPaper.findByIdAndUpdate(
      id,
      {
        exam,
        subject,
        year,
        paperPdfLink,
        solutionYoutubeLink,
      },
      { new: true, runValidators: true },
    );

    if (!updatedPaper) {
      return res.status(404).json({
        message: "Previous paper not found",
      });
    }

    res.status(200).json({
      message: "Previous paper updated successfully",
      paper: updatedPaper,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update paper",
      error: error.message,
    });
  }
};
