"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Clock,
    Car,
    Hammer,
    Star,
    CheckCircle2,
    XCircle,
    Calendar,
    DollarSign,
    User,
    Layers,
    Plus,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";
import { env } from "@trojan_projects_zw/env/web";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type ProjectStatus = "pending" | "starting" | "in_progress" | "waiting_for_review" | "completed" | "cancelled";
type TabId = ProjectStatus | "all";

interface Project {
    id: string;
    status: ProjectStatus;
    finalPrice: number | null;
    scheduledDate: string | null;
    startedAt: string | null;
    completedAt: string | null;
    technicianName: string | null;
    technicianPhone: string | null;
    userRating: number | null;
    userReview: string | null;
    service: {
        id: string;
        name: string;
        slug: string;
        category: string;
        images: string[];
    };
    location: string;
    notes: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

const tabs: { id: TabId; label: string; icon: any; color: string }[] = [
    { id: "all", label: "All", icon: Layers, color: "#6B7280" },
    { id: "pending", label: "Pending", icon: Clock, color: "#CA8A04" },
    { id: "starting", label: "Starting", icon: Car, color: "#2563EB" },
    { id: "in_progress", label: "In Progress", icon: Hammer, color: "#7C3AED" },
    { id: "waiting_for_review", label: "Review", icon: Star, color: "#F97316" },
    { id: "completed", label: "Completed", icon: CheckCircle2, color: "#16A34A" },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: "Pending", color: "#CA8A04", bg: "#FEF9C3", icon: Clock },
    starting: { label: "Team on the way", color: "#2563EB", bg: "#DBEAFE", icon: Car },
    in_progress: { label: "In Progress", color: "#7C3AED", bg: "#EDE9FE", icon: Hammer },
    waiting_for_review: { label: "Waiting for Review", color: "#F97316", bg: "#FFEDD5", icon: Star },
    completed: { label: "Completed", color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
};

export default function MyProjectsPage() {
    const router = useRouter();
    const { user, isPending } = useSession();
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/projects`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.projects) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchProjects();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [user, isPending, fetchProjects]);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            if (activeTab === "all") return true;
            return project.status === activeTab;
        });
    }, [activeTab, projects]);

    const getTabCount = (tabId: TabId) => {
        if (tabId === "all") return projects.length;
        return projects.filter((p) => p.status === tabId).length;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // If not logged in
    if (!isPending && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
                    <div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <Layers size={32} style={{ color: TROJAN_NAVY }} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                        Sign In Required
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Please sign in to view your projects
                    </p>
                    <Link href="/login">
                        <Button className="w-full" style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#FFC107] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading projects...</p>
                </div>
            </div>
        );
    }

    const renderProjectCard = (project: Project) => {
        const config = statusConfig[project.status];
        const StatusIcon = config.icon;

        return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                    {/* Header with status */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 mr-3">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                {project.service.name}
                            </h3>
                            <p className="text-sm text-gray-500">{project.location}</p>
                        </div>
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{ backgroundColor: config.bg, color: config.color }}
                        >
                            <StatusIcon size={12} />
                            {config.label}
                        </div>
                    </div>

                    {/* Price & Date */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-gray-700">
                            <DollarSign size={16} className="text-gray-500" />
                            <span className="text-sm font-medium">
                                {project.finalPrice ? `US$${project.finalPrice.toFixed(2)}` : "TBD"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={14} />
                            <span className="text-xs">{formatDate(project.createdAt)}</span>
                        </div>
                    </div>

                    {/* Technician info if assigned */}
                    {project.technicianName && (
                        <div className="flex items-center gap-2 py-2 border-t border-gray-100">
                            <User size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {project.technicianName}
                                {project.technicianPhone && ` • ${project.technicianPhone}`}
                            </span>
                        </div>
                    )}

                    {/* Status-specific content */}
                    {project.status === "pending" && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-100 flex items-center gap-2">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-600">Waiting for acceptance</span>
                        </div>
                    )}

                    {project.status === "starting" && (
                        <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: config.bg }}>
                            <div className="flex items-center gap-2 justify-center">
                                <Car size={18} style={{ color: config.color }} />
                                <span className="text-sm font-medium" style={{ color: config.color }}>
                                    Team is on the way!
                                </span>
                            </div>
                        </div>
                    )}

                    {project.status === "in_progress" && (
                        <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: config.bg }}>
                            <div className="flex items-center gap-2 justify-center">
                                <Hammer size={18} style={{ color: config.color }} />
                                <span className="text-sm font-medium" style={{ color: config.color }}>
                                    Work in progress
                                </span>
                            </div>
                        </div>
                    )}

                    {project.status === "completed" && project.userRating && (
                        <div className="mt-3 p-3 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: config.bg }}>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        fill={star <= project.userRating! ? TROJAN_GOLD : "none"}
                                        color={star <= project.userRating! ? TROJAN_GOLD : "#D1D5DB"}
                                    />
                                ))}
                            </div>
                            <span className="text-sm" style={{ color: config.color }}>
                                Your rating: {project.userRating}/5
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                            My Projects
                        </h1>
                        <p className="text-gray-500 mt-1">Track your service requests</p>
                    </div>
                    <Link href="/projects/new">
                        <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                            <Plus size={18} className="mr-2" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards - Desktop */}
                <div className="hidden md:grid grid-cols-5 gap-4 mb-6">
                    {tabs.slice(1).map((tab) => {
                        const count = getTabCount(tab.id);
                        const isActive = activeTab === tab.id;
                        const TabIcon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="bg-white rounded-xl p-4 transition-all hover:shadow-md"
                                style={{
                                    borderWidth: 2,
                                    borderColor: isActive ? tab.color : "transparent",
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${tab.color}20` }}
                                    >
                                        <TabIcon size={22} style={{ color: tab.color }} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                            {count}
                                        </div>
                                        <div className="text-xs text-gray-500">{tab.label}</div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Stats Cards - Mobile */}
                <div className="md:hidden overflow-x-auto mb-6 -mx-4 px-4">
                    <div className="flex gap-3 pb-2">
                        {tabs.slice(1).map((tab) => {
                            const count = getTabCount(tab.id);
                            const isActive = activeTab === tab.id;
                            const TabIcon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="bg-white rounded-xl p-3 min-w-[110px] transition-all"
                                    style={{
                                        borderWidth: 2,
                                        borderColor: isActive ? tab.color : "transparent",
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${tab.color}20` }}
                                        >
                                            <TabIcon size={18} style={{ color: tab.color }} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
                                                {count}
                                            </div>
                                            <div className="text-[11px] text-gray-500">{tab.label}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Pills */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = getTabCount(tab.id);
                        const TabIcon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors"
                                style={{
                                    backgroundColor: isActive ? TROJAN_NAVY : "white",
                                    color: isActive ? "white" : "#6B7280",
                                }}
                            >
                                <TabIcon size={16} />
                                <span className="font-semibold text-sm">{tab.label}</span>
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                    style={{
                                        backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#F3F4F6",
                                    }}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Projects List */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProjects.map((project) => renderProjectCard(project))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                            style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                        >
                            <Layers size={32} style={{ color: TROJAN_GOLD }} />
                        </div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: TROJAN_NAVY }}>
                            No projects found
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {activeTab === "all"
                                ? "You haven't started any projects yet. Create a new project to get started!"
                                : `You don't have any ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} projects.`}
                        </p>
                        {activeTab === "all" ? (
                            <Link href="/projects/new">
                                <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                    New Project
                                    <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setActiveTab("all")}
                                style={{ borderColor: "#E5E7EB" }}
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
