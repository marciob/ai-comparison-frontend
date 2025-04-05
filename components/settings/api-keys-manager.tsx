"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useApiKeys } from "@/hooks/use-api-keys";
import { OpenAIService } from "@/lib/api/openai";

const API_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Required for GPT-4 model",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Required for Claude model",
  },
  {
    id: "google",
    name: "Google",
    description: "Required for Gemini model",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "Required for DeepSeek models",
  },
] as const;

export function ApiKeysManager() {
  const { apiKeys, updateApiKey } = useApiKeys();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const handleKeyChange = async (provider: string, newKey: string) => {
    try {
      if (provider === "openai" && newKey) {
        // Validate OpenAI key by initializing the service
        const service = OpenAIService.getInstance();
        service.initialize(newKey);
      }
      updateApiKey(provider as keyof typeof apiKeys, newKey);
    } catch (error) {
      console.error(`Failed to validate ${provider} API key:`, error);
      // You might want to show an error message to the user here
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">API Keys</CardTitle>
        <CardDescription>
          Add your API keys for each provider. Keys are stored securely in your
          browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          {API_PROVIDERS.map((provider) => (
            <div key={provider.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor={`${provider.id}-key`}
                  className="text-sm font-medium"
                >
                  {provider.name}
                </label>
                <span className="text-xs text-muted-foreground">
                  {provider.description}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys[provider.id] ? "text" : "password"}
                    id={`${provider.id}-key`}
                    value={apiKeys[provider.id as keyof typeof apiKeys] || ""}
                    onChange={(e) =>
                      handleKeyChange(provider.id, e.target.value)
                    }
                    placeholder={`Enter your ${provider.name} API key`}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 bg-background"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleKeyVisibility(provider.id)}
                  className="flex-shrink-0"
                >
                  {showKeys[provider.id] ? (
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
