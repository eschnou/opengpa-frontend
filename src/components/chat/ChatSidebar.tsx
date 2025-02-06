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
    <aside
      className={cn(
        "glass fixed left-0 top-16 bottom-0 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <span className={cn("font-semibold", collapsed && "hidden")}>Tasks</span>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNewChat}
            className="hover:bg-muted"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {isLoading ? (
          <div className="p-4 text-muted-foreground">Loading tasks...</div>
        ) : tasks?.length === 0 ? (
          <div className="p-4 text-muted-foreground">No tasks found</div>
        ) : (
          tasks?.map((task) => (
            <button
              key={task.id}
              className={cn(
                "w-full p-3 hover:bg-muted flex items-center gap-3 transition-colors",
                selectedTaskId === task.id && "bg-muted"
              )}
              onClick={() => onTaskSelect(task.id)}
            >
              <MessageSquare className="h-5 w-5 shrink-0" />
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
    </aside>
  );
};