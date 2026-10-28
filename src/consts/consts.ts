import e from "cors";

export const TASK_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ADMIN_BANNERS_CACHE_KEY = "admin:banners";
export const ADMIN_BANNERS_CACHE_TTL_SECONDS = 300; // 5 minutes - improved from 60s

export const QUEUE_NAME = "cloudinary-jobs";
export const DELETE_CLOUDINARY_IMAGE_JOB = "delete-cloudinary-image";
export const CACHE_INVALIDATION_QUEUE = "cache-invalidation";
