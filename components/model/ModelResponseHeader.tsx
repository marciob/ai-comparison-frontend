"use client";

import { Clock } from "lucide-react";
import { TokenUsageBar } from "./TokenUsageBar";

interface ModelResponseHeaderProps {
  modelName: string;
  responseTime?: number;
  tokenUsage?: { totalTokens: number };
  error?: string;
  isLoading?: boolean;
}

export function ModelResponseHeader({
  modelName,
  responseTime,
  tokenUsage,
  error,
  isLoading,
}: ModelResponseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
      <div className="flex items-center gap-2">
        <h2
          className={`text-2xl sm:text-xl font-semibold ${
            error
              ? "text-destructive"
              : isLoading
              ? "text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {modelName}
        </h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-start">
        {responseTime && !isLoading && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {(responseTime / 1000).toFixed(1)}s
            </span>
          </div>
        )}
        {!isLoading && <TokenUsageBar tokenUsage={tokenUsage} />}
      </div>
    </div>
  );
}
