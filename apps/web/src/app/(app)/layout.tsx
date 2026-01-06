"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { hasAdminAccess } from "@/config/admins";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, session, isPending } = useSession();
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Wait for session to load
        if (isPending) return;

        // If not logged in, redirect to login
        if (!user) {
            router.push("/login");
            return;
        }

        // If logged in but not admin/staff, redirect to home
        if (!hasAdminAccess(user)) {
            router.push("/");
            return;
        }
    }, [user, isPending, router]);

    // Show loading while checking auth
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render content if not authorized
    if (!user || !hasAdminAccess(user)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AppSidebar collapsed={sidebarCollapsed} />
            <div
                className={cn(
                    "transition-all duration-300",
                    sidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <AppHeader
                    onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    sidebarCollapsed={sidebarCollapsed}
                />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
