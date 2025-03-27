
import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a 
            {...props} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 transition-colors" 
          />
        ),
        code: ({ className, children, ...props }: { className?: string, children: React.ReactNode } & React.HTMLAttributes<HTMLElement>) => {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && props.className?.includes('inline');
          
          if (isInline) {
            return (
              <code className="bg-muted/70 text-foreground px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          }
          return (
            <pre className="bg-muted p-2 rounded-md overflow-x-auto">
              <code className="text-foreground text-sm" {...props}>
                {children}
              </code>
            </pre>
          );
        },
        strong: ({ children, ...props }) => (
          <strong className="font-bold text-foreground" {...props}>{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
