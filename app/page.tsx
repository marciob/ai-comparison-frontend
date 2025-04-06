"use client";

import { useState, useEffect } from "react";
import { PromptInput } from "@/components/prompt/PromptInput";
import { ModelResponse } from "@/components/model/ModelResponse";
import { AI_MODELS } from "@/config/models";
import { useModelResponses } from "@/hooks/use-model-responses";
import { useApiKeys } from "@/hooks/use-api-keys";
import { Header } from "@/components/header/Header";
import { ApiKeyWarning } from "@/components/settings/api-key-warning";

const SELECTED_MODELS_KEY = "ai-selected-models";

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const { responses, isLoading, generateResponses, getModelLoadingState } =
    useModelResponses();
  const { getApiKey } = useApiKeys();
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);

  // Check for API keys on mount
  useEffect(() => {
    const hasApiKeys = AI_MODELS.some((model) => {
      switch (model.provider) {
        case "openai":
          return !!getApiKey("openai");
        case "google":
          return !!getApiKey("google");
        case "deepseek":
          return !!getApiKey("deepseek");
        default:
          return false;
      }
    });
    setShowApiKeyWarning(!hasApiKeys);
  }, [getApiKey]);

  // Load initial selected models
  useEffect(() => {
    const savedSelectedModels = localStorage.getItem(SELECTED_MODELS_KEY);
    if (savedSelectedModels) {
      try {
        const parsed = JSON.parse(savedSelectedModels);
        setSelectedModels(parsed);
      } catch (error) {
        console.error("Failed to load selected models:", error);
        // Fallback to all models except Anthropic if there's an error
        setSelectedModels(
          AI_MODELS.filter((model) => model.provider !== "anthropic").map(
            (model) => model.id
          )
        );
      }
    } else {
      // Default to all models except Anthropic if no saved selection
      setSelectedModels(
        AI_MODELS.filter((model) => model.provider !== "anthropic").map(
          (model) => model.id
        )
      );
    }
  }, []);

  const handleToggleModel = (modelId: string) => {
    setSelectedModels((prev) => {
      const updated = prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId];

      // Save to localStorage
      localStorage.setItem(SELECTED_MODELS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
        {showApiKeyWarning && <ApiKeyWarning />}
        <PromptInput
          onSubmit={(prompt) => generateResponses(prompt, selectedModels)}
          loading={isLoading}
          models={AI_MODELS}
          selectedModels={selectedModels}
          onToggleModel={handleToggleModel}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {AI_MODELS.filter(
            (model) =>
              selectedModels.includes(model.id) &&
              model.provider !== "anthropic"
          ).map((model) => (
            <ModelResponse
              key={model.id}
              id={model.id}
              name={model.name}
              response={responses[model.id]}
              isLoading={getModelLoadingState(model.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
