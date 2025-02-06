import { httpClient } from "@/lib/http-client";
import { TaskDTO, TaskStepDTO } from "@/types/api";

export const createTask = async (prompt: string, file?: File): Promise<TaskDTO> => {
  console.log("Creating task with prompt:", prompt, "and file:", file?.name);
  
  const formData = new FormData();
  formData.append("prompt", prompt);
  if (file) {
    formData.append("file", file);
  }
  
  // Log the FormData contents for debugging
  for (const pair of formData.entries()) {
    console.log('FormData content:', pair[0], pair[1]);
  }
  
  const response = await httpClient.post("/api/tasks", formData, {
    headers: {
      // Let Axios set the Content-Type header automatically for multipart/form-data
      // Including the boundary parameter
    }
  });
  
  console.log("Task created response:", response.data);
  return response.data;
};

export const progressTask = async (taskId: string, message: string): Promise<TaskStepDTO> => {
  console.log("Progressing task:", taskId, "with message:", message);
  const response = await httpClient.post(`/api/tasks/${taskId}`, { message });
  console.log("Task progressed:", response.data);
  return response.data;
};