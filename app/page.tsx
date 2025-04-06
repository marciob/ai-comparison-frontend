"use client";

import { useState, useEffect } from "react";
import { PromptInput } from "@/components/prompt/PromptInput";
import { ModelResponse } from "@/components/model/ModelResponse";
import { AI_MODELS } from "@/config/models";
import { useModelSettings } from "@/providers/model-settings-provider";
import { useModelResponses } from "@/hooks/use-model-responses";
import { Header } from "@/components/header/Header";

const SELECTED_MODELS_KEY = "ai-selected-models";

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const { modelSettings, setModelSettings } = useModelSettings();
  const { responses, isLoading, generateResponses, getModelLoadingState } =
    useModelResponses();

  // Load initial model settings and selected models
  useEffect(() => {
    // Load model settings
    const savedSettings = localStorage.getItem("ai-model-settings");
    if (savedSettings) {
      try {
        setModelSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load model settings:", error);
      }
    }

    // Load selected models
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
  }, [setModelSettings]);

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
              color={model.color}
              response={responses[model.id]}
              isLoading={getModelLoadingState(model.id)}
              modelSettings={modelSettings}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
