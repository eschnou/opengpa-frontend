import { TopNav } from "@/components/layout/TopNav";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";

const Index = () => {
  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden">
      <TopNav />
      <ChatSidebar />
      <ChatArea />
    </div>
  );
};

export default Index;