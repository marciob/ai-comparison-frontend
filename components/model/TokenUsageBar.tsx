import { Hash } from "lucide-react";

interface TokenUsageBarProps {
  tokenUsage?: { totalTokens: number };
  maxTokens?: number;
}

export function TokenUsageBar({
  tokenUsage,
  maxTokens = 4000,
}: TokenUsageBarProps) {
  if (!tokenUsage) return null;

  // Use a more reasonable scale for small token counts
  const effectiveMaxTokens = Math.min(
    maxTokens,
    Math.max(tokenUsage.totalTokens * 2, 1000)
  );
  const percentage = Math.min(
    (tokenUsage.totalTokens / effectiveMaxTokens) * 100,
    100
  );
  const formattedPercentage = Math.round(percentage);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/30 border border-border/40">
      <Hash className="w-3.5 h-3.5 text-muted-foreground/70" />
      <div className="flex flex-col gap-1 min-w-[120px]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            {tokenUsage.totalTokens.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {formattedPercentage}% used
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/50 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
