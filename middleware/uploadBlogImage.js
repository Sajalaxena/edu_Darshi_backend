import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "blogs",

    //CLOUDINARY AUTO-DETECT FORMAT
    resource_type: "image",

    // PUBLIC ID (no extension)
    public_id: `blog-${Date.now()}`,
  }),
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PNG, JPG, JPEG, WEBP images are allowed"),
      false
    );
  }
};

const uploadBlogImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default uploadBlogImage;
