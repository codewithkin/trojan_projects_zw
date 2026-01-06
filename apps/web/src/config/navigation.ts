import {
  LayoutDashboard,
  ShoppingCart,
  Bell,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Navigation items for Admin users
 * Simplified to just orders, notifications, and invitations
 */
export const adminNavigation: NavSection[] = [
  {
    title: "Admin",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview" },
      { title: "Orders", href: "/orders", icon: ShoppingCart, description: "Manage customer orders" },
      { title: "Notifications", href: "/notifications", icon: Bell, description: "System notifications" },
      { title: "Invite Users", href: "/dashboard#invite", icon: UserPlus, description: "Invite team members" },
    ],
  },
];

/**
 * Get navigation based on user role
 * Staff and support use mobile app, so only admin navigation exists
 */
export function getNavigationForRole(role: string | null | undefined): NavSection[] {
  return adminNavigation;
}
