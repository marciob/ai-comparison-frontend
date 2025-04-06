import OpenAI from "openai";
import { AI_MODELS } from "@/config/models";
import { useModelTemperatures } from "@/hooks/use-model-temperatures";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class OpenAIService {
  private client: OpenAI | null = null;
  private static instance: OpenAIService;
  private apiKey: string | null = null;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public initialize(apiKey: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  private getSelectedModel(): string {
    try {
      const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const openaiProvider = AI_MODELS.find((m) => m.provider === "openai");
        if (settings[openaiProvider?.id || "gpt-4"]) {
          return settings[openaiProvider?.id || "gpt-4"];
        }
      }
    } catch (error) {
      console.error("Failed to get selected model:", error);
    }
    // Default to GPT-4 if no setting is found
    return "gpt-4";
  }

  public async generateCompletion(prompt: string): Promise<{
    text: string;
    tokenUsage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> {
    if (!this.client) {
      throw new Error(
        "OpenAI client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();
      const openaiProvider = AI_MODELS.find((m) => m.provider === "openai");
      const modelConfig = openaiProvider?.models.find((m) => m.id === modelId);

      const { temperatures } = useModelTemperatures();
      const temperature = temperatures.openai;

      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelId,
        temperature,
        max_tokens: modelConfig?.maxTokens || 1000,
      });

      return {
        text:
          completion.choices[0]?.message?.content || "No response generated",
        tokenUsage: completion.usage
          ? {
              promptTokens: completion.usage.prompt_tokens,
              completionTokens: completion.usage.completion_tokens,
              totalTokens: completion.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        // Handle specific API errors
        const message =
          error.message || "An error occurred with the OpenAI API";
        throw new Error(`OpenAI API Error: ${message}`);
      }
      // Handle other errors
      throw new Error("Failed to generate completion");
    }
  }

  public async generateResponse(
    prompt: string,
    model: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not initialized");
    }

    const { temperatures } = useModelTemperatures();
    const temperature = temperatures.openai;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
