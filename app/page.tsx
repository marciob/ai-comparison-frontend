"use client";

import { useState } from "react";
import { PromptInput } from "@/components/prompt/PromptInput";
import { ModelResponse } from "@/components/model/ModelResponse";
import { AI_MODELS } from "@/config/models";
import { useOpenAI } from "@/hooks/use-openai";
import { toast } from "sonner";

export default function Home() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.map((model) => model.id)
  );

  const {
    generateCompletion: generateOpenAICompletion,
    isLoading: isOpenAILoading,
  } = useOpenAI({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleToggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleSubmit = async (prompt: string) => {
    // Clear previous responses
    setResponses({});

    try {
      // Only call OpenAI if it's selected
      if (selectedModels.includes("gpt-4")) {
        const openAIResponse = await generateOpenAICompletion(prompt);
        setResponses((prev) => ({
          ...prev,
          "gpt-4": openAIResponse,
        }));
      }

      // Other model calls will be added here later
    } catch (error) {
      // Errors are already handled by the hook
      console.error("Failed to generate responses:", error);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        <h1 className="text-4xl font-bold text-center">AI Model Comparison</h1>

        <PromptInput
          onSubmit={handleSubmit}
          loading={isOpenAILoading}
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
                isLoading={model.id === "gpt-4" ? isOpenAILoading : false}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
