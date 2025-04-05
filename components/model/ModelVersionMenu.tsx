"use client";

import { AIModel } from "@/config/models";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ModelVersionMenuProps {
  model: AIModel;
  selectedModels: string[];
  modelSettings: Record<string, string>;
  onToggleModel: (modelId: string) => void;
  onVersionChange: (providerId: string, modelId: string) => void;
  isMobile?: boolean;
}

export function ModelVersionMenu({
  model,
  selectedModels,
  modelSettings,
  onToggleModel,
  onVersionChange,
  isMobile = false,
}: ModelVersionMenuProps) {
  if (model.id === "claude") {
    return (
      <div className="p-3 text-sm text-muted-foreground">
        Claude integration is coming soon. Stay tuned!
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Select Version</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => onToggleModel(model.id)}
          >
            {selectedModels.includes(model.id) ? "Disable" : "Enable"}
          </Button>
        </div>
        <div className="space-y-1">
          {model.models.map((version) => (
            <button
              key={version.id}
              className={cn(
                "w-full flex flex-col items-start gap-1 p-2 rounded-sm text-left",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors"
              )}
              onClick={() => onVersionChange(model.id, version.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="font-medium text-sm">{version.name}</div>
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
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Select Version</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => onToggleModel(model.id)}
        >
          {selectedModels.includes(model.id) ? "Disable" : "Enable"}
        </Button>
      </div>
      <div className="space-y-1">
        {model.models.map((version) => (
          <DropdownMenuItem
            key={version.id}
            className="flex flex-col items-start gap-1 cursor-pointer"
            onClick={() => onVersionChange(model.id, version.id)}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="font-medium text-sm">{version.name}</div>
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
  );
}
