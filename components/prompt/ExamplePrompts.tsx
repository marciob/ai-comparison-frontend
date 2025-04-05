import { useState } from "react";
import { Button } from "@/components/ui/button";

const EXAMPLE_PROMPTS = [
  "Explain the concept of quantum entanglement in simple terms.",
  "Write a creative story about a time-traveling coffee cup.",
  "Compare and contrast the Renaissance and the Digital Revolution.",
  "Design a sustainable city of the future and describe its key features.",
  "Explain how blockchain technology works to a 10-year-old.",
];

interface ExamplePromptsProps {
  onSelectExample: (prompt: string) => void;
  showExamples: boolean;
}

export function ExamplePrompts({
  onSelectExample,
  showExamples,
}: ExamplePromptsProps) {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(-1);

  const tryExamplePrompt = () => {
    const nextIndex = (currentExampleIndex + 1) % EXAMPLE_PROMPTS.length;
    setCurrentExampleIndex(nextIndex);
    onSelectExample(EXAMPLE_PROMPTS[nextIndex]);
  };

  if (!showExamples) return null;

  return (
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
  );
}
