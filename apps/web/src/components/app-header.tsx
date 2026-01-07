"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
    "/notifications": "Notifications",
    "/settings": "Settings",
};

export function AppHeader({ onToggleSidebar, sidebarCollapsed }: AppHeaderProps) {
    const pathname = usePathname();
    const [showSearch, setShowSearch] = useState(false);

    const pageTitle = pageTitles[pathname] || "Dashboard";

    // Mock notifications - in real app, fetch from API
    const notifications = [
        { id: 1, title: "New order received", time: "5 min ago", read: false },
        { id: 2, title: "Payment confirmed", time: "1 hour ago", read: false },
        { id: 3, title: "Staff member joined", time: "2 hours ago", read: true },
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;

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
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-500 hover:text-gray-700"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center rounded-full text-white"
                                    style={{ backgroundColor: TROJAN_NAVY }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
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
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                </DropdownMenuItem>
                            ))
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
