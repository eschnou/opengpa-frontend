import { TaskStepDTO } from "@/types/api";

interface ChatStepRendererProps {
  step: TaskStepDTO;
}

export const ChatStepRenderer = ({ step }: ChatStepRendererProps) => {
  return (
    <>
      {/* Show user input if present */}
      {step.input && (
        <div className="max-w-[80%] p-4 rounded-lg bg-muted">
          {step.input}
        </div>
      )}

      {/* Handle output_message actions */}
      {step.action?.name === "output_message" && (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary text-primary-foreground">
          {step.action.parameters?.message || step.result?.details}
        </div>
      )}

      {/* Handle error messages */}
      {step.result?.error && (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-destructive text-destructive-foreground">
          {step.result.error}
        </div>
      )}

      {/* For all other actions, show the summary if available */}
      {!step.action?.name && step.result?.summary && (
        <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-muted text-muted-foreground">
          {step.result.summary}
        </div>
      )}
    </>
  );
};