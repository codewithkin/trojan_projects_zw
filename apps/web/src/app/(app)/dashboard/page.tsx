"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderKanban, Bell, UserPlus, Clock, CheckCircle, Loader2, Users, DollarSign, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAdminGuard } from "@/hooks/use-admin-guard";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ProjectStats {
    totalProjects: number;
    pendingCount: number;
    startingCount: number;
    inProgressCount: number;
    waitingReviewCount: number;
    completedCount: number;
    cancelledCount: number;
    totalRevenue: number;
    activeCustomers: number;
}

interface RecentProject {
    id: string;
    status: string;
    finalPrice: number | null;
    location: string | null;
    service: { id: string; name: string; category: string };
    user: { id: string; name: string; email: string };
    createdAt: string;
}

export default function DashboardPage() {
    const { isAuthorized, isLoading } = useAdminGuard();
    const [stats, setStats] = useState<ProjectStats | null>(null);
    const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
    const [loading, setLoading] = useState(true);

    // Invite form state
    const [inviteForm, setInviteForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthorized) {
            fetchStats();
        }
    }, [isLoading, isAuthorized]);

    // Don't render if not authorized
    if (isLoading || !isAuthorized) {
        return null;
    }

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setRecentProjects(data.recentProjects || []);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inviteForm.email || !inviteForm.name || !inviteForm.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (inviteForm.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setInviting(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(inviteForm),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Invitation sent to ${inviteForm.email}`);
                setInviteForm({ name: "", email: "", password: "", role: "staff" });
            } else {
                toast.error(data.error || "Failed to send invitation");
            }
        } catch (error) {
            console.error("Error inviting user:", error);
            toast.error("Failed to send invitation");
        } finally {
            setInviting(false);
        }
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setInviteForm({ ...inviteForm, password });
        setShowPassword(true);
    };

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            starting: { bg: "bg-purple-100", text: "text-purple-700", label: "Starting" },
            in_progress: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
            waiting_for_review: { bg: "bg-orange-100", text: "text-orange-700", label: "Review" },
            completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
            cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
        };
        const style = statusStyles[status] || statusStyles.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                {style.label}
            </span>
        );
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        return "Just now";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Manage your business operations</p>
            </div>

            {/* Quick Stats */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Projects</p>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        {stats?.totalProjects || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${TROJAN_GOLD}20` }}>
                                    <FolderKanban size={24} style={{ color: TROJAN_NAVY }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pending Projects</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {stats?.pendingCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                                    <Clock size={24} className="text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {stats?.completedCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                                    <CheckCircle size={24} className="text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Customers</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {stats?.activeCustomers || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                                    <Users size={24} className="text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                        <CardDescription>Latest customer projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    </div>
                                ))}
                            </div>
                        ) : recentProjects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FolderKanban size={40} className="mx-auto mb-2 text-gray-300" />
                                <p>No projects yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">{project.service.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {project.user.name} • {project.location || "No location"}
                                            </p>
                                            <p className="text-xs text-gray-400">{formatTimeAgo(project.createdAt)}</p>
                                        </div>
                                        {getStatusBadge(project.status)}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <Link href="/projects">
                            <Button variant="outline" className="w-full mt-4">
                                View All Projects
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Invite Team Members */}
                <Card id="invite">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus size={20} />
                            Invite Team Members
                        </CardTitle>
                        <CardDescription>
                            Create accounts for staff and support team members
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-name">Full Name</Label>
                                <Input
                                    id="invite-name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={inviteForm.name}
                                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="invite-email">Email Address</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="team@example.com"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="invite-password">Password</Label>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-xs"
                                        onClick={generatePassword}
                                    >
                                        Generate
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="invite-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min 6 characters"
                                        value={inviteForm.password}
                                        onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="invite-role">Role</Label>
                                <Select
                                    value={inviteForm.role}
                                    onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="staff">Staff (Technician)</SelectItem>
                                        <SelectItem value="support">Support</SelectItem>
                                        <SelectItem value="user">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                disabled={inviting}
                            >
                                {inviting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Invitation"
                                )}
                            </Button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            An email will be sent to the user with their login credentials.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
