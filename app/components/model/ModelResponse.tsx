"use client";

import { motion } from "framer-motion";

interface ModelResponseProps {
  id: string;
  name: string;
  color: string;
  response?: string;
  isLoading: boolean;
}

export function ModelResponse({
  id,
  name,
  color,
  response,
  isLoading,
}: ModelResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-lg border border-border p-6 bg-card min-h-[400px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="text-lg font-semibold text-foreground">{name}</h2>
      </div>

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-muted rounded" />
            <div className="h-5 bg-muted rounded w-5/6" />
            <div className="h-5 bg-muted rounded w-4/6" />
            <div className="h-5 bg-muted rounded w-5/6" />
            <div className="h-5 bg-muted rounded w-3/6" />
          </div>
        ) : response ? (
          <p className="text-base text-card-foreground whitespace-pre-wrap">
            {response}
          </p>
        ) : (
          <p className="text-base text-muted-foreground">
            Response will appear here...
          </p>
        )}
      </div>
    </motion.div>
  );
}
