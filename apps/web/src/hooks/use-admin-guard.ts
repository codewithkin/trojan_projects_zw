"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./use-session";
import { hasAdminAccess } from "@/config/admins";

/**
 * Hook to protect admin pages.
 * Redirects non-admin users to "/" before rendering.
 * 
 * @returns {{ isAuthorized: boolean, isLoading: boolean }}
 */
export function useAdminGuard() {
  const { user, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // If not logged in, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // If logged in but not admin/staff, redirect to home
    if (!hasAdminAccess(user)) {
      router.replace("/");
      return;
    }
  }, [user, isPending, router]);

  const isAuthorized = user && hasAdminAccess(user);

  return {
    isAuthorized,
    isLoading: isPending,
  };
}
