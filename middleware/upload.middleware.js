import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/papers",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

export const uploadPaper = multer({
  storage,
  fileFilter,
});
