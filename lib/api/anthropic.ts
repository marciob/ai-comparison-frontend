import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "@/config/models";

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
    model: string,
    temperature: number = 0.7
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Anthropic API key not initialized");
    }

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
    if (!this.apiKey) {
      throw new Error("Anthropic API key not initialized");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        messages: [{ role: "user", content: prompt }],
        temperature: this.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}
