import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Keys for secure storage
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

// Web fallback using localStorage (for Expo web)
const webStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  deleteItem: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

// Use SecureStore on native, localStorage on web
const storage = Platform.OS === "web" ? webStorage : SecureStore;

/**
 * Get the stored auth token
 */
export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return webStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

/**
 * Set the auth token in secure storage
 */
export async function setToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      webStorage.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error setting token:", error);
  }
}

/**
 * Delete the auth token from secure storage
 */
export async function deleteToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      webStorage.deleteItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error deleting token:", error);
  }
}

/**
 * Get the stored user data
 */
export async function getUser(): Promise<AuthUser | null> {
  try {
    let userJson: string | null;
    if (Platform.OS === "web") {
      userJson = webStorage.getItem(USER_KEY);
    } else {
      userJson = await SecureStore.getItemAsync(USER_KEY);
    }
    
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Set the user data in secure storage
 */
export async function setUser(user: AuthUser): Promise<void> {
  try {
    const userJson = JSON.stringify(user);
    if (Platform.OS === "web") {
      webStorage.setItem(USER_KEY, userJson);
      return;
    }
    await SecureStore.setItemAsync(USER_KEY, userJson);
  } catch (error) {
    console.error("Error setting user:", error);
  }
}

/**
 * Delete the user data from secure storage
 */
export async function deleteUser(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      webStorage.deleteItem(USER_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

/**
 * Clear all auth data
 */
export async function clearAuthStorage(): Promise<void> {
  await Promise.all([deleteToken(), deleteUser()]);
}

/**
 * Store both token and user
 */
export async function setAuthData(token: string, user: AuthUser): Promise<void> {
  await Promise.all([setToken(token), setUser(user)]);
}

/**
 * Check if user is authenticated (quick check)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}
