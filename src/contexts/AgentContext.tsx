
import React, { createContext, useContext, useState, ReactNode } from "react";

// Agent definition/type
export type Agent = {
  id: string;
  name: string;
  icon: "book" | "activity" | "pen" | "search" | "plus";
  isCustom?: boolean;
};

const BUILT_IN_AGENTS: Agent[] = [
  { id: "translate", name: "Translate", icon: "book" },
  { id: "analyze", name: "Analyze", icon: "activity" },
  { id: "write", name: "Write", icon: "pen" },
  { id: "research", name: "Research", icon: "search" },
];

type AgentContextType = {
  agents: Agent[];
  selectedAgent: Agent;
  selectAgent: (id: string) => void;
  addCustomAgent: (name: string) => Agent;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(BUILT_IN_AGENTS[0].id);

  const agents = [...BUILT_IN_AGENTS, ...customAgents];
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || BUILT_IN_AGENTS[0];

  const selectAgent = (id: string) => setSelectedAgentId(id);

  const addCustomAgent = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);
    const agent: Agent = { id, name, icon: "plus", isCustom: true };
    setCustomAgents(prev => [...prev, agent]);
    setSelectedAgentId(id);
    return agent;
  };

  return (
    <AgentContext.Provider value={{ agents, selectedAgent, selectAgent, addCustomAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
