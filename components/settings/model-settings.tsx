"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AI_MODELS, type AIModel, type AIModelOption } from "@/config/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const MODEL_SETTINGS_KEY = "ai-model-settings";

interface ModelSettings {
  [providerId: string]: string; // provider ID -> selected model ID
}

interface ModelSettingsProps {
  onModelChange?: (settings: ModelSettings) => void;
}

export function ModelSettings({ onModelChange }: ModelSettingsProps) {
  const [selectedModels, setSelectedModels] = useState<ModelSettings>({});

  useEffect(() => {
    // Load saved model selections
    const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure all providers have a selected model by applying defaults where needed
        const withDefaults = AI_MODELS.filter(
          (provider) => provider.provider !== "anthropic"
        ).reduce(
          (acc, provider) => ({
            ...acc,
            [provider.id]: parsed[provider.id] || provider.models[0].id,
          }),
          {}
        );
        setSelectedModels(withDefaults);
        // Save the settings with defaults if they were missing
        if (JSON.stringify(withDefaults) !== savedSettings) {
          localStorage.setItem(
            MODEL_SETTINGS_KEY,
            JSON.stringify(withDefaults)
          );
        }
      } catch (error) {
        console.error("Failed to parse saved model settings:", error);
        // On error, fall back to defaults
        const defaults = AI_MODELS.filter(
          (provider) => provider.provider !== "anthropic"
        ).reduce(
          (acc, provider) => ({
            ...acc,
            [provider.id]: provider.models[0].id,
          }),
          {}
        );
        setSelectedModels(defaults);
        localStorage.setItem(MODEL_SETTINGS_KEY, JSON.stringify(defaults));
      }
    } else {
      // Set defaults if no saved settings
      const defaults = AI_MODELS.filter(
        (provider) => provider.provider !== "anthropic"
      ).reduce(
        (acc, provider) => ({
          ...acc,
          [provider.id]: provider.models[0].id,
        }),
        {}
      );
      setSelectedModels(defaults);
      localStorage.setItem(MODEL_SETTINGS_KEY, JSON.stringify(defaults));
    }
  }, []);

  // Notify parent of changes
  useEffect(() => {
    onModelChange?.(selectedModels);
  }, [selectedModels, onModelChange]);

  const handleModelChange = (providerId: string, modelId: string) => {
    setSelectedModels((prev) => {
      const updated = { ...prev, [providerId]: modelId };
      localStorage.setItem(MODEL_SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 px-6 pt-6">
        <CardDescription>
          Configure which model version to use for each AI provider
        </CardDescription>

        <div className="space-y-4">
          {AI_MODELS.map((provider) => {
            const selectedModel = provider.models.find(
              (m) => m.id === selectedModels[provider.id]
            );

            return (
              <div
                key={provider.id}
                className={`flex items-start space-x-4 p-3 rounded-lg border bg-card ${
                  provider.id === "claude" ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`w-1 self-stretch rounded-full ${provider.color}`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {provider.name}
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {provider.description}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {provider.id === "claude" ? (
                    <div className="px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                      Coming soon
                    </div>
                  ) : (
                    <Select
                      value={
                        selectedModels[provider.id] || provider.models[0].id
                      }
                      onValueChange={(value) =>
                        handleModelChange(provider.id, value)
                      }
                    >
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue>
                          {selectedModel?.name || provider.models[0].name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {provider.models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="space-y-1">
                              <div className="font-medium">{model.name}</div>
                              {model.description && (
                                <div className="text-xs text-muted-foreground">
                                  {model.description}
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
