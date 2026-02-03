import Question from "../models/Question.js";

export const bulkUploadQuestions = async (req, res) => {
  const questions = req.body.questions;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Questions array required" });
  }

  const dates = questions.map((q) => new Date(q.scheduledDate).toISOString());

  if (new Set(dates).size !== dates.length) {
    return res
      .status(400)
      .json({ message: "Duplicate scheduledDate in upload" });
  }

  try {
    await Question.insertMany(questions, { ordered: true });
    res.status(201).json({
      message: "Questions uploaded successfully",
      total: questions.length,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "One or more questions already exist for a date",
      });
    }
    res.status(500).json({ message: err.message });
  }
};
