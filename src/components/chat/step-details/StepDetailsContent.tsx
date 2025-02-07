import { TaskStepDTO } from "@/types/api";
import { SearchWebRenderer } from "./renderers/SearchWebRenderer";
import { OutputMessageRenderer } from "./renderers/OutputMessageRenderer";
import { DefaultRenderer } from "./renderers/DefaultRenderer";
import { SendEmailRenderer } from "./renderers/SendEmailRenderer";

const STEP_RENDERERS: Record<string, React.ComponentType<{ step: TaskStepDTO }>> = {
  search_web: SearchWebRenderer,
  browse_web: DefaultRenderer,
  output_message: OutputMessageRenderer,
  send_email: SendEmailRenderer,
};

export const StepDetailsContent = ({ step }: { step: TaskStepDTO }) => {
  const Renderer = STEP_RENDERERS[step.action?.name || ''] || DefaultRenderer;
  return <Renderer step={step} />;
};