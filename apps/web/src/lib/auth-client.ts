import { env } from "@trojan_projects_zw/env/web";

// Constants
const API_URL = env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: "user" | "staff" | "support";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

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

// Storage utilities
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// API client
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
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
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

// Auth methods
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
    setStoredAuth(response.token, response.user);
  }

  return response;
}

export async function signIn(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await authFetch<AuthResponse>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.success && response.token && response.user) {
    setStoredAuth(response.token, response.user);
  }

  return response;
}

export async function signOut(): Promise<void> {
  try {
    await authFetch<{ success: boolean }>("/auth/sign-out", {
      method: "POST",
    });
  } catch (error) {
    console.error("Sign out error:", error);
  } finally {
    clearStoredAuth();
  }
}

export async function getSession(): Promise<{
  user: AuthUser | null;
  session: AuthSession | null;
}> {
  const token = getStoredToken();
  if (!token) {
    return { user: null, session: null };
  }

  try {
    const response = await authFetch<AuthResponse>("/auth/session", {
      method: "GET",
    });

    if (response.success && response.user) {
      // Update stored user data
      setStoredAuth(token, response.user);
      return {
        user: response.user,
        session: response.session || null,
      };
    }

    // Token invalid, clear storage
    clearStoredAuth();
    return { user: null, session: null };
  } catch (error) {
    console.error("Get session error:", error);
    clearStoredAuth();
    return { user: null, session: null };
  }
}

// Check if user is authenticated (quick check without API call)
export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
