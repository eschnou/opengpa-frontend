
import { useState } from "react";

export const useChatCategories = () => {
  const [enabledCategories, setEnabledCategories] = useState<string[]>([]);

  const handleCategoriesChange = (categories: string[]) => {
    console.log("Categories changed:", categories);
    setEnabledCategories(categories);
  };

  return {
    enabledCategories,
    handleCategoriesChange
  };
};
