
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { TaskStepDTO } from "@/types/api";

interface AwaitingInputFormProps {
  step: TaskStepDTO;
  onConfirm: (stateData: Record<string, string>) => void;
  onCancel: () => void;
}

export const AwaitingInputForm = ({ step, onConfirm, onCancel }: AwaitingInputFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with stateData
  useEffect(() => {
    if (step.result.stateData) {
      setFormData(step.result.stateData);
    }
  }, [step]);

  // Helper to determine if a field should be a textarea
  const isMultiline = (value: string): boolean => {
    return value.includes("\n");
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onConfirm(formData);
  };

  const handleCancel = () => {
    setIsSubmitting(true);
    onCancel();
  };

  if (!step.result.stateData) {
    return null;
  }

  return (
    <div className="max-w-[80%] ml-auto p-4 rounded-lg bg-primary/10 border border-primary/20">
      <h3 className="text-md font-medium mb-4">
        {step.result.summary || "Please provide the required information:"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(step.result.stateData).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label htmlFor={key} className="text-sm font-medium">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            
            {isMultiline(value) ? (
              <Textarea
                id={key}
                value={formData[key] || value}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                className="w-full min-h-[120px]"
                disabled={isSubmitting}
              />
            ) : (
              <Input
                id={key}
                value={formData[key] || value}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            )}
          </div>
        ))}
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            Confirm
          </Button>
        </div>
      </form>
    </div>
  );
};
