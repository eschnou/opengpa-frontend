import { MessageInput } from "./MessageInput";

interface ChatInputProps {
  message: string;
  isProcessing: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: (file?: File) => void;
  onStopProcessing: () => void;
}

export const ChatInput = (props: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-border">
      <MessageInput {...props} />
    </div>
  );
};