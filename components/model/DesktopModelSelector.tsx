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
import { ModelVersionMenu } from "./ModelVersionMenu";
import { ModelTrigger } from "./ModelTrigger";

interface DesktopModelSelectorProps {
  models: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  className?: string;
  modelSettings: Record<string, string>;
  onVersionChange: (providerId: string, modelId: string) => void;
  getSelectedModelName: (providerId: string) => string;
  enabledModelsCount: number;
}

export function DesktopModelSelector({
  models,
  selectedModels,
  onToggleModel,
  className,
  modelSettings,
  onVersionChange,
  getSelectedModelName,
  enabledModelsCount,
}: DesktopModelSelectorProps) {
  return (
    <div className="hidden sm:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 gap-1.5 text-xs text-muted-foreground ${
              className || ""
            }`}
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
                    onVersionChange={onVersionChange}
                  />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
