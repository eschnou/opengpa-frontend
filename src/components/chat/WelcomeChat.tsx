
import React from "react";
import { ChatInput } from "./ChatInput";
import { useExamples } from "@/hooks/useExamples";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app.config";
import { Loader2, Upload, Search } from "lucide-react";
import { Agent } from "@/contexts/AgentContext";

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
  selectedAgent: Agent;
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
  selectedAgent,
}: WelcomeChatProps) => {
  const {
    examples,
    isLoading,
    error
  } = useExamples();

  // Custom: explain the Analyze application
  const isAnalyzeApp = selectedAgent.id === "analyze";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isAnalyzeApp
          ? "Welcome to the Document Analyzer!"
          : `Welcome to ${selectedAgent.name}!`}
      </h1>
      <div className="flex-1 flex flex-col justify-center items-center pb-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          {isAnalyzeApp ? (
            <>
              <p className="text-xl text-muted-foreground">
                This application lets you analyze the content of a document in two easy steps:
              </p>
              {/* Visual two-step flow */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 my-6">
                {/* Step 1: Upload */}
                <Card className="flex flex-col items-center justify-center flex-1 min-w-[220px]">
                  <CardContent className="flex flex-col items-center gap-2 py-6">
                    <div className="rounded-full bg-primary/10 p-3 mb-2">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-lg font-semibold">1. Upload your document</div>
                    <div className="text-sm text-muted-foreground">
                      Drag and drop or select a file to begin analysis.
                    </div>
                  </CardContent>
                </Card>
                <span className="hidden md:block text-3xl mx-2">→</span>
                {/* Step 2: Ask */}
                <Card className="flex flex-col items-center justify-center flex-1 min-w-[220px]">
                  <CardContent className="flex flex-col items-center gap-2 py-6">
                    <div className="rounded-full bg-primary/10 p-3 mb-2">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-lg font-semibold">2. Ask a question</div>
                    <div className="text-sm text-muted-foreground">
                      Type a question to get answers based on your document.
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-lg font-medium mt-2 text-muted-foreground">
                Upload a file in the chat below, then ask a question about it!
              </p>
            </>
          ) : (
            <>
              <p className="text-xl text-muted-foreground">Here are some examples of what you can ask:</p>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-destructive text-sm">{error}</div>
              ) : (
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
              )}
            </>
          )}
        </div>
      </div>
      {/* Hide ChatInput for Document Analyzer on new chat */}
      {!isAnalyzeApp && (
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
      )}
    </div>
  );
};

