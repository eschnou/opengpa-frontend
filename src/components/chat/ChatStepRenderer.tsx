import { TaskStepDTO } from "@/types/api";

interface ChatStepRendererProps {
  step: TaskStepDTO;
}

export const ChatStepRenderer = ({ step }: ChatStepRendererProps) => {
  // Default renderer for input
  if (step.input && step.input !== "string") {
    return (
      <div className="max-w-[80%] p-4 rounded-lg bg-muted">
        {step.input}
      </div>
    );
  }

  // Handle different result types
  if (step.result) {
    // Special handling for output_message action
    if (step.action?.name === "output_message" && step.result.details) {
      return (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
          {step.result.details}
        </div>
      );
    }

    // Default case: show summary
    if (step.result.summary) {
      return (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
          {step.result.summary}
        </div>
      );
    }
  }

  return null;
};