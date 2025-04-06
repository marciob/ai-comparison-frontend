"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { OpenAIService } from "@/lib/api/openai";
import { DeepseekService } from "@/lib/api/deepseek";
import { useModelTemperatures } from "@/hooks/use-model-temperatures";
import { saveApiKey, getApiKey } from "@/lib/utils/api-key-storage";

const MODEL_SETTINGS_KEY = "ai-model-settings";

export default function SettingsPage() {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [deepseekApiKey, setDeepseekApiKey] = useState("");
  const { temperatures } = useModelTemperatures();
  const [modelSettings, setModelSettings] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        // Load saved API keys
        const savedOpenaiKey = await getApiKey("openai");
        const savedDeepseekKey = await getApiKey("deepseek");

        if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey);
        if (savedDeepseekKey) setDeepseekApiKey(savedDeepseekKey);

        // Load saved model settings
        const savedModelSettings = localStorage.getItem(MODEL_SETTINGS_KEY);
        if (savedModelSettings) {
          setModelSettings(JSON.parse(savedModelSettings));
        }
      } catch (error) {
        console.error("Failed to load saved settings:", error);
        toast.error("Failed to load saved settings");
      }
    };

    loadSavedSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      // Initialize services with API keys and temperatures
      OpenAIService.getInstance().initialize(openaiApiKey, temperatures.openai);
      DeepseekService.getInstance().initialize(
        deepseekApiKey,
        temperatures.deepseek
      );

      // Save API keys to secure storage
      await saveApiKey("openai", openaiApiKey);
      await saveApiKey("deepseek", deepseekApiKey);

      // Save model settings
      localStorage.setItem(MODEL_SETTINGS_KEY, JSON.stringify(modelSettings));

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    }
  };

  return <div className="space-y-6" />;
}
