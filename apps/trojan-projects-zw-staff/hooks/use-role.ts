import { useAuth } from "@/contexts/auth-context";

/**
 * Hook to check if current user has admin access
 * @returns boolean indicating if user has admin access (admin/staff/support roles or is in admin emails list)
 */
export function useHasAdminAccess(): boolean {
    const { hasAdminAccess } = useAuth();
    return hasAdminAccess;
}

/**
 * Hook to check if current user has full admin access
 * @returns boolean indicating if user has full admin access (admin role or is in admin emails list)
 */
export function useHasFullAdminAccess(): boolean {
    const { hasFullAdminAccess } = useAuth();
    return hasFullAdminAccess;
}

/**
 * Hook to get the effective role of the current user
 * @returns string - "admin", "staff", "support", or "guest"
 */
export function useEffectiveRole(): string {
    const { effectiveRole } = useAuth();
    return effectiveRole;
}

/**
 * Hook to check if current user is a specific role
 * @param role - The role to check against
 * @returns boolean indicating if user matches the role
 */
export function useIsRole(role: "admin" | "staff" | "support"): boolean {
    const { effectiveRole } = useAuth();
    return effectiveRole === role;
}

/**
 * Hook to check if current user is admin
 * @returns boolean
 */
export function useIsAdmin(): boolean {
    return useIsRole("admin");
}

/**
 * Hook to check if current user is staff
 * @returns boolean
 */
export function useIsStaff(): boolean {
    return useIsRole("staff");
}

/**
 * Hook to check if current user is support
 * @returns boolean
 */
export function useIsSupport(): boolean {
    return useIsRole("support");
}
