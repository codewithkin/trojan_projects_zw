/**
 * Admin Configuration
 * 
 * List of admin email addresses that have access to the admin dashboard
 * and other protected app routes.
 * 
 * Users with these emails OR users with role "staff" can access admin pages.
 */

export const ADMIN_EMAILS = [
  "admin@trojanprojects.co.zw",
  "manager@trojanprojects.co.zw",
  "director@trojanprojects.co.zw",
] as const;

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email as typeof ADMIN_EMAILS[number]);
}

/**
 * Check if a user has admin access based on email or role
 */
export function hasAdminAccess(user: { email?: string | null; role?: string | null } | null): boolean {
  if (!user) return false;
  
  // Check if email is in admin list
  if (user.email && isAdminEmail(user.email)) {
    return true;
  }
  
  // Check if role is staff or support
  if (user.role === "staff" || user.role === "support") {
    return true;
  }
  
  return false;
}
