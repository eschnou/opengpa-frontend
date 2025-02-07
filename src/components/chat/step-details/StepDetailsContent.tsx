
import { TaskStepDTO } from "@/types/api";
import { SearchWebRenderer } from "./renderers/SearchWebRenderer";
import { OutputMessageRenderer } from "./renderers/OutputMessageRenderer";
import { DefaultRenderer } from "./renderers/DefaultRenderer";
import { SendEmailRenderer } from "./renderers/SendEmailRenderer";
import { RagSearchRenderer } from "./renderers/RagSearchRenderer";
import { TextToSpeechRenderer } from "./renderers/TextToSpeechRenderer";

const STEP_RENDERERS: Record<string, React.ComponentType<{ step: TaskStepDTO }>> = {
  search_web: SearchWebRenderer,
  browse_web: DefaultRenderer,
  output_message: OutputMessageRenderer,
  send_email: SendEmailRenderer,
  rag_search: RagSearchRenderer,
  text_to_speech: TextToSpeechRenderer,
};

export const StepDetailsContent = ({ step }: { step: TaskStepDTO }) => {
  const Renderer = STEP_RENDERERS[step.action?.name || ''] || DefaultRenderer;
  return <Renderer step={step} />;
};
