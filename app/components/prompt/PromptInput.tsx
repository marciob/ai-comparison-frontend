"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  "Explain quantum computing to a 10-year-old child.",
  "Write a creative story about a time-traveling coffee cup.",
  "Compare and contrast the Renaissance and the Digital Revolution.",
  "Design a sustainable city of the future and describe its key features.",
];

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height =
        Math.min(Math.max(textarea.scrollHeight, 128), 400) + "px";
    }
  }, [prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await onSubmit(prompt);
  };

  const handleExamplePrompt = () => {
    const randomIndex = Math.floor(Math.random() * EXAMPLE_PROMPTS.length);
    setPrompt(EXAMPLE_PROMPTS[randomIndex]);
    // Focus and move cursor to end of text
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="prompt" className="text-sm text-muted-foreground">
            Your prompt
          </label>
          <button
            type="button"
            onClick={handleExamplePrompt}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Try an example prompt
          </button>
        </div>
        <div className="relative">
          <textarea
            id="prompt"
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full min-h-[128px] p-4 text-lg rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out pr-14"
            autoFocus
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            aria-label="Send prompt"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
