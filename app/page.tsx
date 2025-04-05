"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const AI_MODELS = [
  { id: "gpt-4", name: "GPT-4", color: "bg-green-500" },
  { id: "claude", name: "Claude", color: "bg-purple-500" },
  { id: "gemini", name: "Gemini", color: "bg-blue-500" },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full min-h-[128px] p-4 text-lg rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
            />
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full py-3 text-lg font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Comparing..." : "Compare AI Models"}
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {AI_MODELS.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-lg border border-border p-6 bg-card min-h-[400px] flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${model.color}`} />
                <h2 className="text-lg font-semibold">{model.name}</h2>
              </div>

              <div className="flex-grow overflow-y-auto">
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-muted rounded" />
                    <div className="h-5 bg-muted rounded w-5/6" />
                    <div className="h-5 bg-muted rounded w-4/6" />
                    <div className="h-5 bg-muted rounded w-5/6" />
                    <div className="h-5 bg-muted rounded w-3/6" />
                  </div>
                ) : responses[model.id] ? (
                  <p className="text-base text-card-foreground whitespace-pre-wrap">
                    {responses[model.id]}
                  </p>
                ) : (
                  <p className="text-base text-muted-foreground">
                    Response will appear here...
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
