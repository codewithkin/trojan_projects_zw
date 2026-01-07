/**
 * Admin access control for staff app
 * Centralized list of admin emails and access checking functions
 */

export const ADMIN_EMAILS = [
  "admin@trojanprojects.co.zw",
  "manager@trojanprojects.co.zw",
  "kinzinzombe07@gmail.com",
  "director@trojanprojects.co.zw",
] as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[number];

/**
 * Check if an email is in the admin list
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email as AdminEmail);
}

/**
 * Check if user has admin access (admin emails OR admin/staff/support roles)
 */
export function hasAdminAccess(user: { email: string; role?: string } | null): boolean {
  if (!user) return false;
  return isAdminEmail(user.email) || ["admin", "staff", "support"].includes(user.role || "");
}

/**
 * Check if user has full admin access (admin emails OR admin role only)
 */
export function hasFullAdminAccess(user: { email: string; role?: string } | null): boolean {
  if (!user) return false;
  return isAdminEmail(user.email) || user.role === "admin";
}

/**
 * Get user's effective role considering admin email list
 */
export function getEffectiveRole(user: { email: string; role?: string } | null): string {
  if (!user) return "guest";
  if (isAdminEmail(user.email)) return "admin";
  return user.role || "user";
}
