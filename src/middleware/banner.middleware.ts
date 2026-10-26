import multer from "multer";
import { MAX_FILE_SIZE } from "../consts/consts.js";
import { AppError } from "../errors/AppError.js";

export const uploadBannerImg = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new AppError(400, "Only image upload is allowed"));
      return;
    }
    callback(null, true);
  },
});

export const uploadSingleBannerImage = uploadBannerImg.single("image");
