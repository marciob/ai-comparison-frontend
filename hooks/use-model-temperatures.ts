import { useState, useEffect } from "react";

const DEFAULT_TEMPERATURES = {
  openai: 0.7,
  anthropic: 0.7,
  google: 0.7,
  deepseek: 0.7,
};

export function useModelTemperatures() {
  const [temperatures, setTemperatures] = useState<Record<string, number>>(
    () => {
      if (typeof window === "undefined") return DEFAULT_TEMPERATURES;

      const stored = localStorage.getItem("modelTemperatures");
      return stored ? JSON.parse(stored) : DEFAULT_TEMPERATURES;
    }
  );

  useEffect(() => {
    localStorage.setItem("modelTemperatures", JSON.stringify(temperatures));
  }, [temperatures]);

  const updateTemperature = (provider: string, value: number) => {
    setTemperatures((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  return { temperatures, updateTemperature };
}
