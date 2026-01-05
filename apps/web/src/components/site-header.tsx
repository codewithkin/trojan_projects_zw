"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FolderKanban, User, MessageCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const navItems = [
    { name: "Home", href: "/", icon: Package },
    { name: "My Projects", href: "/projects", icon: FolderKanban },
    { name: "Profile", href: "/profile", icon: User },
];

export function SiteHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, isPending } = authClient.useSession();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = "/login";
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            {/* Announcement Bar */}
            <div
                className="text-white text-center py-2 text-sm"
                style={{ backgroundColor: TROJAN_NAVY }}
            >
                <span className="mr-2">⚡</span>
                Professional Solar & Electrical Services in Zimbabwe
                <span className="ml-2 hidden sm:inline">• Free Quotes Available</span>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <span className="text-xl">⚡</span>
                        </div>
                        <span
                            className="text-xl font-bold hidden sm:block"
                            style={{ color: TROJAN_NAVY }}
                        >
                            Trojan Projects
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                                        ${active
                                            ? "text-white"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }
                                    `}
                                    style={active ? { backgroundColor: TROJAN_NAVY } : {}}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {!isPending && (
                            <>
                                {session?.user ? (
                                    <div className="hidden md:flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {session.user.email}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleSignOut}
                                            className="text-gray-500 hover:text-red-600"
                                        >
                                            <LogOut size={18} />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="hidden md:flex items-center gap-2">
                                        <Link href="/login">
                                            <Button variant="ghost" className="rounded-full">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup">
                                            <Button
                                                className="rounded-full"
                                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                            >
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all
                                        ${active
                                            ? "text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }
                                    `}
                                    style={active ? { backgroundColor: TROJAN_NAVY } : {}}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="border-t border-gray-100 pt-4 mt-4">
                            {session?.user ? (
                                <div className="space-y-3">
                                    <div className="px-4">
                                        <p className="font-medium text-gray-900">{session.user.name}</p>
                                        <p className="text-sm text-gray-500">{session.user.email}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 text-red-600"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        <Button
                                            className="w-full"
                                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
