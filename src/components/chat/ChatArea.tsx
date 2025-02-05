import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DUMMY_MESSAGES = [
  { id: 1, role: "user", content: "Can you help me analyze this code?" },
  { id: 2, role: "assistant", content: "Of course! Please share the code you'd like me to analyze." },
  { id: 3, role: "user", content: "Here's a React component I'm working on..." },
  {
    id: 4,
    role: "assistant",
    content: "I've reviewed your React component. Here are my observations and suggestions for improvement...",
  },
];

export const ChatArea = () => {
  const [message, setMessage] = useState("");

  return (
    <main className="fixed left-64 top-16 right-0 bottom-0 bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {DUMMY_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[80%] p-4 rounded-lg",
              msg.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {msg.content}
          </div>
        ))}
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