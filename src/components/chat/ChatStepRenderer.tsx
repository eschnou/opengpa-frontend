import { TaskStepDTO } from "@/types/api";

interface ChatStepRendererProps {
  step: TaskStepDTO;
}

export const ChatStepRenderer = ({ step }: ChatStepRendererProps) => {
  // Handle output_message actions
  if (step.action?.name === "output_message") {
    return (
      <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
        {step.action.parameters?.message || step.result?.details}
      </div>
    );
  }

  // Handle error messages
  if (step.result?.error) {
    return (
      <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-destructive text-destructive-foreground">
        {step.result.error}
      </div>
    );
  }

  // For all other actions, show the summary if available
  if (step.result?.summary) {
    return (
      <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-muted text-muted-foreground">
        {step.result.summary}
      </div>
    );
  }

  // If no renderable content is found
  return null;
};