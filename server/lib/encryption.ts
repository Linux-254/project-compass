import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";
import { ENV } from "../_core/env";

const ALGO = "aes-256-gcm";
const PREFIX = "enc:v1:";

// Derives a stable 32-byte key from ENCRYPTION_KEY (preferred) or JWT_SECRET.
// Returns null when no secret is configured, in which case data is stored as
// plaintext (local development only).
function keyMaterial(): Buffer | null {
  const secret = ENV.encryptionKey || ENV.cookieSecret;
  if (!secret) return null;
  return createHash("sha256").update(secret).digest();
}

export function encryptText(plain: string | null | undefined): string | null {
  if (!plain) return null;
  const key = keyMaterial();
  if (!key) return plain;
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString(
    "base64"
  )}`;
}

export function decryptText(
  cipherText: string | null | undefined
): string | null {
  if (!cipherText) return null;
  if (!cipherText.startsWith(PREFIX)) return cipherText; // plaintext / legacy value
  const key = keyMaterial();
  if (!key) return null;
  try {
    const [ivB64, tagB64, dataB64] = cipherText.slice(PREFIX.length).split(":");
    const decipher = createDecipheriv(ALGO, key, Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}
