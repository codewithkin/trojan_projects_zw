"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Calendar,
    Star,
    CheckCircle,
    Clock,
    MapPin,
    Award,
    Edit,
    MoreVertical,
    TrendingUp,
    Package,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatsCard } from "@/components/stats-card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock staff data
const staffData = {
    id: "STF-001",
    name: "Tendai Moyo",
    email: "tendai.moyo@trojanprojects.co.zw",
    phone: "+263 77 987 6543",
    role: "staff",
    position: "Senior Technician",
    department: "Solar Installation",
    joinDate: "2022-03-15",
    avatar: "",
    initials: "TM",
    status: "active",
    skills: ["Solar Installation", "Inverters", "Electrical", "Battery Systems"],
    certifications: [
        { name: "Solar PV Installation", issuer: "ZERA", date: "2023-05-10" },
        { name: "Electrical Safety", issuer: "NSSA", date: "2022-08-15" },
    ],
    stats: {
        totalProjects: 156,
        completedThisMonth: 8,
        avgRating: 4.8,
        onTimeRate: 94,
    },
};

const monthlyPerformance = [
    { month: "Aug", projects: 6, target: 6 },
    { month: "Sep", projects: 7, target: 6 },
    { month: "Oct", projects: 8, target: 7 },
    { month: "Nov", projects: 6, target: 7 },
    { month: "Dec", projects: 9, target: 7 },
    { month: "Jan", projects: 8, target: 8 },
];

const currentProjects = [
    {
        id: "ORD-2024-001",
        customer: "John Mukamuri",
        service: "5KVA Solar System",
        status: "in-progress",
        scheduledDate: "2024-01-15",
        priority: "high",
    },
    {
        id: "ORD-2024-003",
        customer: "Grace Ncube",
        service: "Electric Fence",
        status: "pending",
        scheduledDate: "2024-01-18",
        priority: "medium",
    },
    {
        id: "ORD-2024-005",
        customer: "Peter Moyo",
        service: "Inverter Repair",
        status: "pending",
        scheduledDate: "2024-01-19",
        priority: "high",
    },
];

const recentReviews = [
    {
        id: 1,
        customer: "Sarah Dziva",
        project: "3KVA Inverter",
        rating: 5,
        comment: "Excellent work, very professional!",
        date: "2024-01-08",
    },
    {
        id: 2,
        customer: "Mike Sibanda",
        project: "Solar Geyser",
        rating: 5,
        comment: "Completed ahead of schedule. Great job!",
        date: "2024-01-05",
    },
    {
        id: 3,
        customer: "Linda Chipo",
        project: "Gate Motor",
        rating: 4,
        comment: "Good installation, minor delay but good communication.",
        date: "2024-01-02",
    },
];

const chartConfig: ChartConfig = {
    projects: { label: "Projects", color: TROJAN_NAVY },
    target: { label: "Target", color: "#E5E7EB" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: "#D1FAE5", text: "#059669" },
    inactive: { bg: "#FEE2E2", text: "#DC2626" },
    "on-leave": { bg: "#FEF3C7", text: "#D97706" },
};

const priorityColors: Record<string, string> = {
    high: "#DC2626",
    medium: "#D97706",
    low: "#6B7280",
};

export default function StaffDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [status, setStatus] = useState(staffData.status);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={staffData.avatar} />
                            <AvatarFallback className="text-lg">{staffData.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                    {staffData.name}
                                </h1>
                                <Badge
                                    style={{
                                        backgroundColor: statusColors[status]?.bg,
                                        color: statusColors[status]?.text,
                                    }}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                                </Badge>
                            </div>
                            <p className="text-gray-500">
                                {staffData.position} • {staffData.department}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="on-leave">On Leave</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button style={{ backgroundColor: TROJAN_NAVY }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Projects"
                    value={staffData.stats.totalProjects}
                    change="All time"
                    changeType="neutral"
                    icon={Package}
                    iconColor={TROJAN_NAVY}
                    iconBgColor="#E0E7FF"
                />
                <StatsCard
                    title="This Month"
                    value={staffData.stats.completedThisMonth}
                    change="8 target"
                    changeType="positive"
                    icon={CheckCircle}
                    iconColor="#10B981"
                    iconBgColor="#D1FAE5"
                />
                <StatsCard
                    title="Avg Rating"
                    value={staffData.stats.avgRating}
                    change="out of 5.0"
                    changeType="positive"
                    icon={Star}
                    iconColor="#F59E0B"
                    iconBgColor="#FEF3C7"
                />
                <StatsCard
                    title="On-Time Rate"
                    value={`${staffData.stats.onTimeRate}%`}
                    change="Last 3 months"
                    changeType="positive"
                    icon={Clock}
                    iconColor="#3B82F6"
                    iconBgColor="#DBEAFE"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Performance</CardTitle>
                            <CardDescription>Projects completed vs targets</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px]">
                                <BarChart data={monthlyPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="projects" fill={TROJAN_NAVY} name="Completed" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="projects">
                        <TabsList>
                            <TabsTrigger value="projects">Current Projects</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assigned Projects</CardTitle>
                                    <CardDescription>Currently assigned work</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {currentProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between p-4 rounded-lg border"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-2 h-12 rounded-full"
                                                        style={{ backgroundColor: priorityColors[project.priority] }}
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{project.service}</p>
                                                            <Badge
                                                                variant="outline"
                                                                style={{
                                                                    borderColor: priorityColors[project.priority],
                                                                    color: priorityColors[project.priority],
                                                                }}
                                                            >
                                                                {project.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{project.customer}</p>
                                                        <p className="text-xs text-gray-400">
                                                            Scheduled: {new Date(project.scheduledDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary">
                                                        {project.status.replace("-", " ").toUpperCase()}
                                                    </Badge>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                                                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Reviews</CardTitle>
                                    <CardDescription>Feedback from completed projects</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentReviews.map((review) => (
                                            <div key={review.id} className="p-4 rounded-lg bg-gray-50">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium">{review.customer}</p>
                                                        <p className="text-sm text-gray-500">{review.project}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        {renderStars(review.rating)}
                                                        <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 italic">&ldquo;{review.comment}&rdquo;</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-sm">{staffData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p>{staffData.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Joined</p>
                                        <p>{new Date(staffData.joinDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {staffData.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Certifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {staffData.certifications.map((cert, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-gray-50">
                                        <p className="font-medium">{cert.name}</p>
                                        <p className="text-sm text-gray-500">{cert.issuer}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Issued: {new Date(cert.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role & Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Role</span>
                                    <Badge style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                        {staffData.role.charAt(0).toUpperCase() + staffData.role.slice(1)}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Position</span>
                                    <span className="font-medium">{staffData.position}</span>
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Change Role
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
