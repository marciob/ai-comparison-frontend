"use client";

import { AIModel } from "@/app/config/models";
import { ChevronDown, Settings2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md hover:bg-accent transition-colors"
      >
        <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">
          {selectedModels.length} model{selectedModels.length !== 1 ? "s" : ""}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-card rounded-lg border border-border shadow-lg z-50">
          <div className="p-1.5">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => onToggleModel(model.id)}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md transition-colors hover:bg-accent text-left ${
                  selectedModels.includes(model.id) ? "bg-primary/5" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${model.color} flex-shrink-0`}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm text-foreground truncate">
                    {model.name}
                  </span>
                </div>
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
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
