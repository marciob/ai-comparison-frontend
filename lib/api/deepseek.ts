import OpenAI from "openai";
import { AI_MODELS } from "@/config/models";
import { useModelTemperatures } from "@/hooks/use-model-temperatures";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class DeepseekService {
  private client: OpenAI | null = null;
  private static instance: DeepseekService;
  private apiKey: string | null = null;

  private constructor() {}

  public static getInstance(): DeepseekService {
    if (!DeepseekService.instance) {
      DeepseekService.instance = new DeepseekService();
    }
    return DeepseekService.instance;
  }

  public initialize(apiKey: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error("Deepseek API key is required");
    }
    this.client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  private getSelectedModel(): string {
    try {
      const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const provider = AI_MODELS.find((m) => m.provider === "deepseek");
        if (settings[provider?.id || "deepseek"]) {
          return settings[provider?.id || "deepseek"];
        }
      }
    } catch (error) {
      console.error("Failed to get selected model:", error);
    }
    // Default to deepseek-chat if no setting is found
    return "deepseek-chat";
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
        "Deepseek client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();
      const provider = AI_MODELS.find((m) => m.provider === "deepseek");
      const modelConfig = provider?.models.find((m) => m.id === modelId);

      const { temperatures } = useModelTemperatures();
      const temperature = temperatures.deepseek;

      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelId,
        temperature,
        max_tokens: modelConfig?.maxTokens || 4096,
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
          error.message || "An error occurred with the Deepseek API";
        throw new Error(`Deepseek API Error: ${message}`);
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
      throw new Error("DeepSeek API key not initialized");
    }

    const { temperatures } = useModelTemperatures();
    const temperature = temperatures.deepseek;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
