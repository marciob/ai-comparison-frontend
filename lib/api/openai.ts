import OpenAI from "openai";
import { AI_MODELS } from "@/config/models";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class OpenAIService {
  private client: OpenAI | null = null;
  private static instance: OpenAIService;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public initialize(apiKey: string) {
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

  public async generateCompletion(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error(
        "OpenAI client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();
      const openaiProvider = AI_MODELS.find((m) => m.provider === "openai");
      const modelConfig = openaiProvider?.models.find((m) => m.id === modelId);

      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelId,
        temperature: modelConfig?.defaultTemperature || 0.7,
        max_tokens: modelConfig?.maxTokens || 1000,
      });

      return completion.choices[0]?.message?.content || "No response generated";
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
}
