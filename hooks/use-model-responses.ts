"use client";

import { useState } from "react";
import { useOpenAI, useAnthropic, useGemini } from "@/hooks/llm";
import { useDeepseek } from "@/hooks/llm/use-deepseek";
import { toast } from "sonner";

export function useModelResponses() {
  const [responses, setResponses] = useState<Record<string, string>>({});

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

  const isLoading =
    isOpenAILoading || isClaudeLoading || isGeminiLoading || isDeepseekLoading;

  const generateResponses = async (
    prompt: string,
    selectedModels: string[]
  ) => {
    setResponses({});

    try {
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

      await Promise.all(apiCalls);
    } catch (error) {
      console.error("Failed to generate responses:", error);
    }
  };

  return {
    responses,
    isLoading,
    generateResponses,
    isOpenAILoading,
    isClaudeLoading,
    isGeminiLoading,
    isDeepseekLoading,
  };
}
