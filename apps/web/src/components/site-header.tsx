"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Package, FolderKanban, MessageCircle, Users, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-session";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const navItems = [
    { name: "Home", href: "/", icon: Package },
    { name: "Services", href: "/projects", icon: Package },
    { name: "About Us", href: "/about", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageCircle },
];

export function SiteHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isPending } = useSession();

    // Conditionally add "My Projects" for authenticated users
    const displayNavItems = user
        ? [
            ...navItems.slice(0, 2),
            { name: "My Projects", href: "/my-projects", icon: FolderKanban },
            ...navItems.slice(2),
        ]
        : navItems;

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-white">
            {/* Announcement Bar */}
            <div
                className="text-white text-center py-2 text-sm"
                style={{ backgroundColor: TROJAN_NAVY }}
            >
                Professional Solar & Electrical Services in Zimbabwe
                <span className="ml-2 hidden sm:inline">• Free Quotes Available</span>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/trojan-logo.svg" alt="Trojan Projects" width={160} height={40} priority />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {displayNavItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        text-sm font-medium transition-colors
                                        ${active
                                            ? ""
                                            : "text-gray-600 hover:text-gray-900"
                                        }
                                    `}
                                    style={active ? { color: TROJAN_NAVY, fontWeight: '600' } : {}}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {!isPending && (
                            <>
                                {user ? (
                                    <div className="hidden md:flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
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
                        {displayNavItems.map((item) => {
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
                            {user ? (
                                <div className="space-y-3">
                                    <div className="px-4">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
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
