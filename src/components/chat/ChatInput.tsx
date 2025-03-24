
import { MessageInput } from "./MessageInput";

interface ChatInputProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (files?: File[]) => void;
  onStopProcessing: () => void;
  attachedFiles?: File[] | null;
  onFileAttach?: (files: File[] | null) => void;
  isNewTask?: boolean;
}

export const ChatInput = (props: ChatInputProps) => {
  return (
    <div className="p-4">
      <MessageInput {...props} />
    </div>
  );
};
