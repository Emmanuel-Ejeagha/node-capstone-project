import { Queue } from "bullmq";
import { DELETE_CLOUDINARY_IMAGE_JOB, QUEUE_NAME } from "../consts/consts.js";
import { bullmqConnection } from "../lib/redis.js";
import { DeleteCloudinaryImageJobData } from "../types/deleteCloudinaryImgJobData.js";

export const deleteCloudinaryImageQueue = new Queue(QUEUE_NAME, {
  connection: bullmqConnection,
});

export async function addDeleteCloudinaryImageJob(
  publicId: string,
): Promise<void> {
  const jobData: DeleteCloudinaryImageJobData = { publicId };

  await deleteCloudinaryImageQueue.add(DELETE_CLOUDINARY_IMAGE_JOB, jobData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
}
