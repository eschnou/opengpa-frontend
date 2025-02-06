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

  if (!taskId) {
    return (
      <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Welcome to Chat</h2>
          <div className="max-w-md space-y-4 text-center">
            <p className="text-muted-foreground">Here are some examples of what you can ask:</p>
            <ul className="space-y-3 text-sm">
              <li className="p-3 bg-muted rounded-lg">"Create a new React component for a user profile card"</li>
              <li className="p-3 bg-muted rounded-lg">"Help me implement form validation for my login page"</li>
              <li className="p-3 bg-muted rounded-lg">"Add a dark mode toggle to my application"</li>
            </ul>
          </div>
          <div className="w-full max-w-md">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="resize-none"
              rows={4}
            />
            <Button className="w-full mt-4">
              <Send className="h-5 w-5 mr-2" />
              Send message
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