import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  Users,
  Bot,
  Package,
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
 * Simplified to just projects, notifications, and invitations
 */
export const adminNavigation: NavSection[] = [
  {
    title: "Admin",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview" },
      { title: "Services", href: "/manage-services", icon: Package, description: "Manage products & services" },
      { title: "Projects", href: "/projects", icon: FolderKanban, description: "Manage customer projects" },
      { title: "AI Insights", href: "/ai-chat", icon: Bot, description: "Chat with Trojan for business insights" },
      { title: "Staff", href: "/staff", icon: Users, description: "Manage team members" },
      { title: "Notifications", href: "/notifications", icon: Bell, description: "System notifications" },
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
