import { useState } from "react";
import { ChevronLeft, MessageSquare, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const DUMMY_CHATS = [
  { id: 1, title: "Project Planning Assistant", date: "2024-02-20" },
  { id: 2, title: "Code Review Helper", date: "2024-02-19" },
  { id: 3, title: "Documentation Writer", date: "2024-02-18" },
  { id: 4, title: "Bug Analysis", date: "2024-02-17" },
];

export const ChatSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        "glass fixed left-0 top-16 bottom-0 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <span className={cn("font-semibold", collapsed && "hidden")}>Chats</span>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {DUMMY_CHATS.map((chat) => (
          <button
            key={chat.id}
            className="w-full p-3 hover:bg-muted flex items-center gap-3 transition-colors"
          >
            <MessageSquare className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <div className="text-left truncate">
                <p className="truncate">{chat.title}</p>
                <p className="text-xs text-muted-foreground">{chat.date}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
};