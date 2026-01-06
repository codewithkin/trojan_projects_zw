import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  BarChart3,
  MessageSquare,
  UserCheck,
  Wrench,
  ClipboardList,
  HeadphonesIcon,
  HelpCircle,
  Search,
  TrendingUp,
  Calendar,
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
 * Full access to all management features
 */
export const adminNavigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Business overview and KPIs" },
      { title: "Analytics", href: "/analytics", icon: BarChart3, description: "Revenue trends and insights" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Orders", href: "/orders", icon: ShoppingCart, description: "Manage customer orders" },
      { title: "Customers", href: "/customers", icon: Users, description: "Customer database" },
      { title: "Services", href: "/services", icon: Package, description: "Service catalog management" },
      { title: "Staff", href: "/staff", icon: UserCheck, description: "Team management" },
    ],
  },
  {
    title: "Reports",
    items: [
      { title: "Reports", href: "/reports", icon: FileText, description: "Generate and export reports" },
    ],
  },
  {
    title: "Settings",
    items: [
      { title: "Settings", href: "/settings", icon: Settings, description: "System configuration" },
    ],
  },
];

/**
 * Navigation items for Staff users
 * Access to assigned projects and tasks
 */
export const staffNavigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Your work overview" },
      { title: "Calendar", href: "/calendar", icon: Calendar, description: "Schedule and appointments" },
    ],
  },
  {
    title: "Work",
    items: [
      { title: "My Projects", href: "/my-work", icon: ClipboardList, description: "Assigned projects" },
      { title: "Services", href: "/services", icon: Package, description: "Service catalog reference" },
    ],
  },
  {
    title: "Performance",
    items: [
      { title: "My Stats", href: "/my-stats", icon: TrendingUp, description: "Your performance metrics" },
    ],
  },
];

/**
 * Navigation items for Support users
 * Access to customer support and inquiries
 */
export const supportNavigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Support overview" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Tickets", href: "/tickets", icon: HeadphonesIcon, description: "Customer support tickets" },
      { title: "Chat", href: "/support-chat", icon: MessageSquare, description: "Live chat support" },
      { title: "Customer Lookup", href: "/customer-lookup", icon: Search, description: "Find customer information" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Services", href: "/services", icon: Package, description: "Service information" },
      { title: "FAQ", href: "/faq", icon: HelpCircle, description: "Frequently asked questions" },
    ],
  },
];

/**
 * Get navigation based on user role
 */
export function getNavigationForRole(role: string | null | undefined): NavSection[] {
  switch (role) {
    case "staff":
      return staffNavigation;
    case "support":
      return supportNavigation;
    default:
      // Admin is default for admin emails
      return adminNavigation;
  }
}
