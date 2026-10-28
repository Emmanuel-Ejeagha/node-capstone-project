import { Worker } from "bullmq";
import { DELETE_CLOUDINARY_IMAGE_JOB, QUEUE_NAME } from "../consts/consts.js";
import { deleteBannerImageFromCloudinary } from "../lib/cloudinary.js";
import { DeleteCloudinaryImageJobData } from "../types/deleteCloudinaryImgJobData.js";
import { bullmqConnection } from "../lib/redis.js";
import { logger } from "../lib/logger.js";

export const deleteCloudinaryImageWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name !== DELETE_CLOUDINARY_IMAGE_JOB) {
      return;
    }

    const data = job.data as DeleteCloudinaryImageJobData;

    await deleteBannerImageFromCloudinary(data.publicId);
  },
  {
    connection: bullmqConnection,
  },
);

deleteCloudinaryImageWorker.on("completed", (job) => {
  logger.info(`Cloudinary delete job completed: ${job.id}`);
});

deleteCloudinaryImageWorker.on("failed", (job, error) => {
  logger.error(
    {
      err: error,
      jobId: job?.id,
    },
    "Cloudinary delete job failed",
  );
});

logger.info("Delete Cloudinary image worker started");
