import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "@/config/models";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class AnthropicService {
  private client: Anthropic | null = null;
  private static instance: AnthropicService;

  private constructor() {}

  public static getInstance(): AnthropicService {
    if (!AnthropicService.instance) {
      AnthropicService.instance = new AnthropicService();
    }
    return AnthropicService.instance;
  }

  public initialize(apiKey: string) {
    if (!apiKey) {
      throw new Error("Anthropic API key is required");
    }
    this.client = new Anthropic({
      apiKey,
      defaultHeaders: {
        "anthropic-dangerous-direct-browser-access": "true",
      },
      dangerouslyAllowBrowser: true,
    });
  }

  private getSelectedModel(): string {
    try {
      const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const provider = AI_MODELS.find((m) => m.provider === "anthropic");
        if (settings[provider?.id || "claude"]) {
          return settings[provider?.id || "claude"];
        }
      }
    } catch (error) {
      console.error("Failed to get selected model:", error);
    }
    // Default to the latest Claude model
    return "claude-3-7-sonnet-20250219";
  }

  public async generateCompletion(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error(
        "Anthropic client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();
      const message = await this.client.messages.create({
        model: modelId,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        system: "You are a helpful AI assistant.", // Adding system message as recommended
      });

      return message.content[0].type === "text"
        ? message.content[0].text
        : "No response generated";
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        const message =
          error.message || "An error occurred with the Anthropic API";
        console.error("Full error:", error); // Add more detailed error logging
        throw new Error(`Anthropic API Error: ${message}`);
      }
      throw new Error("Failed to generate completion");
    }
  }
}
