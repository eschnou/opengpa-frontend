import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { TopNav } from "@/components/layout/TopNav";
import { TaskStepDTO } from "@/types/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAgent } from "@/contexts/AgentContext";

const Index = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [selectedStep, setSelectedStep] = useState<TaskStepDTO | null>(null);
  const isMobile = useIsMobile();
  const { selectedAgent } = useAgent();

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
    <div className="flex flex-col h-screen">
      <div className="flex-none">
        <TopNav />
      </div>
      
      <div className="flex flex-1 overflow-hidden pt-16">
        {!isMobile && (
          <ChatSidebar 
            onTaskSelect={handleTaskSelect} 
            selectedTaskId={selectedTaskId}
            onNewChat={handleNewChat}
          />
        )}
        
        <div className="flex-1 relative">
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
            selectedAgent={selectedAgent}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
