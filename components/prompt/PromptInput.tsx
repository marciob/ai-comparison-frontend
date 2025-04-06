"use client";

import { useState } from "react";
import { AIModel } from "@/config/models";
import { ExamplePrompts } from "./ExamplePrompts";
import { PromptControls } from "./PromptControls";

interface PromptInputProps {
  models: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  onSubmit: (prompt: string) => void;
  loading?: boolean;
}

export function PromptInput({
  models,
  selectedModels,
  onToggleModel,
  onSubmit,
  loading,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (prompt: string) => {
    if (!prompt.trim() || loading) return;
    onSubmit(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!prompt.trim() || loading) return;
      onSubmit(prompt);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(prompt);
  };

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={handleFormSubmit} className="w-full max-w-2xl space-y-2">
        <ExamplePrompts
          onSelectExample={setPrompt}
          showExamples={!prompt.trim()}
        />
        <PromptControls
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={handleSubmit}
          models={models}
          selectedModels={selectedModels}
          onToggleModel={onToggleModel}
          loading={loading}
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  );
}
