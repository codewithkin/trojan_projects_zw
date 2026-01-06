"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useSession } from "@/lib/auth-client";
import { hasAdminAccess } from "@/config/admins";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Wait for session to load
        if (isPending) return;

        // If not logged in, redirect to login
        if (!session) {
            router.push("/login");
            return;
        }

        // If logged in but not admin/staff, redirect to home
        if (!hasAdminAccess(session.user)) {
            router.push("/");
            return;
        }
    }, [session, isPending, router]);

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
    if (!session || !hasAdminAccess(session.user)) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
