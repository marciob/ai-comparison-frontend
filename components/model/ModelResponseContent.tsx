import { AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { CopyButton } from "./CopyButton";

interface ResponseData {
  text: string;
  responseTime: number;
  error?: string;
  tokenUsage?: { totalTokens: number };
}

interface ModelResponseContentProps {
  isLoading: boolean;
  response?: ResponseData;
}

export const ModelResponseContent = ({
  isLoading,
  response,
}: ModelResponseContentProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-muted rounded" />
        <div className="h-5 bg-muted rounded w-5/6" />
        <div className="h-5 bg-muted rounded w-4/6" />
        <div className="h-5 bg-muted rounded w-5/6" />
        <div className="h-5 bg-muted rounded w-3/6" />
      </div>
    );
  }

  if (response?.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive/70" />
        <div className="max-w-[240px] space-y-2">
          <p className="text-sm font-medium text-destructive">Error</p>
          <p className="text-sm text-muted-foreground">{response.error}</p>
        </div>
      </div>
    );
  }

  if (response?.text) {
    return (
      <div className="space-y-2">
        <div className="flex justify-end">
          <CopyButton
            text={response.text}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4 prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2 prose-p:mb-4 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-li:mb-1 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-transparent prose-pre:p-0 prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4 prose-strong:font-bold prose-em:italic">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {response.text}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <p className="text-base text-muted-foreground">
      Response will appear here...
    </p>
  );
};
