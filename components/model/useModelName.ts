import { useState, useEffect } from "react";
import { AI_MODELS } from "@/config/models";

const MODEL_SETTINGS_KEY = "ai-model-settings";

interface UseModelNameResult {
  selectedModelName: string;
  maxTokens: number;
}

export function useModelName(modelId: string) {
  const model = AI_MODELS.find((provider) => provider.id === modelId);
  const modelName = model?.name || modelId;
  return { modelName };
}

export const useModelNameOriginal = (
  id: string,
  modelSettings?: Record<string, string>
): UseModelNameResult => {
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [maxTokens, setMaxTokens] = useState(8192); // Default max tokens

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

    // Find and set the model name and max tokens
    const model = provider.models.find((m) => m.id === modelId);
    if (model) {
      setSelectedModelName(model.name);
      setMaxTokens(model.maxTokens || 8192);
    }
  }, [id, modelSettings]);

  return { selectedModelName, maxTokens };
};
