"use client";

import { useState, useRef, useEffect } from "react";
import { ModelSelector } from "@/components/model/ModelSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIModel } from "@/config/models";
import { Send } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Explain the concept of quantum entanglement in simple terms.",
  "Write a creative story about a time-traveling coffee cup.",
  "Compare and contrast the Renaissance and the Digital Revolution.",
  "Design a sustainable city of the future and describe its key features.",
  "Explain how blockchain technology works to a 10-year-old.",
];

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
  const [currentExampleIndex, setCurrentExampleIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 100), 400);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    handleTextareaInput();
  }, [prompt]);

  const tryExamplePrompt = () => {
    const nextIndex = (currentExampleIndex + 1) % EXAMPLE_PROMPTS.length;
    setCurrentExampleIndex(nextIndex);
    setPrompt(EXAMPLE_PROMPTS[nextIndex]);
    // Focus and move cursor to end after setting example
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }
    }, 0);
  };

  // Count only enabled selected models
  const enabledSelectedModels = selectedModels.filter(
    (modelId) => models.find((m) => m.id === modelId)?.provider !== "anthropic"
  );

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-2">
        {!prompt.trim() && (
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={tryExamplePrompt}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Try a prompt example
            </Button>
          </div>
        )}
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onInput={handleTextareaInput}
              placeholder="Enter your prompt here..."
              className="resize-none min-h-[100px] max-h-[400px] pr-24 text-base"
              rows={1}
              autoFocus
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <ModelSelector
                models={models}
                selectedModels={selectedModels}
                onToggleModel={onToggleModel}
              />
              <Button
                type="submit"
                size="icon"
                disabled={
                  !prompt.trim() ||
                  enabledSelectedModels.length === 0 ||
                  loading
                }
                className="h-8 w-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
