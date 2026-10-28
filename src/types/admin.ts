import { TASK_STATUS } from "../consts/consts.js";
import { Task } from "./task.js";

export type AdminTaskListQuery = {
  search?: string;
  status?: string;
};

export type AdminTaskListResponse = {
  tasks: Task[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type TaskStatus = (typeof TASK_STATUS)[number];

export type AdminTaskFilter = {
  search?: string;
  status?: string;
};