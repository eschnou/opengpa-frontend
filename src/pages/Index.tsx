import { TopNav } from "@/components/layout/TopNav";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/token";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checking authentication status...");
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login...");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden">
      <TopNav />
      <ChatSidebar />
      <ChatArea />
    </div>
  );
};

export default Index;