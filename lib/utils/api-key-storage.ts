import { encryptData } from "@/lib/utils/encryption";

const API_KEYS_STORAGE_KEY = "encrypted-api-keys";

export async function saveApiKey(
  provider: string,
  apiKey: string
): Promise<void> {
  try {
    // Get existing keys
    const existingKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    const keys = existingKeys ? JSON.parse(existingKeys) : {};

    // Encrypt and store the new key
    const encryptedKey = await encryptData(apiKey);
    keys[provider] = encryptedKey;

    // Save back to storage
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error("Failed to save API key:", error);
    throw new Error("Failed to save API key");
  }
}

export async function getApiKey(provider: string): Promise<string | null> {
  try {
    const existingKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (!existingKeys) return null;

    const keys = JSON.parse(existingKeys);
    return keys[provider] || null;
  } catch (error) {
    console.error("Failed to get API key:", error);
    return null;
  }
}

export function clearApiKeys(): void {
  localStorage.removeItem(API_KEYS_STORAGE_KEY);
}
