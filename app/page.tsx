"use client";

import { useState } from "react";
import { PromptInput } from "@/components/prompt/PromptInput";
import { ModelResponse } from "@/components/model/ModelResponse";
import { AI_MODELS } from "@/config/models";

export default function Home() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.map((model) => model.id)
  );

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);

    // Simulate API calls to different AI models
    const mockResponses: Record<string, string> = {};
    selectedModels.forEach((modelId) => {
      mockResponses[modelId] = `This is a simulated ${modelId} response...`;
    });

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResponses(mockResponses);
    setIsLoading(false);
  };

  const handleToggleModel = (modelId: string) => {
    setSelectedModels((current) => {
      if (current.includes(modelId)) {
        // Don't allow deselecting if it's the last model
        if (current.length === 1) return current;
        return current.filter((id) => id !== modelId);
      }
      return [...current, modelId];
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        <h1 className="text-4xl font-bold text-center">AI Model Comparison</h1>

        <PromptInput
          onSubmit={handleSubmit}
          loading={isLoading}
          models={AI_MODELS}
          selectedModels={selectedModels}
          onToggleModel={handleToggleModel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {AI_MODELS.filter((model) => selectedModels.includes(model.id)).map(
            (model) => (
              <ModelResponse
                key={model.id}
                id={model.id}
                name={model.name}
                color={model.color}
                response={responses[model.id]}
                isLoading={isLoading}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
