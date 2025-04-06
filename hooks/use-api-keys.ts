import { useState, useEffect } from "react";
import {
  storeEncryptedKey,
  getDecryptedKey,
  removeEncryptedKey,
} from "@/src/utils/encryption";

const API_KEYS_STORAGE_KEY = "llm-api-keys";

interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  deepseek?: string;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  useEffect(() => {
    // Load API keys from localStorage on mount
    const loadEncryptedKeys = async () => {
      const providers: (keyof ApiKeys)[] = [
        "openai",
        "anthropic",
        "google",
        "deepseek",
      ];
      const loadedKeys: ApiKeys = {};

      for (const provider of providers) {
        const decryptedKey = getDecryptedKey(provider);
        if (decryptedKey) {
          loadedKeys[provider] = decryptedKey;
        }
      }

      setApiKeys(loadedKeys);
    };

    loadEncryptedKeys();
  }, []);

  const updateApiKey = (provider: keyof ApiKeys, key: string) => {
    setApiKeys((prev) => {
      const newKeys = { ...prev, [provider]: key };
      // Store encrypted key
      if (key) {
        storeEncryptedKey(provider, key);
      } else {
        removeEncryptedKey(provider);
      }
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
