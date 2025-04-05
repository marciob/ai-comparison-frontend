"use client";

import { Clock } from "lucide-react";
import { TokenUsageBar } from "./TokenUsageBar";

interface ResponseData {
  text: string;
  responseTime: number;
  error?: string;
  tokenUsage?: { totalTokens: number };
}

interface ModelResponseHeaderProps {
  name: string;
  response?: ResponseData;
  selectedModelName: string;
  maxTokens: number;
}

export const ModelResponseHeader = ({
  name,
  response,
  selectedModelName,
  maxTokens,
}: ModelResponseHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl sm:text-xl font-semibold text-foreground">
          {name}
        </h2>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {selectedModelName}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-start">
        {response?.responseTime && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {(response.responseTime / 1000).toFixed(1)}s
            </span>
          </div>
        )}
        <TokenUsageBar
          tokenUsage={response?.tokenUsage}
          maxTokens={maxTokens}
        />
        <span className="text-sm text-muted-foreground sm:hidden">
          {selectedModelName}
        </span>
      </div>
    </div>
  );
};
