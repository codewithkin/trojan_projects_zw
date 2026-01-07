import { env } from "@trojan_projects_zw/env/server";

/**
 * JWT utilities for token generation and verification
 * Uses simple base64 encoding with HMAC signature
 */

interface JWTPayload {
  sub: string; // User ID
  sessionId: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

const SECRET = env.BETTER_AUTH_SECRET; // Reuse existing secret

/**
 * Generate a cryptographically secure random token
 */
export function generateToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate a session token (simple random token, not JWT)
 * This is used for session storage in the database
 */
export function generateSessionToken(): string {
  return generateToken(48);
}

/**
 * Create an HMAC signature for data
 */
async function createSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Verify an HMAC signature
 */
async function verifySignature(
  data: string,
  signature: string
): Promise<boolean> {
  const expectedSignature = await createSignature(data);
  return signature === expectedSignature;
}

/**
 * Create a JWT token
 */
export async function createJWT(
  userId: string,
  sessionId: string,
  expiresIn: number = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
): Promise<string> {
  const now = Date.now();
  const payload: JWTPayload = {
    sub: userId,
    sessionId,
    iat: now,
    exp: now + expiresIn,
  };

  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadB64 = btoa(JSON.stringify(payload));
  const signature = await createSignature(`${header}.${payloadB64}`);

  return `${header}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    
    // Verify signature
    const isValid = await verifySignature(`${header}.${payload}`, signature);
    if (!isValid) return null;

    // Decode payload
    const decoded: JWTPayload = JSON.parse(atob(payload));

    // Check expiration
    if (decoded.exp < Date.now()) return null;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
