
import React from "react";
import { ChatInput } from "./ChatInput";
import { useExamples } from "@/hooks/useExamples";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeChatProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (files?: File[]) => void;
  onExampleClick: (example: string) => void;
  attachedFiles?: File[] | null;
  onFileAttach?: (files: File[] | null) => void;
  isNewTask?: boolean;
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
}

export const WelcomeChat = ({
  message,
  isProcessing,
  onMessageChange,
  onSendMessage,
  onExampleClick,
  attachedFiles,
  onFileAttach,
  isNewTask = true,
  selectedCategories = [],
  onCategoriesChange,
}: WelcomeChatProps) => {
  const { examples } = useExamples();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center items-center pb-10">
        <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight">OpenGPA</h1>
          <p className="text-xl text-muted-foreground">
            Your AI-powered workplace productivity assistant
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
            {examples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto p-4 text-left flex items-center justify-center"
                onClick={() => onExampleClick(example.prompt)}
                disabled={isProcessing}
              >
                <div className="font-semibold">{example.title}</div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full">
        <ChatInput
          message={message}
          isProcessing={isProcessing}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onStopProcessing={() => {}}
          attachedFiles={attachedFiles}
          onFileAttach={onFileAttach}
          isNewTask={isNewTask}
          selectedCategories={selectedCategories}
          onCategoriesChange={onCategoriesChange}
        />
      </div>
    </div>
  );
};
