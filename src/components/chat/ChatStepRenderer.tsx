
import { TaskStepDTO } from "@/types/api";
import { OutputMessageStep } from "./step-renderers/OutputMessageStep";
import { ActionResultStep } from "./step-renderers/ActionResultStep";
import { DocumentsSection } from "./step-renderers/DocumentsSection";
import { AwaitingInputForm } from "./AwaitingInputForm";

interface ChatStepRendererProps {
  step: TaskStepDTO;
  onStepClick?: () => void;
  isSelected?: boolean;
  onConfirmInput?: (stateData: Record<string, string>) => void;
  onCancelInput?: () => void;
}

export const ChatStepRenderer = ({ 
  step, 
  onStepClick, 
  isSelected,
  onConfirmInput,
  onCancelInput
}: ChatStepRendererProps) => {
  // Handle awaiting input state
  if (step.result?.status === "AWAITING_INPUT" && step.result.stateData && onConfirmInput && onCancelInput) {
    return (
      <>
        {step.input && (
          <div className="max-w-[80%] p-4 rounded-lg bg-muted">
            {step.input}
          </div>
        )}
        
        <AwaitingInputForm 
          step={step} 
          onConfirm={(stateData) => {
            if (onConfirmInput) {
              onConfirmInput(stateData);
            }
          }} 
          onCancel={onCancelInput}
        />
      </>
    );
  }

  return (
    <>
      {/* User input */}
      {step.input && (
        <div className="max-w-[80%] p-4 rounded-lg bg-muted">
          {step.input}
        </div>
      )}

      {/* Output message step */}
      {step.action?.name === "output_message" ? (
        <OutputMessageStep 
          step={step} 
          isSelected={isSelected} 
          onStepClick={onStepClick} 
        />
      ) : (
        <ActionResultStep 
          step={step} 
          isSelected={isSelected} 
          onStepClick={onStepClick} 
        />
      )}

      {/* Documents section */}
      {step.documents && step.documents.length > 0 && (
        <DocumentsSection documents={step.documents} />
      )}
    </>
  );
};
