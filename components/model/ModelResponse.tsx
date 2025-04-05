"use client";

import { motion } from "framer-motion";
import { useModelName } from "./useModelName";
import { ModelResponseHeader } from "./ModelResponseHeader";
import { ModelResponseContent } from "./ModelResponseContent";
import { memo } from "react";

const MODEL_SETTINGS_KEY = "ai-model-settings";

interface ResponseData {
  text: string;
  responseTime: number;
  error?: string;
  tokenUsage?: { totalTokens: number };
}

interface ModelResponseProps {
  id: string;
  name: string;
  color: string;
  response?: ResponseData;
  isLoading: boolean;
  modelSettings?: Record<string, string>;
}

// Memoize the component to prevent unnecessary re-renders
export const ModelResponse = memo(function ModelResponse({
  id,
  name,
  color,
  response,
  isLoading,
  modelSettings,
}: ModelResponseProps) {
  const { selectedModelName, maxTokens } = useModelName(id, modelSettings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-lg border border-border p-8 bg-card min-h-[600px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-200"
    >
      <ModelResponseHeader
        name={name}
        response={response}
        selectedModelName={selectedModelName}
        maxTokens={maxTokens}
      />
      <div className="flex-grow overflow-y-auto pr-4">
        <ModelResponseContent isLoading={isLoading} response={response} />
      </div>
    </motion.div>
  );
});
