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
import { ExternalLink, Trash2 } from "lucide-react";
import { useApiKeys } from "@/hooks/use-api-keys";
import { useModelTemperatures } from "@/hooks/use-model-temperatures";
import { OpenAIService } from "@/lib/api/openai";
import { clearApiKeys } from "@/lib/utils/api-key-storage";
import { toast } from "sonner";
import { ApiKeyInput } from "./api-key-input";
import { TemperatureSlider } from "./temperature-slider";
import { SecurityWarning } from "./security-warning";

const API_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Required for GPT-4 and other OpenAI models",
    getKeyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Required for Claude models",
    getKeyUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "google",
    name: "Google",
    description: "Required for Gemini models",
    getKeyUrl: "https://makersuite.google.com/app/apikey",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "Required for DeepSeek models",
    getKeyUrl: "https://platform.deepseek.com/",
  },
] as const;

export function ApiKeysManager() {
  const { apiKeys, updateApiKey } = useApiKeys();
  const { temperatures, updateTemperature } = useModelTemperatures();

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
    }
  };

  const handleClearKeys = () => {
    clearApiKeys();
    // Reset all API keys in the state
    Object.keys(apiKeys).forEach((provider) => {
      updateApiKey(provider as keyof typeof apiKeys, "");
    });
    toast.success("API keys cleared successfully");
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-6 pt-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">API Keys</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearKeys}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Keys
          </Button>
        </div>
        <CardDescription className="space-y-2">
          <p>
            Add your API keys for each provider to enable their models. Keys are
            stored in your browser's local storage.
          </p>
          <p>Don't share your API keys with anyone.</p>
          <SecurityWarning />
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-6">
          {API_PROVIDERS.map((provider) => (
            <div key={provider.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`${provider.id}-key`}
                    className="text-sm font-medium"
                  >
                    {provider.name}
                  </label>
                  <a
                    href={provider.getKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    Get API key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  {provider.description}
                </span>
              </div>
              <ApiKeyInput
                provider={provider}
                value={apiKeys[provider.id as keyof typeof apiKeys] || ""}
                onChange={(value) => handleKeyChange(provider.id, value)}
              />
              <TemperatureSlider
                value={temperatures[provider.id]}
                onChange={(value) => updateTemperature(provider.id, value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
