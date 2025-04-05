export interface AIModelOption {
  id: string;
  name: string;
  description?: string;
  maxTokens?: number;
  defaultTemperature?: number;
}

export interface AIModel {
  id: string;
  name: string;
  color: string;
  description: string;
  provider: "openai" | "anthropic" | "google";
  models: AIModelOption[];
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4",
    name: "OpenAI",
    color: "bg-green-500",
    description: "OpenAI's models, including GPT-4 and GPT-3.5",
    provider: "openai",
    models: [
      {
        id: "gpt-4-turbo-preview",
        name: "GPT-4 Turbo",
        description: "Most capable model, best at complex tasks",
        maxTokens: 4096,
        defaultTemperature: 0.7,
      },
      {
        id: "gpt-4",
        name: "GPT-4",
        description: "More reliable, slightly slower than Turbo",
        maxTokens: 8192,
        defaultTemperature: 0.7,
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        description: "Faster and more cost-effective",
        maxTokens: 4096,
        defaultTemperature: 0.7,
      },
    ],
  },
  {
    id: "claude",
    name: "Anthropic",
    color: "bg-purple-500",
    description: "Anthropic's AI models",
    provider: "anthropic",
    models: [
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Most powerful Claude model",
      },
      {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        description: "Balanced performance and speed",
      },
    ],
  },
  {
    id: "gemini",
    name: "Google",
    color: "bg-blue-500",
    description: "Google's AI models",
    provider: "google",
    models: [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        description: "Advanced reasoning and understanding",
      },
      {
        id: "gemini-pro-vision",
        name: "Gemini Pro Vision",
        description: "Advanced vision and language capabilities",
      },
    ],
  },
] as const;
