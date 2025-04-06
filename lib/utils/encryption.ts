import { getCrypto } from "@/lib/utils/crypto";

const ENCRYPTION_KEY_STORAGE_KEY = "encryption-key";

export async function encryptData(data: string): Promise<string> {
  try {
    const crypto = getCrypto();
    const key = await getOrCreateEncryptionKey();

    // Convert data to Uint8Array
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      dataBytes
    );

    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const crypto = getCrypto();
    const key = await getOrCreateEncryptionKey();

    // Convert from base64
    const binaryString = atob(encryptedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Extract IV and encrypted data
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  const crypto = getCrypto();

  // Try to get existing key
  const existingKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);
  if (existingKey) {
    try {
      const keyData = new Uint8Array(JSON.parse(existingKey));
      return await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );
    } catch (error) {
      console.warn("Failed to import existing key, generating new one:", error);
    }
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  // Export and store the key
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  localStorage.setItem(
    ENCRYPTION_KEY_STORAGE_KEY,
    JSON.stringify(Array.from(new Uint8Array(exportedKey)))
  );

  return key;
}
