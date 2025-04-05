import { AlertCircle } from "lucide-react";

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
      <p className="text-base text-card-foreground whitespace-pre-wrap leading-relaxed">
        {response.text}
      </p>
    );
  }

  return (
    <p className="text-base text-muted-foreground">
      Response will appear here...
    </p>
  );
};
