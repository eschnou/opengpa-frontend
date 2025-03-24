
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
  if (!taskId) {
    console.error("Cannot progress task: taskId is undefined");
    throw new Error("Task ID is required to progress a task");
  }
  
  console.log("Progressing task:", taskId, "with message:", message);
  const response = await httpClient.post(`/api/tasks/${taskId}`, {
    message: message || "" // Send empty string if no message provided
  });
  console.log("Task progressed:", response.data);
  return response.data;
};

export const progressTaskWithStateData = async (taskId: string, stateData: Record<string, string>): Promise<TaskStepDTO> => {
  if (!taskId) {
    console.error("Cannot progress task with stateData: taskId is undefined");
    throw new Error("Task ID is required to progress a task with state data");
  }
  
  console.log("Progressing task with stateData:", taskId, stateData);
  const response = await httpClient.post(`/api/tasks/${taskId}`, {
    stateData: stateData
  });
  console.log("Task progressed with stateData:", response.data);
  return response.data;
};
