import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ModelSelector } from "@/components/model/ModelSelector";
import { AIModel } from "@/config/models";

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (prompt: string) => void;
  models: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  loading?: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function PromptControls({
  prompt,
  onPromptChange,
  onSubmit,
  models,
  selectedModels,
  onToggleModel,
  loading,
  onKeyDown,
}: PromptControlsProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Count only enabled selected models
  const enabledSelectedModels = selectedModels.filter(
    (modelId) => models.find((m) => m.id === modelId)?.provider !== "anthropic"
  );

  return (
    <div className="relative flex flex-col sm:flex-row gap-2">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onInput={handleTextareaInput}
          onKeyDown={onKeyDown}
          placeholder="Enter your prompt here... (Press Enter to submit, Shift+Enter for new line)"
          className="resize-none min-h-[100px] max-h-[400px] pr-2 sm:pr-24 text-base"
          rows={1}
          autoFocus
        />
        <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0 sm:absolute sm:right-2 sm:bottom-2 h-8">
          <div className="relative">
            <ModelSelector
              models={models}
              selectedModels={selectedModels}
              onToggleModel={onToggleModel}
              className="flex-initial"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={
              !prompt.trim() || enabledSelectedModels.length === 0 || loading
            }
            className="h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
