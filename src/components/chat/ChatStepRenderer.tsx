import { TaskStepDTO } from "@/types/api";

interface ChatStepRendererProps {
  step: TaskStepDTO;
}

export const ChatStepRenderer = ({ step }: ChatStepRendererProps) => {
  // Render the result message if available
  if (step.result?.details) {
    return (
      <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
        {step.result.details}
      </div>
    );
  }

  // Fallback to summary if details aren't available
  if (step.result?.summary) {
    return (
      <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
        {step.result.summary}
      </div>
    );
  }

  // Show any error messages
  if (step.result?.error) {
    return (
      <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-destructive text-destructive-foreground">
        {step.result.error}
      </div>
    );
  }

  return null;
};