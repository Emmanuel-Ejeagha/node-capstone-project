import multer from "multer";
import { MAX_FILE_SIZE } from "../consts/consts.js";
import { AppError } from "../errors/AppError.js";

// Allowed image file extensions (checked case-insensitively)
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const checkFileExtension = (originalname: string): boolean => {
  if (!originalname) return false;
  const ext = `.${originalname.split(".").pop()?.toLowerCase() || ""}`;
  return ALLOWED_IMAGE_EXTENSIONS.includes(ext);
};

export const uploadBannerImg = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, callback) => {
    // 1. Check file extension (more reliable than MIME type, hard to spoof)
    const extensionValid = checkFileExtension(file.originalname);

    // 2. Check MIME type (basic defense; can be spoofed but stops casual violations)
    const mimeTypeValid = file.mimetype?.startsWith("image/");

    if (!extensionValid || !mimeTypeValid) {
      const allowedExts = ALLOWED_IMAGE_EXTENSIONS.join(", ");
      const error = new AppError(
        400,
        `Invalid file type. Allowed extensions: ${allowedExts}. MIME type must start with "image/"`
      );
      return callback(error);
    }

    callback(null, true);
  },
});

export const uploadSingleBannerImage = uploadBannerImg.single("image");
