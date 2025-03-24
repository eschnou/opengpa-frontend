
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

export const progressTask = async (taskId: string, message?: string): Promise<TaskStepDTO> => {
  console.log("Progressing task:", taskId, "with message:", message);
  const response = await httpClient.post(`/api/tasks/${taskId}`, {
    message: message || "" // Send empty string if no message provided
  });
  console.log("Task progressed:", response.data);
  return response.data;
};

export const progressTaskWithStateData = async (taskId: string, stateData: Record<string, string>): Promise<TaskStepDTO> => {
  console.log("Progressing task with stateData:", taskId, stateData);
  const response = await httpClient.post(`/api/tasks/${taskId}`, {
    stateData: stateData
  });
  console.log("Task progressed with stateData:", response.data);
  return response.data;
};
