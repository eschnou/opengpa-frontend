
import chatExamples from "@/config/chat-examples.json";

export interface ChatExample {
  title: string;
  description?: string;
  prompt: string;
}

export function useExamples() {
  const examples: ChatExample[] = chatExamples.examples.map(example => ({
    title: example.title,
    description: example.body.substring(0, 100) + (example.body.length > 100 ? '...' : ''),
    prompt: example.body
  }));

  return { examples };
}
