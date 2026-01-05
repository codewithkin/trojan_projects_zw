"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Briefcase, FileText, User, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 border-r border-gray-200 flex flex-col`}
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
              Trojan Projects
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} style={{ color: TROJAN_NAVY }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={
                  isActive
                    ? { backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }
                    : {}
                }
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
