
import { useState, useEffect } from "react";
import chatExamples from "@/config/chat-examples.json";
import { APP_CONFIG } from "@/config/app.config";

export interface ChatExample {
  title: string;
  description?: string;
  prompt: string;
}

interface ExamplesResponse {
  examples: {
    title: string;
    body: string;
  }[];
}

export function useExamples() {
  const [examples, setExamples] = useState<ChatExample[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamples = async () => {
      if (!APP_CONFIG.examplesUrl) {
        // If no URL is configured, use the local examples
        setExamples(mapExamples(chatExamples));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(APP_CONFIG.examplesUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch examples: ${response.statusText}`);
        }
        
        const data: ExamplesResponse = await response.json();
        setExamples(mapExamples(data));
      } catch (err) {
        console.error("Error fetching examples:", err);
        setError("Failed to load examples. Using default examples.");
        // Fallback to local examples
        setExamples(mapExamples(chatExamples));
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamples();
  }, []);

  // Helper function to map the examples data format
  const mapExamples = (data: ExamplesResponse): ChatExample[] => {
    return data.examples.map(example => ({
      title: example.title,
      description: example.body.substring(0, 80) + (example.body.length > 80 ? '...' : ''),
      prompt: example.body
    }));
  };

  return { 
    examples, 
    isLoading, 
    error 
  };
}
