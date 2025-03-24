
import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { TaskStepDTO, TaskDTO } from "@/types/api";
import { httpClient } from "@/lib/http-client";
import { createTask, progressTask, progressTaskWithStateData, progressTaskWithEmptyPayload } from "@/services/task.service";
import { workspaceService } from "@/services/workspace.service";

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
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
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

  const handleFileAttachment = (file: File | null) => {
    console.log("Handling file attachment:", file?.name);
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    setAttachedFile(file);
    if (file) {
      toast({
        title: "File attached",
        description: "Your file has been attached and will be uploaded when you send your message.",
      });
    }
  };

  const processTaskLoop = async (taskId: string, initialMessage?: string) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

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
      
      // Check if we need to wait for user input
      if (currentStep.result?.status === "AWAITING_INPUT") {
        console.log("Task is awaiting user input");
        setIsAwaitingInput(true);
        setIsProcessing(false);
        return; // Exit the loop and wait for user confirmation
      }
      
      if (currentStep.action?.final || currentStep.result?.final) {
        console.log("Task completed with final step");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
        ]);
        break;
      }
    }
  };

  const handleConfirmInput = async (taskId: string, stateData: Record<string, string>) => {
    if (!taskId) {
      console.error("Cannot confirm input: taskId is undefined");
      toast({
        title: "Error",
        description: "Cannot process input without a valid task ID",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    
    console.log("Confirming input with state data:", stateData);
    setIsProcessing(true);
    setIsAwaitingInput(false);
    
    try {
      const step = await progressTaskWithStateData(taskId, stateData);
      await queryClient.invalidateQueries({ queryKey: ["taskSteps", taskId] });
      
      // Check if this was the final step
      if (step.action?.final || step.result?.final) {
        console.log("Task completed with final step after input confirmation");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
        ]);
        setIsProcessing(false);
        return;
      }
      
      // Continue processing if not awaiting more input
      if (step.result?.status !== "AWAITING_INPUT") {
        await processTaskLoop(taskId);
      } else {
        setIsAwaitingInput(true);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error confirming input:", error);
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleCancelInput = async () => {
    if (!taskId) {
      console.error("Cannot cancel input: taskId is undefined");
      toast({
        title: "Error",
        description: "Cannot cancel without a valid task ID",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Input cancelled by user, sending empty payload");
    setIsProcessing(true);
    setIsAwaitingInput(false);
    
    try {
      // Send an empty payload (no message, no stateData)
      const step = await progressTaskWithEmptyPayload(taskId);
      await queryClient.invalidateQueries({ queryKey: ["taskSteps", taskId] });
      
      toast({
        title: "Input cancelled",
        description: "You can continue the conversation by sending a new message.",
      });
      
      setIsProcessing(false);
    } catch (error) {
      console.error("Error cancelling input:", error);
      toast({
        title: "Error",
        description: "Failed to cancel. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !attachedFile) || isProcessing) return;

    setIsProcessing(true);
    stopProcessingRef.current = false;
    setIsStopping(false);
    const currentMessage = message;
    setMessage("");
    
    try {
      console.log("Starting to process message...", { hasFile: !!attachedFile });
      
      let currentTaskId = taskId;
      
      if (!currentTaskId) {
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
          await workspaceService.uploadDocument(currentTaskId, attachedFile);
          toast({
            title: "File uploaded",
            description: "Your file has been uploaded successfully.",
          });
          setAttachedFile(null);
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
      if (!isAwaitingInput) {
        setIsProcessing(false);
      }
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
    isAwaitingInput,
    task,
    steps,
    isLoading,
    handleStopProcessing,
    handleSendMessage,
    handleConfirmInput,
    handleCancelInput,
  };
};
