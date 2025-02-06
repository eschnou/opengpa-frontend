import { httpClient } from "@/lib/http-client";
import { TaskDTO, TaskStepDTO } from "@/types/api";

export const createTask = async (message: string): Promise<TaskDTO> => {
  console.log("Creating task with message:", message);
  
  const response = await httpClient.post("/api/tasks", {
    message: message
  });
  
  console.log("Task created response:", response.data);
  return response.data;
};

export const progressTask = async (taskId: string): Promise<TaskStepDTO> => {
  console.log("Progressing task:", taskId);
  const response = await httpClient.post(`/api/tasks/${taskId}`, {
    message: "" // Empty message since we don't want to repeat the input
  });
  console.log("Task progressed:", response.data);
  return response.data;
};