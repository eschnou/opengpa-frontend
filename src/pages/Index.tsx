import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { TopNav } from "@/components/layout/TopNav";

const Index = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>();

  const handleNewChat = () => {
    console.log("Starting new chat...");
    setSelectedTaskId(undefined);
  };

  const handleTaskCreated = (taskId: string) => {
    console.log("New task created:", taskId);
    setSelectedTaskId(taskId);
  };

  return (
    <>
      <TopNav />
      <ChatSidebar 
        onTaskSelect={setSelectedTaskId} 
        selectedTaskId={selectedTaskId}
        onNewChat={handleNewChat}
      />
      <ChatArea 
        taskId={selectedTaskId} 
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
};

export default Index;