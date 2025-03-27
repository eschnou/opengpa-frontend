
import { MessageInput } from "./MessageInput";
import { ToolCategorySelector } from "./ToolCategorySelector";

interface ChatInputProps {
  message: string;
  isProcessing: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  onMessageChange: (message: string) => void;
  onSendMessage: (files?: File[]) => void;
  onStopProcessing: () => void;
  attachedFiles?: File[] | null;
  onFileAttach?: (files: File[] | null) => void;
  isNewTask?: boolean;
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
}

export const ChatInput = (props: ChatInputProps) => {
  return (
    <div className="p-4">
      <MessageInput 
        {...props} 
        toolSelector={
          props.isNewTask && props.onCategoriesChange ? (
            <ToolCategorySelector
              selectedCategories={props.selectedCategories || []}
              onChange={props.onCategoriesChange}
              disabled={props.isProcessing}
            />
          ) : null
        }
      />
    </div>
  );
};
