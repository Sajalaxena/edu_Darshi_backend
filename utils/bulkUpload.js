import Question from "../models/Question.js";

export const bulkUploadQuestions = async (req, res) => {
  const questions = req.body.questions;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Questions array required" });
  }

  await Question.insertMany(questions);

  res.status(201).json({
    message: "Questions uploaded successfully",
    total: questions.length,
  });
};
