"use client";

import { useState } from "react";
import { PromptInput } from "@/app/components/prompt/PromptInput";
import { ModelResponse } from "@/app/components/model/ModelResponse";
import { AI_MODELS } from "@/app/config/models";

export default function Home() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);

    // Simulate API calls to different AI models
    const mockResponses = {
      "gpt-4": "This is a simulated GPT-4 response...",
      claude: "This is a simulated Claude response...",
      gemini: "This is a simulated Gemini response...",
    };

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResponses(mockResponses);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">AI Model Comparison</h1>

        <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {AI_MODELS.map((model) => (
            <ModelResponse
              key={model.id}
              id={model.id}
              name={model.name}
              color={model.color}
              response={responses[model.id]}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
