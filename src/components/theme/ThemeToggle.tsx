
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      title={`Current theme: ${theme || "system"}. Click to change.`}
    >
      {/* Light mode icon */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 hidden data-[theme=light]:block" />
      
      {/* Dark mode icon */}
      <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hidden dark:block" />
      
      {/* System preference icon (visible when theme is "system" or not yet set) */}
      <Laptop className="h-5 w-5 hidden data-[theme=system]:block" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
