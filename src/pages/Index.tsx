
import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { TopNav } from "@/components/layout/TopNav";
import { TaskStepDTO } from "@/types/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Index = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [selectedStep, setSelectedStep] = useState<TaskStepDTO | null>(null);
  const isMobile = useIsMobile();

  const handleNewChat = () => {
    console.log("Starting new chat...");
    setSelectedTaskId(undefined);
    setSelectedStep(null);
  };

  const handleTaskCreated = (taskId: string) => {
    console.log("New task created:", taskId);
    setSelectedTaskId(taskId);
    setSelectedStep(null);
  };

  const handleTaskSelect = (taskId: string) => {
    console.log("Task selected:", taskId);
    setSelectedTaskId(taskId);
    setSelectedStep(null);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        {/* Fixed top navigation */}
        <div className="flex-none">
          <TopNav />
        </div>
        {/* Scrollable content area */}
        <div className="flex flex-1 overflow-hidden pt-16">
          {/* Left App menu bar */}
          {!isMobile && (
            <div className="flex-none">
              <AppSidebar />
            </div>
          )}

          {/* Chat sidebar only on desktop */}
          {!isMobile && (
            <ChatSidebar
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTaskId}
              onNewChat={handleNewChat}
            />
          )}

          {/* Chat area */}
          <div className="flex-1 relative">
            {/* Mobile sidebars */}
            {isMobile && (
              <ChatSidebar
                onTaskSelect={handleTaskSelect}
                selectedTaskId={selectedTaskId}
                onNewChat={handleNewChat}
              />
            )}

            <ChatArea
              taskId={selectedTaskId}
              onTaskCreated={handleTaskCreated}
              selectedStep={selectedStep}
              onStepSelect={setSelectedStep}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
