"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface ApiKey {
  provider: string;
  key: string;
}

const API_KEYS_STORAGE_KEY = "llm-api-keys";

export function ApiKeysManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { provider: "OpenAI", key: "" },
    { provider: "Anthropic", key: "" },
    { provider: "Google", key: "" },
  ]);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleKeyChange = (provider: string, newKey: string) => {
    const updatedKeys = apiKeys.map((k) =>
      k.provider === provider ? { ...k, key: newKey } : k
    );
    setApiKeys(updatedKeys);
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(updatedKeys));
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">API Keys</CardTitle>
        <CardDescription>
          Add your LLM provider API keys. Keys are stored securely in your
          browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.provider} className="space-y-2">
              <label
                htmlFor={`${apiKey.provider}-key`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {apiKey.provider}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys[apiKey.provider] ? "text" : "password"}
                    id={`${apiKey.provider}-key`}
                    value={apiKey.key}
                    onChange={(e) =>
                      handleKeyChange(apiKey.provider, e.target.value)
                    }
                    placeholder={`Enter your ${apiKey.provider} API key`}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleKeyVisibility(apiKey.provider)}
                  className="flex-shrink-0"
                >
                  {showKeys[apiKey.provider] ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
