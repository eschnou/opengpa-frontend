
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CategoryInfoDTO } from "@/types/api";
import { configurationService } from "@/services/configuration.service";

interface ToolCategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  disabled?: boolean;
  defaultCategories?: string[];
}

export const ToolCategorySelector = ({
  selectedCategories,
  onChange,
  disabled = false,
  defaultCategories = ["core", "web", "filesystem", "rag"]
}: ToolCategorySelectorProps) => {
  const [categories, setCategories] = useState<CategoryInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await configurationService.getActionCategories();
        setCategories(data);
        
        // If no categories are selected, set the default ones
        if (selectedCategories.length === 0) {
          const availableDefaults = data
            .filter(cat => defaultCategories.includes(cat.name))
            .map(cat => cat.name);
          onChange(availableDefaults);
        }
      } catch (error) {
        console.error("Failed to fetch tool categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleToggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(cat => cat !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };
  
  const handleResetToDefault = () => {
    const availableDefaults = categories
      .filter(cat => defaultCategories.includes(cat.name))
      .map(cat => cat.name);
    onChange(availableDefaults);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled || isLoading}>
        <Button 
          variant="outline" 
          size="icon"
          className="hover:bg-muted h-[44px] w-[44px] relative"
        >
          <Settings className="h-5 w-5" />
          {selectedCategories.length > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {selectedCategories.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Available Tools</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetToDefault}
            className="h-7 text-xs"
          >
            Reset
          </Button>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-2 text-sm text-muted-foreground">Loading...</div>
          ) : (
            categories.map(category => (
              <div 
                key={category.name} 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => handleToggleCategory(category.name)}
              >
                <Checkbox 
                  id={`category-${category.name}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => handleToggleCategory(category.name)}
                />
                <label 
                  htmlFor={`category-${category.name}`}
                  className="text-sm flex-1 cursor-pointer"
                >
                  {category.displayName || category.name}
                </label>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
