"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStoredToken } from "@/lib/auth-client";
import { env } from "@trojan_projects_zw/env/web";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface AppHeaderProps {
    onToggleSidebar?: () => void;
    sidebarCollapsed?: boolean;
}

// Map paths to page titles
const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/ai-chat": "AI Insights",
    "/notifications": "Notifications",
    "/settings": "Settings",
};

export function AppHeader({ onToggleSidebar, sidebarCollapsed }: AppHeaderProps) {
    const pathname = usePathname();
    const [showSearch, setShowSearch] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    const pageTitle = pageTitles[pathname] || "Dashboard";

    // Fetch notifications on mount and poll for updates
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = getStoredToken();
                const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/notifications?limit=5`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();

        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <Menu size={20} />
                </Button>
                <h1 className="text-xl font-semibold" style={{ color: TROJAN_NAVY }}>
                    {pageTitle}
                </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
                {/* Search */}
                {showSearch ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right">
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-64"
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSearch(false)}
                        >
                            <X size={20} />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSearch(true)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Search size={20} />
                    </Button>
                )}

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors outline-none">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center rounded-full text-white"
                                style={{ backgroundColor: TROJAN_NAVY }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        {!notification.read && (
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: TROJAN_GOLD }}
                                            />
                                        )}
                                        <span className="font-medium text-sm">{notification.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </DropdownMenuItem>
                            ))
                        )}
                        <DropdownMenuSeparator />
                        <Link href="/notifications">
                            <DropdownMenuItem className="justify-center text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                                View all notifications
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
