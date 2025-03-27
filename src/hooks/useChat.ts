import { useState, useRef, useCallback } from "react";
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
  const [attachedFiles, setAttachedFiles] = useState<File[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [enabledCategories, setEnabledCategories] = useState<string[]>([]);
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

  const handleFileAttachment = (files: File[] | null) => {
    console.log("Handling file attachment:", files?.length);
    
    if (!files) {
      setAttachedFiles(null);
      return;
    }
    
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024); // 10MB limit
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `${oversizedFiles.length} file(s) exceed the 10MB limit and were removed`,
        variant: "destructive",
      });
      
      const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
      setAttachedFiles(validFiles.length > 0 ? validFiles : null);
      
      if (validFiles.length > 0) {
        toast({
          title: "Files attached",
          description: `${validFiles.length} file(s) will be uploaded when you send your message.`,
        });
      }
    } else {
      setAttachedFiles(files);
      toast({
        title: "Files attached",
        description: `${files.length} file(s) will be uploaded when you send your message.`,
      });
    }
  };

  const handleCategoriesChange = (categories: string[]) => {
    console.log("Categories changed:", categories);
    setEnabledCategories(categories);
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
      
      if (step.action?.final || step.result?.final) {
        console.log("Task completed with final step after input confirmation");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
          queryClient.invalidateQueries({ queryKey: ["tasks"] })
        ]);
        setIsProcessing(false);
        return;
      }
      
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

  const handleSendMessage = async (files?: File[]) => {
    const filesToUpload = files || attachedFiles || [];
    
    if ((!message.trim() && filesToUpload.length === 0) || isProcessing) return;

    setIsProcessing(true);
    setIsUploading(filesToUpload.length > 0);
    stopProcessingRef.current = false;
    setIsStopping(false);
    const currentMessage = message;
    setMessage("");
    
    try {
      console.log("Starting to process message...", { 
        fileCount: filesToUpload.length,
        enabledCategories: enabledCategories
      });
      
      let currentTaskId = taskId;
      
      if (!currentTaskId) {
        console.log("Creating new task...");
        const newTask = await createTask(currentMessage, enabledCategories.length > 0 ? enabledCategories : undefined);
        console.log("Task created successfully:", newTask);
        currentTaskId = newTask.id;
        
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        
        if (onTaskCreated) {
          onTaskCreated(newTask.id);
        }
        
        setEnabledCategories([]);
      }

      if (filesToUpload.length > 0) {
        console.log(`Uploading ${filesToUpload.length} file(s) sequentially...`);
        setUploadProgress(0);
        
        try {
          const uploadedDocs = await workspaceService.uploadMultipleDocuments(
            currentTaskId, 
            filesToUpload,
            (progress) => {
              setUploadProgress(progress);
              console.log(`Upload progress: ${progress}%`);
            }
          );
          
          toast({
            title: "Files uploaded",
            description: `${uploadedDocs.length} file(s) uploaded successfully.`,
          });
          
          setAttachedFiles(null);
          setUploadProgress(100);
        } catch (error) {
          console.error("Error uploading files:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload one or more files. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
          setIsUploading(false);
          return;
        }
      }

      setIsUploading(false);
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
      setIsUploading(false);
      stopProcessingRef.current = false;
      setIsStopping(false);
      setUploadProgress(0);
    }
  };

  return {
    message,
    setMessage,
    attachedFiles,
    handleFileAttachment,
    isProcessing,
    isUploading,
    isStopping,
    isAwaitingInput,
    uploadProgress,
    task,
    steps,
    isLoading,
    handleStopProcessing,
    handleSendMessage,
    handleConfirmInput,
    handleCancelInput,
    enabledCategories,
    handleCategoriesChange,
  };
};
