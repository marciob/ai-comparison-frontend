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
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-semibold text-foreground">{name}</h2>
      <div className="flex items-center gap-4">
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
        {selectedModelName && (
          <span className="text-sm text-muted-foreground">
            {selectedModelName}
          </span>
        )}
      </div>
    </div>
  );
};
