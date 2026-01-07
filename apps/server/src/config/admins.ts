/**
 * Admin Configuration
 * 
 * List of admin email addresses that have access to admin actions
 * such as creating/editing services, managing users, etc.
 * 
 * Users with these emails OR users with role "admin", "staff", or "support" 
 * can access admin features.
 */

export const ADMIN_EMAILS = [
  "admin@trojanprojects.co.zw",
  "manager@trojanprojects.co.zw",
  "kinzinzombe07@gmail.com",
  "director@trojanprojects.co.zw",
] as const;

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);
}

/**
 * Check if a user has admin access based on email or role
 * Admin access is granted if:
 * 1. Email is in the ADMIN_EMAILS list, OR
 * 2. Role is "admin", "staff", or "support"
 */
export function hasAdminAccess(user: { email?: string | null; role?: string | null } | null): boolean {
  if (!user) return false;
  
  // Check if email is in admin list
  if (user.email && isAdminEmail(user.email)) {
    return true;
  }
  
  // Check if role is admin, staff, or support
  if (user.role === "admin" || user.role === "staff" || user.role === "support") {
    return true;
  }
  
  return false;
}

/**
 * Check if user has full admin privileges (can manage other admins, etc.)
 * This is more restrictive - only for users with admin role OR in admin emails list
 */
export function hasFullAdminAccess(user: { email?: string | null; role?: string | null } | null): boolean {
  if (!user) return false;
  
  // Check if email is in admin list
  if (user.email && isAdminEmail(user.email)) {
    return true;
  }
  
  // Only admin role has full access
  if (user.role === "admin") {
    return true;
  }
  
  return false;
}
