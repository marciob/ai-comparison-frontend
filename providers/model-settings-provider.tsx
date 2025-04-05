"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ModelSettings {
  [providerId: string]: string;
}

interface ModelSettingsContextType {
  modelSettings: ModelSettings;
  setModelSettings: (settings: ModelSettings) => void;
}

const ModelSettingsContext = createContext<
  ModelSettingsContextType | undefined
>(undefined);

export function ModelSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modelSettings, setModelSettings] = useState<ModelSettings>({});

  // Load initial model settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("ai-model-settings");
    if (savedSettings) {
      try {
        setModelSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load model settings:", error);
      }
    }
  }, []);

  return (
    <ModelSettingsContext.Provider value={{ modelSettings, setModelSettings }}>
      {children}
    </ModelSettingsContext.Provider>
  );
}

export function useModelSettings() {
  const context = useContext(ModelSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useModelSettings must be used within a ModelSettingsProvider"
    );
  }
  return context;
}
