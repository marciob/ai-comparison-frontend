"use client";

import { useState } from "react";
import { useOpenAI, useAnthropic, useGemini } from "@/hooks/llm";
import { useDeepseek } from "@/hooks/llm/use-deepseek";
import { useApiKeys } from "@/hooks/use-api-keys";
import { toast } from "sonner";

interface ResponseData {
  text: string;
  responseTime: number;
  error?: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export function useModelResponses() {
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [loadingModels, setLoadingModels] = useState<Record<string, boolean>>(
    {}
  );
  const { getApiKey } = useApiKeys();

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

  const isLoading = Object.values(loadingModels).some(Boolean);

  const generateResponses = async (
    prompt: string,
    selectedModels: string[]
  ) => {
    // Filter out Anthropic model from selected models
    const enabledModels = selectedModels.filter(
      (modelId) => modelId !== "claude"
    );

    // Check if any of the selected models have API keys
    const hasApiKeys = enabledModels.some((modelId) => {
      switch (modelId) {
        case "gpt-4":
          return !!getApiKey("openai");
        case "gemini":
          return !!getApiKey("google");
        case "deepseek":
          return !!getApiKey("deepseek");
        default:
          return false;
      }
    });

    if (!hasApiKeys) {
      toast.error(
        "Please add your API keys in the settings before submitting a message."
      );
      return;
    }

    // Clear previous responses and set initial loading states
    setResponses({});
    const initialLoadingState = enabledModels.reduce((acc, modelId) => {
      acc[modelId] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setLoadingModels(initialLoadingState);

    // Function to handle response for a specific model
    const handleModelResponse = async (
      modelId: string,
      generateFn: (prompt: string) => Promise<{
        text: string;
        tokenUsage?: {
          promptTokens: number;
          completionTokens: number;
          totalTokens: number;
        };
      }>
    ) => {
      const startTime = Date.now();
      try {
        const { text, tokenUsage } = await generateFn(prompt);
        const responseTime = Date.now() - startTime;

        const responseData = {
          text,
          responseTime,
          tokenUsage,
        };

        setResponses((prev) => ({
          ...prev,
          [modelId]: responseData,
        }));

        setLoadingModels((prev) => ({
          ...prev,
          [modelId]: false,
        }));
      } catch (error) {
        console.error(`${modelId} API error:`, error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";

        const errorResponseData = {
          text: "",
          responseTime: Date.now() - startTime,
          error: errorMessage,
        };

        setResponses((prev) => ({
          ...prev,
          [modelId]: errorResponseData,
        }));

        setLoadingModels((prev) => ({
          ...prev,
          [modelId]: false,
        }));
      }
    };

    // Create an array of promises for concurrent execution
    const modelPromises = enabledModels.map((modelId) => {
      const getModelFunction = () => {
        switch (modelId) {
          case "gpt-4":
            return generateOpenAICompletion;
          case "gemini":
            return generateGeminiCompletion;
          case "deepseek":
            return generateDeepseekCompletion;
          default:
            return null;
        }
      };

      const modelFunction = getModelFunction();
      if (!modelFunction) return Promise.resolve();

      return handleModelResponse(modelId, modelFunction);
    });

    // Run all API calls concurrently
    try {
      await Promise.all(modelPromises);
    } catch (error) {
      console.error("Error in API calls:", error);
    }
  };

  const getModelLoadingState = (modelId: string) => {
    return loadingModels[modelId] || false;
  };

  return {
    responses,
    isLoading,
    generateResponses,
    getModelLoadingState,
  };
}
