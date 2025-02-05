import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export const Index = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>();

  return (
    <>
      <ChatSidebar onTaskSelect={setSelectedTaskId} selectedTaskId={selectedTaskId} />
      <ChatArea taskId={selectedTaskId} />
    </>
  );
};