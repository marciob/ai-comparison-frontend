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
  provider: "openai" | "anthropic" | "google" | "deepseek";
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
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Optimized for efficiency and performance",
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
        id: "claude-3-7-sonnet-20250219",
        name: "Claude 3.7 Sonnet",
        description: "Most advanced Claude model",
      },
      {
        id: "claude-3-5-haiku-20241022",
        name: "Claude 3.5 Haiku",
        description: "Fast and efficient model",
      },
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet v2",
        description: "Balanced performance and capabilities",
      },
      {
        id: "claude-3-5-sonnet-20240620",
        name: "Claude 3.5 Sonnet",
        description: "Original Claude 3.5 Sonnet model",
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        description: "Most powerful Claude model",
      },
      {
        id: "claude-3-sonnet-20240229",
        name: "Claude 3 Sonnet",
        description: "Balanced performance and speed",
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        description: "Fast and efficient model",
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
        id: "gemini-2.5-pro-preview-03-25",
        name: "Gemini 2.5 Pro Preview",
        description:
          "Enhanced thinking and reasoning, multimodal understanding, advanced coding, and more",
        maxTokens: 8192,
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description:
          "Next generation features, speed, thinking, realtime streaming, and multimodal generation",
        maxTokens: 8192,
      },
      {
        id: "gemini-2.0-flash-lite",
        name: "Gemini 2.0 Flash-Lite",
        description: "Cost efficiency and low latency",
        maxTokens: 8192,
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        description:
          "Fast and versatile performance across a diverse variety of tasks",
        maxTokens: 8192,
      },
      {
        id: "gemini-1.5-flash-8b",
        name: "Gemini 1.5 Flash-8B",
        description: "High volume and lower intelligence tasks",
        maxTokens: 8192,
      },
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Complex reasoning tasks requiring more intelligence",
        maxTokens: 8192,
      },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    color: "bg-orange-500",
    description: "DeepSeek's advanced AI models",
    provider: "deepseek",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        description: "DeepSeek-V3 chat model for general purpose use",
        maxTokens: 4096,
        defaultTemperature: 0.7,
      },
      {
        id: "deepseek-reasoner",
        name: "DeepSeek Reasoner",
        description: "DeepSeek-R1 model optimized for reasoning tasks",
        maxTokens: 4096,
        defaultTemperature: 0.7,
      },
    ],
  },
] as const;
