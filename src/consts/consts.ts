import e from "cors";

export const TASK_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ADMIN_BANNERS_CACHE_KEY = "admin:banners";
export const ADMIN_BANNERS_CACHE_TTL_SECONDS = 60;

export const QUEUE_NAME = "cloudinary-jobs";
export const DELETE_CLOUDINARY_IMAGE_JOB = "delete-cloudinary-image";
