import { httpClient } from "@/lib/http-client";
import { Document } from "@/types/api";

export const uploadDocumentToWorkspace = async (taskId: string, file: File): Promise<Document> => {
  console.log("Uploading document to workspace:", { taskId, fileName: file.name });
  
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post(`/api/tasks/${taskId}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  console.log("Document uploaded successfully:", response.data);
  return response.data;
};