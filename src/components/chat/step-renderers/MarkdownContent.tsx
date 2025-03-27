
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent = ({ content, className }: MarkdownContentProps) => {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        // Improve link styling
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Improve code block styling
        "prose-code:bg-muted prose-code:text-foreground prose-code:p-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-card prose-pre:border prose-pre:border-border",
        className
      )}
      components={{
        // Override code block styling for better contrast
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <pre className="bg-card border border-border p-2 rounded overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code
              className="bg-muted text-foreground px-1 py-0.5 rounded"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
