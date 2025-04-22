
import { useState } from "react";
import { useAgent } from "@/contexts/AgentContext";
import { Menu, Book, Activity, Pen, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const iconMap = {
  book: Book,
  activity: Activity,
  pen: Pen,
  search: Search,
  plus: Plus,
};

export function AgentMenu() {
  const { agents, selectedAgent, selectAgent, addCustomAgent } = useAgent();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");

  const handleAddCustomAgent = () => {
    if (newAgentName.trim().length === 0) return;
    addCustomAgent(newAgentName.trim());
    setNewAgentName("");
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {(() => {
            const Icon = iconMap[selectedAgent.icon];
            return <Icon className="w-4 h-4" />;
          })()}
          <span>{selectedAgent.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase">
          Agents
        </div>
        <div className="flex flex-col gap-1">
          {agents.map(agent => {
            const Icon = iconMap[agent.icon];
            return (
              <Button
                key={agent.id}
                variant={selectedAgent.id === agent.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => { selectAgent(agent.id); setPopoverOpen(false); }}
                className="flex items-center gap-2 justify-start"
              >
                <Icon className="w-4 h-4" />
                <span>{agent.name}</span>
              </Button>
            );
          })}
        </div>
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="New agent name..."
              value={newAgentName}
              onChange={e => setNewAgentName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleAddCustomAgent();
              }}
              className="flex-1"
              size={12}
            />
            <Button size="icon" variant="ghost" onClick={handleAddCustomAgent} title="Add agent">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
