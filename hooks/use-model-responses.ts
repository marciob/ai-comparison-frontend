"use client";

import { useState } from "react";
import { useOpenAI, useAnthropic, useGemini } from "@/hooks/llm";
import { useDeepseek } from "@/hooks/llm/use-deepseek";
import { toast } from "sonner";

interface ResponseData {
  text: string;
  responseTime: number;
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
    console.log("Starting to generate responses for models:", selectedModels);

    // Clear previous responses and set initial loading states
    setResponses({});
    const initialLoadingState = selectedModels.reduce((acc, modelId) => {
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

        // Update states independently for each model
        setResponses((prev) => {
          const newResponses = {
            ...prev,
            [modelId]: {
              text: response,
              responseTime,
            },
          };
          console.log(`${modelId}: Updated responses:`, newResponses);
          return newResponses;
        });

        setLoadingModels((prev) => {
          const newLoadingStates = {
            ...prev,
            [modelId]: false,
          };
          console.log(`${modelId}: Updated loading states:`, newLoadingStates);
          return newLoadingStates;
        });

        console.log(`${modelId}: State updates complete`);
      } catch (error) {
        console.error(`${modelId} API error:`, error);
        toast.error(`${modelId} failed to respond`);
        setLoadingModels((prev) => ({
          ...prev,
          [modelId]: false,
        }));
      }
    };

    // Create an array of promises for concurrent execution
    const modelPromises = selectedModels.map((modelId) => {
      const getModelFunction = () => {
        switch (modelId) {
          case "gpt-4":
            return generateOpenAICompletion;
          case "claude":
            return generateClaudeCompletion;
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
