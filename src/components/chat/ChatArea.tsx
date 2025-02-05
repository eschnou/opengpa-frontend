import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { TaskStepDTO, TaskDTO } from "@/types/api";
import { ChatStepRenderer } from "./ChatStepRenderer";

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
}

export const ChatArea = ({ taskId }: ChatAreaProps) => {
  const [message, setMessage] = useState("");

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

  return (
    <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!taskId ? (
          <div className="text-center text-muted-foreground p-4">
            Select a task to view the conversation
          </div>
        ) : isLoading ? (
          <div className="text-center text-muted-foreground p-4">
            Loading conversation...
          </div>
        ) : (
          <>
            {/* Display task request first */}
            {task?.request && (
              <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                {task.request}
              </div>
            )}
            
            {/* Then display the conversation steps */}
            {steps?.map((step) => (
              <div key={step.id} className="space-y-4">
                <ChatStepRenderer step={step} />
              </div>
            ))}
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
          <Button className="shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </main>
  );
};