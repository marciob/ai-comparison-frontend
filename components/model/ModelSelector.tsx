"use client";

import { AIModel } from "@/config/models";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
      <DropdownMenuContent align="end" className="w-64">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onToggleModel(model.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-2 h-2 rounded-full ${model.color} flex-shrink-0`}
            />
            <span className="flex-1 truncate">{model.name}</span>
            <div
              className={`w-3.5 h-3.5 rounded border flex-shrink-0 ${
                selectedModels.includes(model.id)
                  ? "bg-primary border-primary"
                  : "border-muted-foreground"
              }`}
            >
              {selectedModels.includes(model.id) && (
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  className="w-3.5 h-3.5 text-primary-foreground"
                >
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
