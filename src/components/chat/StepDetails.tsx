
import { TaskStepDTO } from "@/types/api";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import { StepDetailsContent } from "./step-details/StepDetailsContent";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

interface StepDetailsProps {
  step: TaskStepDTO;
  onClose: () => void;
  isMobile: boolean;
}

export const StepDetails = ({ step, onClose, isMobile }: StepDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      onClose();
    }
  };

  // Handle the animation completion
  const handleOpenChange = (open: boolean) => {
    if (!open && isMobile) {
      // This will be called when the sheet finishes closing animation
      onClose();
    }
  };

  const detailsContent = (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Step Details</h3>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          {isMobile ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <StepDetailsContent step={step} />
      </div>
    </div>
  );

  // For mobile, use Sheet for side drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent 
          side="right" 
          className="p-0 w-[85%] max-w-md border-l"
          hideCloseButton
        >
          {detailsContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return (
    <div className="h-full border-l">
      {detailsContent}
    </div>
  );
};
