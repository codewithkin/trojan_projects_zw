"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <SiteHeader />
            <main className="min-h-[calc(100vh-200px)]">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
