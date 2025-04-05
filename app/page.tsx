"use client";

import { useState, useEffect } from "react";
import { PromptInput } from "@/components/prompt/PromptInput";
import { ModelResponse } from "@/components/model/ModelResponse";
import { AI_MODELS } from "@/config/models";
import { useOpenAI, useAnthropic, useGemini } from "@/hooks/llm";
import { useDeepseek } from "@/hooks/llm/use-deepseek";
import { toast } from "sonner";
import { SettingsDialog } from "@/components/ui/settings-dialog";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useModelSettings } from "@/providers/model-settings-provider";

export default function Home() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.map((model) => model.id)
  );
  const { modelSettings, setModelSettings } = useModelSettings();

  const {
    generateCompletion: generateOpenAICompletion,
    isLoading: isOpenAILoading,
  } = useOpenAI({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    generateCompletion: generateClaudeCompletion,
    isLoading: isClaudeLoading,
  } = useAnthropic({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    generateCompletion: generateGeminiCompletion,
    isLoading: isGeminiLoading,
  } = useGemini({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    generateCompletion: generateDeepseekCompletion,
    isLoading: isDeepseekLoading,
  } = useDeepseek({
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const handleSubmit = async (prompt: string) => {
    // Clear previous responses
    setResponses({});

    try {
      // Call APIs in parallel for better performance
      const apiCalls = [];

      if (selectedModels.includes("gpt-4")) {
        apiCalls.push(
          generateOpenAICompletion(prompt)
            .then((response) => {
              setResponses((prev) => ({
                ...prev,
                "gpt-4": response,
              }));
            })
            .catch((error) => console.error("OpenAI API error:", error))
        );
      }

      if (selectedModels.includes("claude")) {
        apiCalls.push(
          generateClaudeCompletion(prompt)
            .then((response) => {
              setResponses((prev) => ({
                ...prev,
                claude: response,
              }));
            })
            .catch((error) => console.error("Claude API error:", error))
        );
      }

      if (selectedModels.includes("gemini")) {
        apiCalls.push(
          generateGeminiCompletion(prompt)
            .then((response) => {
              setResponses((prev) => ({
                ...prev,
                gemini: response,
              }));
            })
            .catch((error) => console.error("Gemini API error:", error))
        );
      }

      if (selectedModels.includes("deepseek")) {
        apiCalls.push(
          generateDeepseekCompletion(prompt)
            .then((response) => {
              setResponses((prev) => ({
                ...prev,
                deepseek: response,
              }));
            })
            .catch((error) => console.error("Deepseek API error:", error))
        );
      }

      // Wait for all API calls to complete
      await Promise.all(apiCalls);
    } catch (error) {
      console.error("Failed to generate responses:", error);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        <h1 className="text-4xl font-bold text-center">AI Model Comparison</h1>

        <PromptInput
          onSubmit={handleSubmit}
          loading={
            isOpenAILoading ||
            isClaudeLoading ||
            isGeminiLoading ||
            isDeepseekLoading
          }
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
                isLoading={
                  model.id === "gpt-4"
                    ? isOpenAILoading
                    : model.id === "claude"
                    ? isClaudeLoading
                    : model.id === "gemini"
                    ? isGeminiLoading
                    : model.id === "deepseek"
                    ? isDeepseekLoading
                    : false
                }
                modelSettings={modelSettings}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
