import CryptoJS from "crypto-js";

/**
 * Generates a consistent salt based on browser/device characteristics
 * This salt will be the same for the same browser/device combination
 */
const generateSalt = (): string => {
  const browserData = [
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    navigator.hardwareConcurrency?.toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ]
    .filter(Boolean)
    .join("|");

  // Use SHA256 to create a consistent hash from the browser data
  return CryptoJS.SHA256(browserData).toString();
};

/**
 * Encrypts and stores an API key in localStorage
 * @param keyName - The name/identifier for the API key
 * @param apiKey - The actual API key to encrypt and store
 * @throws Error if encryption fails
 */
export const storeEncryptedKey = (keyName: string, apiKey: string): void => {
  try {
    if (!apiKey) {
      console.warn(`Attempted to store empty API key for ${keyName}`);
      return;
    }

    const salt = generateSalt();
    const encrypted = CryptoJS.AES.encrypt(apiKey, salt).toString();
    localStorage.setItem(`encrypted_${keyName}`, encrypted);
    console.log(`Successfully stored encrypted key for ${keyName}`);
  } catch (error) {
    console.error(`Failed to encrypt and store API key for ${keyName}:`, error);
    throw new Error(`Failed to encrypt and store API key for ${keyName}`);
  }
};

/**
 * Retrieves and decrypts an API key from localStorage
 * @param keyName - The name/identifier for the API key
 * @returns The decrypted API key or null if not found or decryption fails
 */
export const getDecryptedKey = (keyName: string): string | null => {
  try {
    const encrypted = localStorage.getItem(`encrypted_${keyName}`);
    if (!encrypted) {
      console.log(`No encrypted key found for ${keyName}`);
      return null;
    }

    const salt = generateSalt();
    const decrypted = CryptoJS.AES.decrypt(encrypted, salt);
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      console.error(
        `Failed to decrypt key for ${keyName}: Empty result after decryption`
      );
      return null;
    }

    console.log(`Successfully retrieved and decrypted key for ${keyName}`);
    return decryptedStr;
  } catch (error) {
    console.error(`Failed to decrypt API key for ${keyName}:`, error);
    return null;
  }
};

/**
 * Removes an encrypted API key from localStorage
 * @param keyName - The name/identifier for the API key
 */
export const removeEncryptedKey = (keyName: string): void => {
  try {
    localStorage.removeItem(`encrypted_${keyName}`);
    console.log(`Successfully removed encrypted key for ${keyName}`);
  } catch (error) {
    console.error(`Failed to remove encrypted key for ${keyName}:`, error);
  }
};
