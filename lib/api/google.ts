import { useModelTemperatures } from "@/hooks/use-model-temperatures";

export class GoogleService {
  private static instance: GoogleService;
  private apiKey: string | null = null;
  private temperature: number = 0.7;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): GoogleService {
    if (!GoogleService.instance) {
      GoogleService.instance = new GoogleService();
    }
    return GoogleService.instance;
  }

  public initialize(apiKey: string, temperature: number = 0.7) {
    this.apiKey = apiKey;
    this.temperature = temperature;
    this.initialized = true;
  }

  public async generateResponse(
    prompt: string,
    model: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Google API key not initialized");
    }

    const { temperatures } = useModelTemperatures();
    const temperature = temperatures.google;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}
