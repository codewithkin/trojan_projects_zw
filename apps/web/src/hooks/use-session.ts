"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AuthUser,
  AuthSession,
  getSession,
  getStoredUser,
  isAuthenticated,
} from "@/lib/auth-client";

interface UseSessionReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSession = useCallback(async () => {
    setIsPending(true);
    setError(null);

    try {
      // Quick check - if no token, no need to fetch
      if (!isAuthenticated()) {
        setUser(null);
        setSession(null);
        setIsPending(false);
        return;
      }

      // First, set from local storage for immediate UI feedback
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      // Then validate with server
      const result = await getSession();
      setUser(result.user);
      setSession(result.session);
    } catch (err) {
      console.error("Session fetch error:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch session"));
      setUser(null);
      setSession(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "auth_user") {
        fetchSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchSession]);

  return {
    user,
    session,
    isPending,
    error,
    refetch: fetchSession,
  };
}
