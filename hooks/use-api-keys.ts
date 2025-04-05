import { useState, useEffect } from "react";

const API_KEYS_STORAGE_KEY = "llm-api-keys";

interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  useEffect(() => {
    // Load API keys from localStorage on mount
    const savedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error("Failed to parse stored API keys:", error);
      }
    }
  }, []);

  const updateApiKey = (provider: keyof ApiKeys, key: string) => {
    setApiKeys((prev) => {
      const newKeys = { ...prev, [provider]: key };
      // Save to localStorage
      localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(newKeys));
      return newKeys;
    });
  };

  const getApiKey = (provider: keyof ApiKeys): string | undefined => {
    return apiKeys[provider];
  };

  return {
    apiKeys,
    updateApiKey,
    getApiKey,
  };
}
