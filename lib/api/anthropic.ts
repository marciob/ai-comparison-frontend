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
    // Default to Claude 3 Opus if no setting is found
    return "claude-3-opus";
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
      });

      return message.content[0].type === "text"
        ? message.content[0].text
        : "No response generated";
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        const message =
          error.message || "An error occurred with the Anthropic API";
        throw new Error(`Anthropic API Error: ${message}`);
      }
      throw new Error("Failed to generate completion");
    }
  }
}
