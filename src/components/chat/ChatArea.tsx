import { useState } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { TaskStepDTO, TaskDTO } from "@/types/api";
import { ChatStepRenderer } from "./ChatStepRenderer";
import { LoadingIndicator } from "./LoadingIndicator";
import chatExamples from "@/config/chat-examples.json";
import { createTask, progressTask } from "@/services/task.service";
import { useToast } from "@/components/ui/use-toast";

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

interface ChatAreaProps {
  taskId?: string;
  onTaskCreated?: (taskId: string) => void;
}

export const ChatArea = ({ taskId, onTaskCreated }: ChatAreaProps) => {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldStopProcessing, setShouldStopProcessing] = useState(false);
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

  const handleExampleClick = (body: string) => {
    setMessage(body);
  };

  const handleStopProcessing = () => {
    console.log("Stopping task processing...");
    setShouldStopProcessing(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    setShouldStopProcessing(false);
    
    try {
      console.log("Starting to create task...");
      
      const newTask = await createTask(message);
      console.log("Task created successfully:", newTask);
      
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      if (onTaskCreated) {
        onTaskCreated(newTask.id);
      }

      let currentStep: TaskStepDTO | undefined;
      let attempts = 0;
      const MAX_ATTEMPTS = 5;

      while (attempts < MAX_ATTEMPTS) {
        if (shouldStopProcessing) {
          console.log("Breaking task progression loop - stop requested");
          break;
        }

        currentStep = await progressTask(newTask.id);
        console.log(`Task progress attempt ${attempts + 1}:`, currentStep);
        
        await queryClient.invalidateQueries({ queryKey: ["taskSteps", newTask.id] });
        
        if (currentStep.action?.final || currentStep.result?.final) {
          console.log("Task completed with final step");
          await queryClient.invalidateQueries({ queryKey: ["tasks"] });
          break;
        }
        attempts++;
      }

      if (shouldStopProcessing) {
        console.log("Task processing was stopped by user");
        toast({
          title: "Processing stopped",
          description: "Task processing was stopped as requested.",
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Error processing task:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShouldStopProcessing(false);
    }
  };

  if (!taskId) {
    return (
      <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Welcome to Chat</h2>
          <div className="max-w-md space-y-4 text-center">
            <p className="text-muted-foreground">Here are some examples of what you can ask:</p>
            <ul className="space-y-3 text-sm">
              {chatExamples.examples.map((example, index) => (
                <li 
                  key={index} 
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleExampleClick(example.body)}
                >
                  "{example.title}"
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full max-w-md space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="resize-none"
              rows={4}
            />
            <Button 
              className="w-full" 
              onClick={handleSendMessage}
              disabled={isProcessing}
            >
              <Send className="h-5 w-5 mr-2" />
              {isProcessing ? "Processing..." : "Send message"}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground p-4">
            Loading conversation...
          </div>
        ) : (
          <>
            {task?.request && (
              <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                {task.request}
              </div>
            )}
            
            {steps?.map((step, index) => (
              <div key={`${step.id}-${index}`} className="space-y-4">
                <ChatStepRenderer step={step} />
              </div>
            ))}

            {isProcessing && <LoadingIndicator />}
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none"
            rows={1}
          />
          {isProcessing ? (
            <Button 
              variant="destructive"
              className="shrink-0" 
              onClick={handleStopProcessing}
            >
              <Square className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              className="shrink-0" 
              onClick={handleSendMessage}
              disabled={isProcessing}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};
