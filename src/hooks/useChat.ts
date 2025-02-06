import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { TaskStepDTO, TaskDTO } from "@/types/api";
import { httpClient } from "@/lib/http-client";
import { createTask, progressTask } from "@/services/task.service";
import { uploadDocumentToWorkspace } from "@/services/document.service";

const fetchTaskSteps = async (taskId: string): Promise<TaskStepDTO[]> => {
  console.log("Fetching steps for task:", taskId);
  const response = await httpClient.get(`/api/tasks/${taskId}/steps`);
  console.log("Steps fetched:", response.data);
  return response.data;
};

const fetchTask = async (taskId: string): Promise<TaskDTO> => {
  console.log("Fetching task:", taskId);
  const response = await httpClient.get(`/api/tasks/${taskId}`);
  console.log("Task fetched:", response.data);
  return response.data;
};

export const useChat = (taskId?: string, onTaskCreated?: (taskId: string) => void) => {
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const stopProcessingRef = useRef(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: task } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(taskId!),
    enabled: !!taskId,
  });

  const { data: steps, isLoading } = useQuery({
    queryKey: ["taskSteps", taskId],
    queryFn: () => fetchTaskSteps(taskId!),
    enabled: !!taskId,
  });

  const handleStopProcessing = () => {
    console.log("Stop processing requested");
    stopProcessingRef.current = true;
    setIsStopping(true);
  };

  const handleFileAttachment = async (file: File) => {
    console.log("Handling file attachment:", file.name);
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    setAttachedFile(file);
    toast({
      title: "File attached",
      description: "Your file has been attached and will be uploaded when you send your message.",
    });
  };

  const processTaskLoop = async (taskId: string, initialMessage?: string) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (attempts < MAX_ATTEMPTS) {
      if (stopProcessingRef.current) {
        console.log("Stopping task processing as requested");
        toast({
          title: "Processing stopped",
          description: "Task processing was stopped as requested.",
        });
        break;
      }

      attempts++;
      console.log(`Starting progress attempt ${attempts}`);
      
      const currentStep = await progressTask(taskId, attempts === 1 ? initialMessage : undefined);
      console.log(`Task progress attempt ${attempts}:`, currentStep);
      
      await queryClient.invalidateQueries({ queryKey: ["taskSteps", taskId] });
      
      if (currentStep.action?.final || currentStep.result?.final) {
        console.log("Task completed with final step");
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        break;
      }
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !attachedFile) || isProcessing) return;

    setIsProcessing(true);
    stopProcessingRef.current = false;
    setIsStopping(false);
    const currentMessage = message;
    setMessage(""); // Clear the message immediately
    
    try {
      console.log("Starting to process message...", { hasFile: !!attachedFile });
      
      let currentTaskId = taskId;
      
      if (!currentTaskId) {
        // Create new task
        console.log("Creating new task...");
        const newTask = await createTask(currentMessage);
        console.log("Task created successfully:", newTask);
        currentTaskId = newTask.id;
        
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        
        if (onTaskCreated) {
          onTaskCreated(newTask.id);
        }
      }

      // Upload file if attached
      if (attachedFile) {
        console.log("Uploading file...");
        try {
          await uploadDocumentToWorkspace(currentTaskId, attachedFile);
          toast({
            title: "File uploaded",
            description: "Your file has been uploaded successfully.",
          });
          setAttachedFile(null); // Clear the attached file after successful upload
        } catch (error) {
          console.error("Error uploading file:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload file. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      await processTaskLoop(currentTaskId, currentMessage);
    } catch (error) {
      console.error("Error processing task:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      stopProcessingRef.current = false;
      setIsStopping(false);
    }
  };

  return {
    message,
    setMessage,
    attachedFile,
    handleFileAttachment,
    isProcessing,
    isStopping,
    task,
    steps,
    isLoading,
    handleStopProcessing,
    handleSendMessage,
  };
};