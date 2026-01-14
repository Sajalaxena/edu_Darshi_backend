// controllers/question.bulkExcel.controller.js
import xlsx from "xlsx";
import csv from "csvtojson";
import Question from "../models/Question.js";

export const bulkUploadFromFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File required" });
  }

  let rows = [];

  // XLSX
  if (req.file.originalname.endsWith(".xlsx")) {
    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = xlsx.utils.sheet_to_json(sheet);
  }

  // CSV
  if (req.file.originalname.endsWith(".csv")) {
    rows = await csv().fromString(req.file.buffer.toString());
  }

  if (!rows.length) {
    return res.status(400).json({ message: "Empty file" });
  }

  const questions = rows.map((row, index) => {
    if (!row.question || !row.correctAnswer || !row.scheduledDate) {
      throw new Error(`Invalid row at index ${index + 1}`);
    }

    return {
      question: row.question,
      options: [
        row.option1,
        row.option2,
        row.option3,
        row.option4,
      ].filter(Boolean),
      correctAnswer: row.correctAnswer,
      explanation: row.explanation || "",
      solutionVideoUrl: row.solutionVideoUrl || "",
      scheduledDate: new Date(row.scheduledDate),
    };
  });

  await Question.insertMany(questions);

  res.status(201).json({
    message: "Excel/CSV questions uploaded successfully",
    count: questions.length,
  });
};
