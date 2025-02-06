import { httpClient } from "@/lib/http-client";
import { TaskDTO, TaskStepDTO } from "@/types/api";

export const createTask = async (prompt: string, file?: File): Promise<TaskDTO> => {
  console.log("Creating task with prompt:", prompt, "and file:", file?.name);
  const formData = new FormData();
  formData.append("prompt", prompt);
  if (file) {
    formData.append("file", file);
  }
  const response = await httpClient.post("/api/tasks", formData);
  console.log("Task created:", response.data);
  return response.data;
};

export const progressTask = async (taskId: string, message: string): Promise<TaskStepDTO> => {
  console.log("Progressing task:", taskId, "with message:", message);
  const response = await httpClient.post(`/api/tasks/${taskId}`, { message });
  console.log("Task progressed:", response.data);
  return response.data;
};