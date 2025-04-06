import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "@/config/models";
import { useModelTemperatures } from "@/hooks/use-model-temperatures";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class AnthropicService {
  private client: Anthropic | null = null;
  private static instance: AnthropicService;
  private apiKey: string | null = null;
  private temperature: number = 0.7;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): AnthropicService {
    if (!AnthropicService.instance) {
      AnthropicService.instance = new AnthropicService();
    }
    return AnthropicService.instance;
  }

  public initialize(apiKey: string, temperature: number = 0.7) {
    this.apiKey = apiKey;
    this.temperature = temperature;
    this.initialized = true;
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

  public async generateResponse(
    prompt: string,
    model: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Anthropic API key not initialized");
    }

    const { temperatures } = useModelTemperatures();
    const temperature = temperatures.anthropic;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
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
