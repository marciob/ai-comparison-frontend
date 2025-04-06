export function getCrypto(): Crypto {
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto;
  }
  throw new Error("Crypto API not available");
}
