"use client";

import { useState, useEffect } from "react";
import { PromptInput } from "@/components/prompt/PromptInput";
import { ModelResponse } from "@/components/model/ModelResponse";
import { AI_MODELS } from "@/config/models";
import { useModelSettings } from "@/providers/model-settings-provider";
import { useModelResponses } from "@/hooks/use-model-responses";

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.map((model) => model.id)
  );
  const { modelSettings, setModelSettings } = useModelSettings();
  const { responses, isLoading, generateResponses } = useModelResponses();

  // Load initial model settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("ai-model-settings");
    if (savedSettings) {
      try {
        setModelSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load model settings:", error);
      }
    }
  }, []);

  const handleToggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-[1400px] mx-auto space-y-8 relative">
        <h1 className="text-4xl font-bold text-center">AI Model Comparison</h1>

        <PromptInput
          onSubmit={(prompt) => generateResponses(prompt, selectedModels)}
          loading={isLoading}
          models={AI_MODELS}
          selectedModels={selectedModels}
          onToggleModel={handleToggleModel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {AI_MODELS.filter((model) => selectedModels.includes(model.id)).map(
            (model) => (
              <ModelResponse
                key={model.id}
                id={model.id}
                name={model.name}
                color={model.color}
                response={responses[model.id]}
                isLoading={isLoading}
                modelSettings={modelSettings}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
