import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { UploadStream } from "cloudinary";

type UploadResult = {
  secureUrl: string;
  publicId: string;
};

export async function uploadBannerImageToCloudinary(
  buffer: Buffer,
  options?: { folder?: string },
): Promise<UploadResult> {
  const cloudName = env.cloudinaryCloudName;
  const apiKey = env.cloudinaryApiKey;
  const apiSecret = env.cloudinaryApiSecret;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError(500, "Cloudinary is not configured properly ");

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: options?.folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve({
            secureUrl: result?.secure_url ?? "",
            publicId: result?.public_id ?? "",
          });
        },
      );
      uploadStream.end(buffer);
    });
  }
}
