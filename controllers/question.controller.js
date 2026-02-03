import Question from "../models/Question.js";
import xlsx from "xlsx";

/* ================= GET TODAY QUESTION ================= */


const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);
export const getTodayQuestion = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const question = await Question.findOne({
      scheduledDate: { $gte: start, $lte: end },
    }).select("question options");

    if (!question) {
      return res.status(404).json({ message: "No question scheduled for today" });
    }

    res.json({ data: question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Question already exists for this date" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ scheduledDate: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/question.controller.js
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
