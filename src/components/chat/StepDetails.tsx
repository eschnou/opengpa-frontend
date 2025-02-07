
import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { StepDetailsContent } from "./step-details/StepDetailsContent";

interface StepDetailsProps {
  step: TaskStepDTO;
  onClose: () => void;
}

export const StepDetails = ({ step, onClose }: StepDetailsProps) => {
  return (
    <div className="h-full flex flex-col bg-background border-l">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Step Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <StepDetailsContent step={step} />
      </div>
    </div>
  );
};
