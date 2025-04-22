
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Book, Activity, Search, Plus } from "lucide-react"; // use existing icons
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Use available lucide icons
const apps = [
  {
    key: "translate",
    title: "Translate",
    icon: Book, // book icon for Translate
  },
  {
    key: "analyse",
    title: "Analyse",
    icon: Activity, // activity icon for Analyse
  },
  {
    key: "research",
    title: "Research",
    icon: Search, // search icon for Research
  },
];

export function AppSidebar() {
  // Right now this local state, can be lifted if you want global selection
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Sidebar className="border-r min-h-svh bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-lg mb-1 tracking-wider text-foreground">
            Applications
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {apps.map((app) => (
                <SidebarMenuItem key={app.key}>
                  <SidebarMenuButton
                    isActive={selected === app.key}
                    onClick={() => setSelected(app.key)}
                  >
                    <app.icon className="mr-2" />
                    <span>{app.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                className="w-full flex gap-2"
                onClick={() => alert('Custom agent creation coming soon!')}
              >
                <Plus size={16} />
                Create Custom Agent
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
