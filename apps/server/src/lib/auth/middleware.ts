import { Context, Next } from "hono";
import { db } from "@trojan_projects_zw/db";
import { verifyJWT, extractBearerToken } from "./jwt";
import type { AuthUser } from "./types";

// Extend Hono's context to include user
declare module "hono" {
  interface ContextVariableMap {
    user: AuthUser | null;
    sessionId: string | null;
  }
}

/**
 * Auth middleware - sets user in context if valid token provided
 * Does not block requests without auth (use requireAuth for that)
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    c.set("user", null);
    c.set("sessionId", null);
    return next();
  }

  try {
    const payload = await verifyJWT(token);
    
    if (!payload) {
      c.set("user", null);
      c.set("sessionId", null);
      return next();
    }

    // Find session and user
    const session = await db.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      c.set("user", null);
      c.set("sessionId", null);
      return next();
    }

    // Set user in context
    c.set("user", {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image,
      role: session.user.role,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    });
    c.set("sessionId", session.id);
  } catch (error) {
    console.error("Auth middleware error:", error);
    c.set("user", null);
    c.set("sessionId", null);
  }

  return next();
}

/**
 * Require authentication middleware
 * Returns 401 if no valid auth token
 */
export async function requireAuth(c: Context, next: Next) {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  return next();
}

/**
 * Require specific role middleware
 */
export function requireRole(...roles: AuthUser["role"][]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json({ success: false, error: "Forbidden" }, 403);
    }

    return next();
  };
}
