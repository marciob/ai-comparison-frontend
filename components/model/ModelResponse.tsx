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
  modelSettings?: Record<string, string>;
}

export function ModelResponse({
  id,
  name,
  color,
  response,
  isLoading,
  modelSettings,
}: ModelResponseProps) {
  const [selectedModelName, setSelectedModelName] = useState<string>("");

  useEffect(() => {
    const provider = AI_MODELS.find((p) => p.id === id);
    if (!provider) return;

    // Try to get model ID from props or localStorage
    let modelId: string | undefined;
    if (modelSettings) {
      modelId = modelSettings[id];
    } else {
      const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          modelId = settings[id];
        } catch (error) {
          console.error("Failed to load model settings:", error);
        }
      }
    }

    // If no model ID is found, use the first model as default
    if (!modelId) {
      modelId = provider.models[0].id;
    }

    // Find and set the model name
    const model = provider.models.find((m) => m.id === modelId);
    if (model) {
      setSelectedModelName(model.name);
    }
  }, [id, modelSettings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-lg border border-border p-8 bg-card min-h-[600px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-foreground">{name}</h2>
        {selectedModelName && (
          <span className="text-sm text-muted-foreground">
            {selectedModelName}
          </span>
        )}
      </div>

      <div className="flex-grow overflow-y-auto pr-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-muted rounded" />
            <div className="h-5 bg-muted rounded w-5/6" />
            <div className="h-5 bg-muted rounded w-4/6" />
            <div className="h-5 bg-muted rounded w-5/6" />
            <div className="h-5 bg-muted rounded w-3/6" />
          </div>
        ) : response ? (
          <p className="text-base text-card-foreground whitespace-pre-wrap leading-relaxed">
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
