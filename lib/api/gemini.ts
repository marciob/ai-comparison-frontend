import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_MODELS } from "@/config/models";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export class GeminiService {
  private client: GoogleGenerativeAI | null = null;
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public initialize(apiKey: string) {
    if (!apiKey) {
      throw new Error("Google API key is required");
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  private getSelectedModel(): string {
    try {
      const savedSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const provider = AI_MODELS.find((m) => m.provider === "google");
        if (settings[provider?.id || "gemini"]) {
          return settings[provider?.id || "gemini"];
        }
      }
    } catch (error) {
      console.error("Failed to get selected model:", error);
    }
    // Default to Gemini 2.5 Pro Preview if no setting is found
    return "gemini-2.5-pro-preview-03-25";
  }

  public async generateCompletion(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error(
        "Gemini client is not initialized. Please set your API key first."
      );
    }

    try {
      const modelId = this.getSelectedModel();
      // Remove any 'models/' prefix if it exists
      const cleanModelId = modelId.replace("models/", "");
      const model = this.client.getGenerativeModel({ model: cleanModelId });

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      if (error instanceof Error) {
        const message =
          error.message || "An error occurred with the Gemini API";
        throw new Error(`Gemini API Error: ${message}`);
      }
      throw new Error("Failed to generate completion");
    }
  }
}
