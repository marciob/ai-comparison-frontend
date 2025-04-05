"use client";

import { motion } from "framer-motion";
import { AI_MODELS } from "@/config/models";
import { useEffect, useState } from "react";

const MODEL_SETTINGS_KEY = "ai-model-settings";

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
  const [selectedModelName, setSelectedModelName] = useState<string>("");

  useEffect(() => {
    // Load the selected model name
    const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const provider = AI_MODELS.find((p) => p.id === id);
        const modelId = settings[id];
        const model = provider?.models.find((m) => m.id === modelId);
        if (model) {
          setSelectedModelName(model.name);
        }
      } catch (error) {
        console.error("Failed to load model settings:", error);
      }
    }
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-lg border border-border p-6 bg-card min-h-[400px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{name}</h2>
        {selectedModelName && (
          <span className="text-xs text-muted-foreground">
            {selectedModelName}
          </span>
        )}
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
