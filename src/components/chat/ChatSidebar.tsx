import { useState } from "react";
import { ChevronLeft, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { TaskDTO } from "@/types/api";
import { formatDistanceToNow } from "date-fns";

const fetchTasks = async (): Promise<TaskDTO[]> => {
  console.log("Fetching tasks...");
  const response = await httpClient.get("/api/tasks");
  console.log("Tasks fetched:", response.data);
  return response.data;
};

interface ChatSidebarProps {
  onTaskSelect: (taskId: string) => void;
  selectedTaskId?: string;
  onNewChat?: () => void;
}

export const ChatSidebar = ({ onTaskSelect, selectedTaskId, onNewChat }: ChatSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border",
        collapsed ? "w-12" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <span className={cn("font-semibold", collapsed && "hidden")}>Tasks</span>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hover:bg-muted", 
              collapsed && "absolute left-1/2 -translate-x-1/2 top-3"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNewChat}
            className={cn(
              "hover:bg-muted",
              collapsed && "absolute left-1/2 -translate-x-1/2 top-12"
            )}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "flex-1 overflow-y-auto scrollbar-hidden",
        collapsed && "mt-20" // Reduced margin-top for better spacing
      )}>
        {isLoading ? (
          <div className="p-4 text-muted-foreground">Loading tasks...</div>
        ) : tasks?.length === 0 ? (
          <div className="p-4 text-muted-foreground">No tasks found</div>
        ) : (
          tasks?.map((task) => (
            <button
              key={task.id}
              className={cn(
                "w-full p-2 hover:bg-muted flex items-center gap-3 transition-colors",
                selectedTaskId === task.id && "bg-muted",
                collapsed && "justify-center" // Center icons when collapsed
              )}
              onClick={() => onTaskSelect(task.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <div className="text-left truncate">
                  <p className="truncate">{task.title || "Untitled Task"}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.created ? formatDistanceToNow(new Date(task.created), { addSuffix: true }) : "No date"}
                  </p>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};