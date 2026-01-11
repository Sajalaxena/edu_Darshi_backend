import Question from "../models/Question.js";

export const getTodayQuestion = async (req, res) => {
  let question = await Question.findOne({ isActive: true }).select(
    "question options"
  );

  // 🔥 fallback: agar active question nahi mila
  if (!question) {
    question = await Question.findOne().select("question options");
  }

  if (!question) {
    return res.status(404).json({
      message: "No question found",
    });
  }

  res.json({ data: question });
};


export const submitAnswer = async (req, res) => {
  const { questionId, answer } = req.body;
  const q = await Question.findById(questionId);
  if (!q) return res.status(404).json({ message: "Question not found" });

  res.json({
    correct: q.correctAnswer === answer,
    explanation: q.explanation,
    solutionVideoUrl: q.solutionVideoUrl,
  });
};

export const bulkUploadQuestions = async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || !questions.length) {
    return res.status(400).json({ message: "Questions array required" });
  }

  await Question.insertMany(questions);
  res.status(201).json({
    message: "Bulk questions uploaded",
    count: questions.length,
  });
};
