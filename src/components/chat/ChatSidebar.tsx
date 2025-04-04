import { useState, useEffect } from "react";
import { ChevronLeft, MessageSquare, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { taskService } from "@/services/task.service";

interface ChatSidebarProps {
  onTaskSelect: (taskId: string) => void;
  selectedTaskId?: string;
  onNewChat?: () => void;
}

export const ChatSidebar = ({ onTaskSelect, selectedTaskId, onNewChat }: ChatSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  // Use the query to fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.fetchTasks
  });

  useEffect(() => {
    if (isMobile && selectedTaskId) {
      setSheetOpen(false);
    }
  }, [selectedTaskId, isMobile]);

  const handleTaskClick = (taskId: string) => {
    onTaskSelect(taskId);
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
      if (isMobile) {
        setSheetOpen(false);
      }
    }
  };

  // Desktop sidebar header
  const desktopSidebarHeader = (
    <div className={cn(
      "flex items-center justify-between p-3 border-b",
      collapsed && "justify-center"
    )}>
      {!collapsed ? (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(true)}
            className="hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="font-medium">Tasks</div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNewChat}
            className="hover:bg-muted"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(false)}
          className="hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </Button>
      )}
    </div>
  );

  // Mobile sidebar header
  const mobileSidebarHeader = (
    <div className="flex items-center justify-between p-3 border-b">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setSheetOpen(false)}
        className="hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="font-medium">Tasks</div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleNewChat}
        className="hover:bg-muted"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );

  const taskList = (
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
              "w-full p-2 hover:bg-muted flex items-center gap-3 transition-colors",
              selectedTaskId === task.id && "bg-muted",
              collapsed && !isMobile && "justify-center"
            )}
            onClick={() => handleTaskClick(task.id)}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && (
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
  );

  if (isMobile) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed left-4 top-16 z-40 bg-background/80 backdrop-blur-sm hover:bg-muted"
            onClick={() => setSheetOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]" hideCloseButton>
          <div className="flex flex-col h-full">
            {mobileSidebarHeader}
            {taskList}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border",
        collapsed ? "w-12" : "w-64"
      )}
    >
      {desktopSidebarHeader}
      {taskList}
    </div>
  );
};
