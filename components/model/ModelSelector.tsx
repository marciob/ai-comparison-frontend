"use client";

import { AIModel } from "@/config/models";
import { Settings2, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useModelSettings } from "@/providers/model-settings-provider";
import { useEffect } from "react";

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
            {selectedModels.length} model
            {selectedModels.length !== 1 ? "s" : ""}
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
              <div
                className={`w-2 h-2 rounded-full ${model.color} flex-shrink-0`}
              />
              <span className="flex-1 truncate font-medium">{model.name}</span>
              <div className="flex items-center gap-2">
                {model.id === "claude" ? (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                    Coming soon
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getSelectedModelName(model.id)}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (model.id !== "claude") {
                          onToggleModel(model.id);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (model.id !== "claude") {
                            onToggleModel(model.id);
                          }
                        }
                      }}
                      className={`w-3.5 h-3.5 rounded border flex-shrink-0 cursor-pointer flex items-center justify-center ${
                        selectedModels.includes(model.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedModels.includes(model.id) && (
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-[200px]">
                {model.id === "claude" ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    Claude integration is coming soon. Stay tuned!
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Select Version
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => onToggleModel(model.id)}
                      >
                        {selectedModels.includes(model.id)
                          ? "Disable"
                          : "Enable"}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {model.models.map((version) => (
                        <DropdownMenuItem
                          key={version.id}
                          className="flex flex-col items-start gap-1 cursor-pointer"
                          onClick={() =>
                            handleModelVersionChange(model.id, version.id)
                          }
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className="font-medium text-sm">
                              {version.name}
                            </div>
                            {modelSettings[model.id] === version.id && (
                              <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </div>
                          {version.description && (
                            <div className="text-xs text-muted-foreground">
                              {version.description}
                            </div>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
