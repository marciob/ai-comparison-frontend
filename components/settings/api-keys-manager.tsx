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
import { EyeIcon, EyeOffIcon, ExternalLink, AlertTriangle } from "lucide-react";
import { useApiKeys } from "@/hooks/use-api-keys";
import { useModelTemperatures } from "@/hooks/use-model-temperatures";
import { OpenAIService } from "@/lib/api/openai";
import { Slider } from "@/components/ui/slider";

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
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-xl">API Keys</CardTitle>
        <CardDescription className="space-y-2">
          <p>
            Add your API keys for each provider to enable their models. Keys are
            stored in your browser's local storage.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/20 dark:bg-destructive/30 text-destructive dark:text-destructive-foreground text-sm border border-destructive/20">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-medium">Security Warning:</span> API keys
              are stored only in your browser's local storage. Do not use this
              application on public or shared devices. API keys provide access
              to your accounts and will incur charges. Keep your keys secure and
              never share them.
            </p>
          </div>
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-muted-foreground">
                    Temperature
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {temperatures[provider.id]}
                  </span>
                </div>
                <Slider
                  value={[temperatures[provider.id]]}
                  onValueChange={([value]) =>
                    updateTemperature(provider.id, value)
                  }
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More deterministic</span>
                  <span>More creative</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
