
import { TaskStepDTO } from "@/types/api";
import { AlertOctagon } from "lucide-react";
import { MarkdownContent } from "./MarkdownContent";
import { cn } from "@/lib/utils";

interface OutputMessageStepProps {
  step: TaskStepDTO;
  isSelected?: boolean;
  onStepClick?: () => void;
}

export const OutputMessageStep = ({ step, isSelected, onStepClick }: OutputMessageStepProps) => {
  return (
    <div 
      className={cn(
        "max-w-[80%] ml-auto p-4 rounded-lg",
        step.result?.error 
          ? "bg-destructive/10 text-foreground hover:bg-destructive/20" 
          : "bg-primary/10 text-foreground hover:bg-primary/20",
        isSelected && "bg-primary/20",
        "cursor-pointer transition-colors"
      )}
      onClick={onStepClick}
    >
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <MarkdownContent content={step.action.parameters?.message || step.result?.details || ''} />
      </div>
      
      {step.result?.error && (
        <div className="flex items-center gap-2 mt-2 text-destructive">
          <AlertOctagon className="h-4 w-4" />
          <span className="font-medium">Error: {step.result.error}</span>
        </div>
      )}
    </div>
  );
};
