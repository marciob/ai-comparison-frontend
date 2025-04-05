import OpenAI from "openai";
import { AI_MODELS } from "@/config/models";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class DeepseekService {
  private client: OpenAI | null = null;
  private static instance: DeepseekService;

  private constructor() {}

  public static getInstance(): DeepseekService {
    if (!DeepseekService.instance) {
      DeepseekService.instance = new DeepseekService();
    }
    return DeepseekService.instance;
  }

  public initialize(apiKey: string) {
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

  public async generateCompletion(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error(
        "Deepseek client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();
      const provider = AI_MODELS.find((m) => m.provider === "deepseek");
      const modelConfig = provider?.models.find((m) => m.id === modelId);

      const completion = await this.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelId,
        temperature: modelConfig?.defaultTemperature || 0.7,
        max_tokens: modelConfig?.maxTokens || 4096,
      });

      return completion.choices[0]?.message?.content || "No response generated";
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
}
