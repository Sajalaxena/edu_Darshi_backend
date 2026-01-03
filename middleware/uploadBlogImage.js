import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, //  explicit pass
  params: async (req, file) => ({
    folder: "blogs",
    format: file.mimetype.split("/")[1],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const uploadBlogImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadBlogImage;
