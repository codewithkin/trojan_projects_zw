"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
    MoreHorizontal,
    Eye,
    Edit,
    CheckCircle,
    Clock,
    AlertTriangle,
    XCircle,
    PlayCircle,
    Loader2,
    RefreshCw,
    DollarSign,
    TrendingUp,
    Users,
    FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type ProjectStatus = "pending" | "starting" | "in_progress" | "waiting_for_review" | "completed" | "cancelled";

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
    location: string | null;
    notes: string | null;
    service: {
        id: string;
        name: string;
        slug: string;
        category: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

const getStatusBadge = (status: ProjectStatus) => {
    const config: Record<ProjectStatus, { variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock; label: string; color?: string }> = {
        pending: { variant: "secondary", icon: Clock, label: "Pending" },
        starting: { variant: "outline", icon: PlayCircle, label: "Starting" },
        in_progress: { variant: "default", icon: Clock, label: "In Progress", color: "bg-blue-500" },
        waiting_for_review: { variant: "default", icon: AlertTriangle, label: "Awaiting Review", color: "bg-yellow-500" },
        completed: { variant: "default", icon: CheckCircle, label: "Completed", color: "bg-green-500" },
        cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" },
    };
    const { variant, icon: Icon, label, color } = config[status];
    return (
        <Badge variant={variant} className={`gap-1 ${color || ""}`}>
            <Icon size={12} />
            {label}
        </Badge>
    );
};

export default function AdminProjectsPage() {
    const { isAuthorized, isLoading } = useAdminGuard();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            } else {
                toast.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthorized) {
            fetchProjects();
        }
    }, [isLoading, isAuthorized]);

    // Don't render if not authorized
    if (isLoading || !isAuthorized) {
        return null;
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = activeTab === "all"
        ? projects
        : projects.filter((project) => project.status === activeTab);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalRevenue = projects
            .filter(p => p.status === "completed" && p.finalPrice)
            .reduce((sum, p) => sum + (p.finalPrice || 0), 0);

        const pendingRevenue = projects
            .filter(p => p.status !== "completed" && p.status !== "cancelled" && p.finalPrice)
            .reduce((sum, p) => sum + (p.finalPrice || 0), 0);

        const uniqueCustomers = new Set(projects.map(p => p.user.id)).size;

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        const projectsThisMonth = projects.filter(p => new Date(p.createdAt) >= thisMonth).length;

        // Category breakdown
        const categoryBreakdown = projects.reduce((acc, p) => {
            acc[p.service.category] = (acc[p.service.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: projects.length,
            pending: projects.filter((p) => p.status === "pending").length,
            starting: projects.filter((p) => p.status === "starting").length,
            in_progress: projects.filter((p) => p.status === "in_progress").length,
            waiting_for_review: projects.filter((p) => p.status === "waiting_for_review").length,
            completed: projects.filter((p) => p.status === "completed").length,
            cancelled: projects.filter((p) => p.status === "cancelled").length,
            totalRevenue,
            pendingRevenue,
            uniqueCustomers,
            projectsThisMonth,
            categoryBreakdown,
        };
    }, [projects]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-ZW", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatPrice = (price: number | null) => {
        if (!price) return "-";
        return `$${price.toLocaleString()}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Stats cards configuration
    const statsCards = [
        {
            title: "Total Projects",
            value: stats.total,
            description: `${stats.projectsThisMonth} this month`,
            icon: FolderOpen,
            color: TROJAN_NAVY,
        },
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            description: `${formatCurrency(stats.pendingRevenue)} pending`,
            icon: DollarSign,
            color: "#16A34A",
        },
        {
            title: "Active Projects",
            value: stats.in_progress + stats.starting,
            description: `${stats.waiting_for_review} awaiting review`,
            icon: TrendingUp,
            color: "#3B82F6",
        },
        {
            title: "Unique Customers",
            value: stats.uniqueCustomers,
            description: `${stats.completed} completed projects`,
            icon: Users,
            color: "#8B5CF6",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Projects
                    </h1>
                    <p className="text-gray-500">View and manage customer projects</p>
                </div>
                <Button variant="outline" onClick={fetchProjects} disabled={loading} className="flex items-center">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Category Breakdown */}
            {Object.keys(stats.categoryBreakdown).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Projects by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                                <Badge
                                    key={category}
                                    variant="secondary"
                                    className="px-3 py-1 capitalize"
                                >
                                    {category}: {count}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex-wrap h-auto gap-1">
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                    <TabsTrigger value="starting">Starting ({stats.starting})</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress ({stats.in_progress})</TabsTrigger>
                    <TabsTrigger value="waiting_for_review">Review ({stats.waiting_for_review})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    {loading ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="flex flex-col items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
                                    <p className="text-gray-500">Loading projects...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : filteredProjects.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No projects found in this category</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredProjects.map((project) => (
                                <Card key={project.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Left side - Project info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {project.service.name}
                                                    </h3>
                                                    {getStatusBadge(project.status)}
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                                    <span>{project.user.name}</span>
                                                    <span>•</span>
                                                    <span>{project.location || "No location"}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(project.createdAt)}</span>
                                                </div>
                                                {project.technicianName && (
                                                    <p className="text-sm text-blue-600 mt-1">
                                                        Assigned to: {project.technicianName}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Right side - Price and actions */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                                        {formatPrice(project.finalPrice)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 uppercase">
                                                        {project.service.category}
                                                    </p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <Link href={`/projects/${project.id}` as string}>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link href={`/projects/${project.id}/edit` as string}>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Project
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
