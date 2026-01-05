"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    FolderKanban,
    FileText,
    User,
    LogOut,
    Menu,
    ChevronLeft,
    Sun,
    Camera,
    Zap,
    HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/services", icon: ShoppingBag },
    { name: "My Projects", href: "/projects", icon: FolderKanban },
    { name: "Quotes", href: "/quotes", icon: FileText },
];

const categories = [
    { name: "Solar", href: "/services?category=solar", icon: Sun, color: "#FFC107" },
    { name: "CCTV", href: "/services?category=cctv", icon: Camera, color: "#3B82F6" },
    { name: "Electrical", href: "/services?category=electrical", icon: Zap, color: "#8B5CF6" },
];

const bottomNavigation = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Help & Support", href: "/support", icon: HelpCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } transition-all duration-300 border-r border-gray-100 flex flex-col bg-white relative`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <Zap size={20} style={{ color: TROJAN_NAVY }} />
                    </div>
                    {isSidebarOpen && (
                        <div className="overflow-hidden">
                            <h1 className="text-lg font-bold truncate" style={{ color: TROJAN_NAVY }}>
                                Trojan Projects
                            </h1>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft
                        size={14}
                        className={`text-gray-600 transition-transform ${!isSidebarOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {/* Main Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <div className="mb-2">
                        {isSidebarOpen && (
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Menu
                            </p>
                        )}
                        {mainNavigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active
                                            ? "font-semibold shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    style={
                                        active
                                            ? { backgroundColor: TROJAN_NAVY, color: "#fff" }
                                            : {}
                                    }
                                    title={!isSidebarOpen ? item.name : undefined}
                                >
                                    <Icon size={20} className={active ? "text-white" : ""} />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Categories */}
                    {isSidebarOpen && (
                        <div className="pt-4 border-t border-gray-100">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Categories
                            </p>
                            {categories.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${item.color}20` }}
                                        >
                                            <Icon size={16} style={{ color: item.color }} />
                                        </div>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>

                {/* Bottom Navigation */}
                <div className="p-3 border-t border-gray-100 space-y-1">
                    {bottomNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                title={!isSidebarOpen ? item.name : undefined}
                            >
                                <Icon size={20} />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                        title={!isSidebarOpen ? "Sign Out" : undefined}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
