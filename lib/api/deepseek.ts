import { AI_MODELS } from "@/config/models";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class DeepseekService {
  private static instance: DeepseekService;
  private apiKey: string | null = null;
  private temperature: number = 0.7;

  private constructor() {}

  public static getInstance(): DeepseekService {
    if (!DeepseekService.instance) {
      DeepseekService.instance = new DeepseekService();
    }
    return DeepseekService.instance;
  }

  public initialize(apiKey: string, temperature: number = 0.7) {
    this.apiKey = apiKey;
    this.temperature = temperature;
    if (!apiKey) {
      throw new Error("Deepseek API key is required");
    }
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
    if (!this.apiKey) {
      throw new Error(
        "Deepseek client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();

      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: modelId,
            messages: [{ role: "user", content: prompt }],
            temperature: this.temperature,
            max_tokens: 4096,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Deepseek API error: ${response.status} ${response.statusText} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      return {
        text: data.choices[0]?.message?.content || "No response generated",
        tokenUsage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      console.error("Deepseek API error details:", error);
      if (error instanceof Error) {
        throw new Error(`Deepseek API Error: ${error.message}`);
      }
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
          temperature: this.temperature,
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
