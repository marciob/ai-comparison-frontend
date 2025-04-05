import { useState } from "react";
import { GeminiService } from "@/lib/api/gemini";
import { useApiKeys } from "@/hooks/use-api-keys";

interface UseGeminiOptions {
  onError?: (error: Error) => void;
}

export function useGemini(options: UseGeminiOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { getApiKey } = useApiKeys();
  const { onError } = options;

  const generateCompletion = async (prompt: string): Promise<string> => {
    const apiKey = getApiKey("google");

    if (!apiKey) {
      const error = new Error(
        "Google API key is not set. Please add your API key in the settings."
      );
      if (onError) onError(error);
      throw error;
    }

    setIsLoading(true);

    try {
      const service = GeminiService.getInstance();
      service.initialize(apiKey);
      const response = await service.generateCompletion(prompt);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      const enhancedError = new Error(errorMessage);
      if (onError) onError(enhancedError);
      throw enhancedError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateCompletion,
    isLoading,
  };
}
