import Question from "../models/Question.js";
import xlsx from "xlsx";

/* ================= GET TODAY QUESTION ================= */

export const getTodayQuestion = async (req, res) => {
  const question = await Question.findOne({
    isActive: true,
    hasBeenShown: false,
  }).select("question options");

  if (!question) {
    return res.status(404).json({ message: "No active question today" });
  }

  res.json({ data: question });
};

/* ================= SUBMIT ANSWER ================= */

export const submitAnswer = async (req, res) => {
  const { questionId, answer } = req.body;

  if (!questionId || !answer) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const q = await Question.findById(questionId);
  if (!q) return res.status(404).json({ message: "Question not found" });

  res.json({
    correct: q.correctAnswer === answer,
    explanation: q.explanation,
    solutionVideoUrl: q.solutionVideoUrl,
  });
};

/* ================= ADMIN: SINGLE QUESTION ================= */

export const createSingleQuestion = async (req, res) => {
  const {
    question,
    options,
    correctAnswer,
    explanation,
    solutionVideoUrl,
    scheduledDate,
  } = req.body;

  if (!question || !options?.length || !correctAnswer || !scheduledDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const q = await Question.create({
    question,
    options,
    correctAnswer,
    explanation,
    solutionVideoUrl,
    scheduledDate: new Date(scheduledDate),
  });

  res.status(201).json({ message: "Question created", data: q });
};

/* ================= ADMIN: BULK UPLOAD FROM EXCEL / CSV ================= */

export const bulkUploadFromFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  if (!rows.length) {
    return res.status(400).json({ message: "Empty file" });
  }

  const questions = rows.map((r, index) => {
    if (
      !r.question ||
      !r.option1 ||
      !r.option2 ||
      !r.correctAnswer ||
      !r.scheduledDate
    ) {
      throw new Error(`Invalid row at line ${index + 2}`);
    }

    return {
      question: r.question,
      options: [r.option1, r.option2, r.option3, r.option4].filter(Boolean),
      correctAnswer: r.correctAnswer,
      explanation: r.explanation || "",
      solutionVideoUrl: r.solutionVideoUrl || "",
      scheduledDate: new Date(r.scheduledDate),
    };
  });

  await Question.insertMany(questions);

  res.status(201).json({
    message: "Bulk upload successful",
    count: questions.length,
  });
};
