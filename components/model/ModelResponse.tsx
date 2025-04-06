"use client";

import { motion } from "framer-motion";
import { ModelResponseHeader } from "./ModelResponseHeader";
import { ModelResponseContent } from "./ModelResponseContent";
import { memo } from "react";
import { useModelName } from "./useModelName";

interface ResponseData {
  text: string;
  responseTime: number;
  error?: string;
  tokenUsage?: { totalTokens: number };
}

interface ModelResponseProps {
  id: string;
  name: string;
  response?: ResponseData;
  isLoading?: boolean;
}

export const ModelResponse = memo(function ModelResponse({
  id,
  name,
  response,
  isLoading,
}: ModelResponseProps) {
  const { modelName, maxTokens } = useModelName(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-lg border border-border p-3 sm:p-6 md:p-8 bg-card min-h-[300px] sm:min-h-[500px] md:min-h-[600px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-200"
    >
      <ModelResponseHeader
        name={name}
        response={response}
        selectedModelName={modelName}
        maxTokens={maxTokens}
        isLoading={isLoading}
      />
      <div className="flex-grow overflow-y-auto pr-2 sm:pr-4">
        <ModelResponseContent
          isLoading={isLoading || false}
          response={response}
        />
      </div>
    </motion.div>
  );
});
