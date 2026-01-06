"use client";

import { useSession } from "@/lib/auth-client";
import { isAdminEmail } from "@/config/admins";
import { AdminDashboard, StaffDashboard, SupportDashboard } from "@/components/dashboards";

export default function DashboardPage() {
    const { data: session } = useSession();
    
    const userRole = session?.user?.role || "user";
    const isAdmin = isAdminEmail(session?.user?.email || "");
    
    // Render role-specific dashboard
    if (isAdmin || userRole === "admin") {
        return <AdminDashboard />;
    }
    
    if (userRole === "staff") {
        return <StaffDashboard />;
    }
    
    if (userRole === "support") {
        return <SupportDashboard />;
    }
    
    // Default to admin dashboard for authorized users
    return <AdminDashboard />;
}
