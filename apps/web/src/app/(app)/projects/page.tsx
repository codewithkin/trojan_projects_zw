"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, AlertCircle, Truck, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { userProjects, type ProjectStatus } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const tabs: { id: ProjectStatus | "all"; label: string; icon: typeof Clock; color: string }[] = [
    { id: "all", label: "All", icon: Package, color: "#6B7280" },
    { id: "pending", label: "Pending", icon: Clock, color: "#CA8A04" },
    { id: "confirmed", label: "Confirmed", icon: AlertCircle, color: "#2563EB" },
    { id: "in-progress", label: "In Progress", icon: Truck, color: "#7C3AED" },
    { id: "completed", label: "Completed", icon: CheckCircle2, color: "#16A34A" },
    { id: "cancelled", label: "Cancelled", icon: XCircle, color: "#DC2626" },
];

export default function ProjectsPage() {
    const [activeTab, setActiveTab] = useState<ProjectStatus | "all">("all");

    const filteredProjects = useMemo(() => {
        return userProjects.filter((project) => {
            if (activeTab === "all") return true;
            return project.status === activeTab;
        });
    }, [activeTab]);

    const getTabCount = (tabId: ProjectStatus | "all") => {
        if (tabId === "all") return userProjects.length;
        return userProjects.filter((p) => p.status === tabId).length;
    };

    const totalInvestment = useMemo(() => {
        return userProjects
            .filter(p => p.status !== "cancelled")
            .reduce((sum, p) => sum + p.price, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1
                            className="text-3xl font-bold mb-1"
                            style={{ color: TROJAN_NAVY }}
                        >
                            My Projects
                        </h1>
                        <p className="text-gray-600">
                            Track and manage your service requests
                        </p>
                    </div>
                    <Link href="/">
                        <Button
                            size="lg"
                            className="rounded-full font-semibold"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                        >
                            Request New Service
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {tabs.slice(1).map((tab) => {
                        const Icon = tab.icon;
                        const count = getTabCount(tab.id);
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    bg-white rounded-xl p-4 border-2 transition-all hover:shadow-md text-left
                                    ${activeTab === tab.id ? "shadow-md" : "border-transparent"}
                                `}
                                style={activeTab === tab.id ? { borderColor: tab.color } : {}}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${tab.color}20` }}
                                    >
                                        <Icon size={20} style={{ color: tab.color }} />
                                    </div>
                                    <div>
                                        <p
                                            className="text-2xl font-bold"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            {count}
                                        </p>
                                        <p className="text-xs text-gray-500">{tab.label}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Pills */}
                <div className="bg-white rounded-xl border border-gray-100 p-1.5 mb-6 inline-flex flex-wrap gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const count = getTabCount(tab.id);
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${isActive
                                        ? "text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }
                                `}
                                style={isActive ? { backgroundColor: TROJAN_NAVY } : {}}
                            >
                                <Icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span
                                    className={`
                                        px-2 py-0.5 rounded-full text-xs font-semibold
                                        ${isActive ? "bg-white/20" : "bg-gray-100"}
                                    `}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onViewDetails={() => console.log("View details:", project.id)}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                            style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                        >
                            <Package size={32} style={{ color: TROJAN_GOLD }} />
                        </div>
                        <h3
                            className="text-xl font-semibold mb-2"
                            style={{ color: TROJAN_NAVY }}
                        >
                            No projects found
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            {activeTab === "all"
                                ? "You haven't requested any services yet. Browse our services and get started!"
                                : `You don't have any ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} projects.`
                            }
                        </p>
                        {activeTab === "all" && (
                            <Link href="/">
                                <Button
                                    size="lg"
                                    className="rounded-full font-semibold"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    Browse Services
                                    <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </Link>
                        )}
                        {activeTab !== "all" && (
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setActiveTab("all")}
                            >
                                View All Projects
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
