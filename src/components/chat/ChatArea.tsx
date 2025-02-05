import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { TaskStepDTO } from "@/types/api";

const fetchTaskSteps = async (taskId: string): Promise<TaskStepDTO[]> => {
  console.log("Fetching steps for task:", taskId);
  const response = await httpClient.get(`/api/tasks/${taskId}/steps`);
  console.log("Steps fetched:", response.data);
  return response.data;
};

interface ChatAreaProps {
  taskId?: string;
}

export const ChatArea = ({ taskId }: ChatAreaProps) => {
  const [message, setMessage] = useState("");

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
        ) : steps?.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No messages yet
          </div>
        ) : (
          steps?.map((step) => (
            <div key={step.id} className="space-y-4">
              <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                {step.input}
              </div>
              <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
                {step.result.summary}
              </div>
            </div>
          ))
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