"use client";

import { Check } from "lucide-react";
import { AIModel } from "@/config/models";

interface ModelTriggerProps {
  model: AIModel;
  selectedModels: string[];
  selectedModelName: string;
  onToggleModel: (modelId: string) => void;
}

export function ModelTrigger({
  model,
  selectedModels,
  selectedModelName,
  onToggleModel,
}: ModelTriggerProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${model.color} flex-shrink-0`} />
      <span className="flex-1 truncate font-medium">{model.name}</span>
      <div className="flex items-center gap-2">
        {model.id === "claude" ? (
          <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
            Coming soon
          </span>
        ) : (
          <>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {selectedModelName}
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
    </div>
  );
}
