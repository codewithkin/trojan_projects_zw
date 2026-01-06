import { env } from "@trojan_projects_zw/env/native";
import {
  AuthUser,
  getToken,
  setAuthData,
  clearAuthStorage,
  getUser,
} from "./auth-storage";

// Types
export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  token?: string;
  error?: string;
}

// API URL
const API_URL = env.EXPO_PUBLIC_API_URL;

/**
 * Make an authenticated fetch request
 */
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

/**
 * Sign up a new user
 */
export async function signUp(data: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResponse> {
  const response = await authFetch<AuthResponse>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.success && response.token && response.user) {
    await setAuthData(response.token, response.user);
  }

  return response;
}

/**
 * Sign in an existing user
 */
export async function signIn(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await authFetch<AuthResponse>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.success && response.token && response.user) {
    await setAuthData(response.token, response.user);
  }

  return response;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await authFetch<{ success: boolean }>("/auth/sign-out", {
      method: "POST",
    });
  } catch (error) {
    console.error("Sign out error:", error);
  } finally {
    await clearAuthStorage();
  }
}

/**
 * Get the current session from the server
 */
export async function getSession(): Promise<{
  user: AuthUser | null;
  session: AuthSession | null;
}> {
  const token = await getToken();
  if (!token) {
    return { user: null, session: null };
  }

  try {
    const response = await authFetch<AuthResponse>("/auth/session", {
      method: "GET",
    });

    if (response.success && response.user) {
      // Update stored user data
      await setAuthData(token, response.user);
      return {
        user: response.user,
        session: response.session || null,
      };
    }

    // Token invalid, clear storage
    await clearAuthStorage();
    return { user: null, session: null };
  } catch (error) {
    console.error("Get session error:", error);
    await clearAuthStorage();
    return { user: null, session: null };
  }
}

// Re-export types and storage functions for convenience
export { AuthUser, getToken, getUser, clearAuthStorage } from "./auth-storage";

