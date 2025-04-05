import { AIModel } from "@/config/models";
import { Settings2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelVersionMenu } from "./ModelVersionMenu";
import { ModelTrigger } from "./ModelTrigger";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface MobileModelSelectorProps {
  models: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  className?: string;
  modelSettings: Record<string, string>;
  onVersionChange: (providerId: string, modelId: string) => void;
  getSelectedModelName: (providerId: string) => string;
  enabledModelsCount: number;
}

export function MobileModelSelector({
  models,
  selectedModels,
  onToggleModel,
  className,
  modelSettings,
  onVersionChange,
  getSelectedModelName,
  enabledModelsCount,
}: MobileModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setExpandedModel(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 gap-1.5 text-xs text-muted-foreground ${
          className || ""
        }`}
      >
        <Settings2 className="h-3.5 w-3.5" />
        <span>
          {enabledModelsCount} model{enabledModelsCount !== 1 ? "s" : ""}
        </span>
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-[280px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50"
        >
          {models.map((model) => (
            <div key={model.id} className="mb-1">
              <button
                onClick={() =>
                  setExpandedModel(expandedModel === model.id ? null : model.id)
                }
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-sm hover:bg-accent",
                  model.id === "claude" && "opacity-50"
                )}
                disabled={model.id === "claude"}
              >
                <ModelTrigger
                  model={model}
                  selectedModels={selectedModels}
                  selectedModelName={getSelectedModelName(model.id)}
                  onToggleModel={onToggleModel}
                />
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedModel === model.id && "transform rotate-180"
                  )}
                />
              </button>
              {expandedModel === model.id && (
                <div className="pl-2 pr-2 pb-2">
                  <ModelVersionMenu
                    model={model}
                    selectedModels={selectedModels}
                    modelSettings={modelSettings}
                    onToggleModel={onToggleModel}
                    onVersionChange={onVersionChange}
                    isMobile={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
