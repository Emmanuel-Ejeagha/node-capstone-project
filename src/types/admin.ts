import { TASK_STATUS } from "../consts/taskStatus.js";
import { Task } from "./task.js";

export type AdminTaskListQuery = {
  search?: string;
  status?: string;
};

export type AdminTaskListResponse = {
  tasks: Task[];
};

export type TaskStatus = (typeof TASK_STATUS)[number];

export type AdminTaskFilter = {
  search?: string;
  status?: string;
};
