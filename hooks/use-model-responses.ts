"use client";

import { useState } from "react";
import { useOpenAI, useAnthropic, useGemini } from "@/hooks/llm";
import { useDeepseek } from "@/hooks/llm/use-deepseek";
import { toast } from "sonner";

interface ResponseData {
  text: string;
  responseTime: number;
  error?: string;
}

export function useModelResponses() {
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [loadingModels, setLoadingModels] = useState<Record<string, boolean>>(
    {}
  );

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
    console.log("Starting to generate responses for models:", enabledModels);

    // Clear previous responses and set initial loading states
    setResponses({});
    const initialLoadingState = enabledModels.reduce((acc, modelId) => {
      acc[modelId] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setLoadingModels(initialLoadingState);
    console.log("Initial loading states:", initialLoadingState);

    // Function to handle response for a specific model
    const handleModelResponse = async (
      modelId: string,
      generateFn: (prompt: string) => Promise<string>
    ) => {
      console.log(`${modelId}: Starting API call`);
      const startTime = Date.now();
      try {
        const response = await generateFn(prompt);
        const responseTime = Date.now() - startTime;
        console.log(`${modelId}: Received response in ${responseTime}ms`);

        // Update both states in a single batch
        const responseData = {
          text: response,
          responseTime,
        };

        setResponses((prev) => ({
          ...prev,
          [modelId]: responseData,
        }));
        console.log(`${modelId}: Updated response:`, responseData);

        setLoadingModels((prev) => ({
          ...prev,
          [modelId]: false,
        }));

        console.log(`${modelId}: State updates complete`);
      } catch (error) {
        console.error(`${modelId} API error:`, error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";

        // Update both states in a single batch for error case
        const errorResponseData = {
          text: "",
          responseTime: Date.now() - startTime,
          error: errorMessage,
        };

        setResponses((prev) => ({
          ...prev,
          [modelId]: errorResponseData,
        }));
        console.log(`${modelId}: Updated response (error):`, errorResponseData);

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

      // Each promise runs independently and updates state immediately when done
      return handleModelResponse(modelId, modelFunction);
    });

    // Run all API calls concurrently
    try {
      await Promise.all(modelPromises);
      console.log("All API calls completed");
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
