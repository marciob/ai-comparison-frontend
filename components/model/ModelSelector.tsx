"use client";

import { AIModel } from "@/config/models";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useModelSettings } from "@/providers/model-settings-provider";
import { useEffect } from "react";
import { ModelVersionMenu } from "./ModelVersionMenu";
import { ModelTrigger } from "./ModelTrigger";

const MODEL_SETTINGS_KEY = "ai-model-settings";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}

export function ModelSelector({
  models,
  selectedModels,
  onToggleModel,
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>
            {enabledModelsCount} model{enabledModelsCount !== 1 ? "s" : ""}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        {models.map((model) => (
          <DropdownMenuSub key={model.id}>
            <DropdownMenuSubTrigger
              className={`flex items-center gap-2 cursor-pointer py-2 ${
                model.id === "claude" ? "opacity-50" : ""
              }`}
              disabled={model.id === "claude"}
            >
              <ModelTrigger
                model={model}
                selectedModels={selectedModels}
                selectedModelName={getSelectedModelName(model.id)}
                onToggleModel={onToggleModel}
              />
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-[200px]">
                <ModelVersionMenu
                  model={model}
                  selectedModels={selectedModels}
                  modelSettings={modelSettings}
                  onToggleModel={onToggleModel}
                  onVersionChange={handleModelVersionChange}
                />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
