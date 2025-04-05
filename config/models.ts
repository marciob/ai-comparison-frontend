export interface AIModel {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    color: "bg-green-500",
    description: "Latest version of GPT, highly capable at complex tasks",
  },
  {
    id: "claude",
    name: "Claude",
    color: "bg-purple-500",
    description: "Anthropic's AI, excellent at analysis and reasoning",
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "bg-blue-500",
    description: "Google's most capable AI model",
  },
] as const;
