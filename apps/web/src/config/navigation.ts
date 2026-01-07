import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  UserPlus,
  Bot,
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
      { title: "Projects", href: "/projects", icon: FolderKanban, description: "Manage customer projects" },
      { title: "AI Insights", href: "/ai-chat", icon: Bot, description: "Chat with AI for business insights" },
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
