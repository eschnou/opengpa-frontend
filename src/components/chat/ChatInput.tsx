
import { MessageInput } from "./MessageInput";

interface ChatInputProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (file?: File) => void;
  onStopProcessing: () => void;
  attachedFile?: File | null;
  onFileAttach?: (file: File) => void;
  isNewTask?: boolean;
}

export const ChatInput = (props: ChatInputProps) => {
  return (
    <div className="p-4">
      <MessageInput {...props} />
    </div>
  );
};
