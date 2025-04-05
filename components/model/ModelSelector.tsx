"use client";

import { AIModel } from "@/config/models";
import { useModelSettings } from "@/providers/model-settings-provider";
import { useEffect } from "react";
import { MobileModelSelector } from "./MobileModelSelector";
import { DesktopModelSelector } from "./DesktopModelSelector";

const MODEL_SETTINGS_KEY = "ai-model-settings";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({
  models,
  selectedModels,
  onToggleModel,
  className,
}: ModelSelectorProps) {
  const { modelSettings, setModelSettings } = useModelSettings();

  // Initialize model settings with defaults if not set
  useEffect(() => {
    const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
    if (!savedSettings) {
      const defaults = models.reduce(
        (acc, provider) => ({
          ...acc,
          [provider.id]: provider.models[0].id,
        }),
        {}
      );
      localStorage.setItem(MODEL_SETTINGS_KEY, JSON.stringify(defaults));
      setModelSettings(defaults);
    }
  }, [models, setModelSettings]);

  const handleModelVersionChange = (providerId: string, modelId: string) => {
    const newSettings = {
      ...modelSettings,
      [providerId]: modelId,
    };
    localStorage.setItem(MODEL_SETTINGS_KEY, JSON.stringify(newSettings));
    setModelSettings(newSettings);
  };

  const getSelectedModelName = (providerId: string) => {
    const provider = models.find((m) => m.id === providerId);
    if (!provider) return "";

    const modelId = modelSettings[providerId] || provider.models[0].id;
    const model = provider.models.find((m) => m.id === modelId);
    return model?.name || provider.models[0].name;
  };

  const enabledModelsCount = selectedModels.filter(
    (modelId) => models.find((m) => m.id === modelId)?.provider !== "anthropic"
  ).length;

  const sharedProps = {
    models,
    selectedModels,
    onToggleModel,
    className,
    modelSettings,
    onVersionChange: handleModelVersionChange,
    getSelectedModelName,
    enabledModelsCount,
  };

  return (
    <div className="relative">
      <MobileModelSelector {...sharedProps} />
      <DesktopModelSelector {...sharedProps} />
    </div>
  );
}
