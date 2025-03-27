
import { TaskStepDTO } from "@/types/api";
import { AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionResultStepProps {
  step: TaskStepDTO;
  isSelected?: boolean;
  onStepClick?: () => void;
}

export const ActionResultStep = ({ step, isSelected, onStepClick }: ActionResultStepProps) => {
  if (!step.result?.summary) return null;
  
  return (
    <div 
      className={cn(
        "max-w-[80%] ml-auto p-4 rounded-lg",
        step.result?.error 
          ? "bg-destructive/10 text-foreground hover:bg-destructive/20" 
          : "bg-muted text-foreground hover:bg-muted/80",
        isSelected && "bg-muted/80",
        "cursor-pointer transition-colors"
      )}
      onClick={onStepClick}
    >
      {step.result.summary}
      {step.result?.error && (
        <div className="flex items-center gap-2 mt-2 text-destructive">
          <AlertOctagon className="h-4 w-4" />
          <span className="font-medium">Error: {step.result.error}</span>
        </div>
      )}
    </div>
  );
};
