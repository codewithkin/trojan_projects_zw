"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu, Search, X, Plus, FolderPlus, FileText } from "lucide-react";
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
    "/ai-chat": "AI Insights",
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
                {/* New Project / New Quote Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                    <Link
                        href="/projects/new"
                        className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm font-medium border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
                    >
                        <FolderPlus size={16} />
                        <span className="hidden md:inline">New Project</span>
                    </Link>
                    <Link
                        href="/quotes/new"
                        className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm font-medium rounded-md transition-colors"
                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                    >
                        <FileText size={16} />
                        <span className="hidden md:inline">New Quote</span>
                    </Link>
                </div>

                {/* Mobile: Dropdown for actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="sm:hidden inline-flex items-center justify-center h-9 w-9 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                        <Plus size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/projects/new" className="flex items-center gap-2 w-full">
                                <FolderPlus size={16} />
                                New Project
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/quotes/new" className="flex items-center gap-2 w-full">
                                <FileText size={16} />
                                New Quote
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
