"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Clock,
    CheckCircle,
    MapPin,
    User,
    Calendar,
    AlertTriangle,
    Phone,
    Play,
    Pause,
    Check,
    FileText,
    Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Project type
type Project = {
    id: string;
    orderNumber: string;
    title: string;
    customer: {
        name: string;
        phone: string;
        email: string;
    };
    location: string;
    service: string;
    status: "pending" | "in_progress" | "paused" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    progress: number;
    startDate: string;
    dueDate: string;
    notes: string;
    checklist: { id: string; task: string; completed: boolean }[];
};

// Mock data
const mockProjects: Project[] = [
    {
        id: "1",
        orderNumber: "ORD-2024-001",
        title: "5KVA Solar System Installation",
        customer: {
            name: "John Mukamuri",
            phone: "+263 77 123 4567",
            email: "john@example.com",
        },
        location: "123 Greendale, Mutare",
        service: "Solar Systems",
        status: "in_progress",
        priority: "high",
        progress: 65,
        startDate: "2024-01-15",
        dueDate: "2024-01-20",
        notes: "Customer requested installation on the east-facing roof section.",
        checklist: [
            { id: "1", task: "Site survey completed", completed: true },
            { id: "2", task: "Materials delivered", completed: true },
            { id: "3", task: "Mounting brackets installed", completed: true },
            { id: "4", task: "Panels mounted", completed: false },
            { id: "5", task: "Wiring completed", completed: false },
            { id: "6", task: "Inverter connected", completed: false },
            { id: "7", task: "System tested", completed: false },
            { id: "8", task: "Customer handover", completed: false },
        ],
    },
    {
        id: "2",
        orderNumber: "ORD-2024-003",
        title: "Electric Fence Repair",
        customer: {
            name: "Peter Moyo",
            phone: "+263 77 345 6789",
            email: "peter@example.com",
        },
        location: "78 Chikanga, Mutare",
        service: "Electrical",
        status: "in_progress",
        priority: "high",
        progress: 80,
        startDate: "2024-01-14",
        dueDate: "2024-01-18",
        notes: "Fence damaged by fallen tree branch. Replace 20m section.",
        checklist: [
            { id: "1", task: "Assess damage", completed: true },
            { id: "2", task: "Order replacement parts", completed: true },
            { id: "3", task: "Remove damaged section", completed: true },
            { id: "4", task: "Install new wiring", completed: true },
            { id: "5", task: "Test energizer", completed: false },
            { id: "6", task: "Final inspection", completed: false },
        ],
    },
    {
        id: "3",
        orderNumber: "ORD-2024-002",
        title: "CCTV 8-Camera System Setup",
        customer: {
            name: "Mary Chigumba",
            phone: "+263 77 234 5678",
            email: "mary@example.com",
        },
        location: "45 Dangamvura, Mutare",
        service: "CCTV & Security",
        status: "pending",
        priority: "medium",
        progress: 0,
        startDate: "2024-01-22",
        dueDate: "2024-01-26",
        notes: "Commercial property. 8 cameras: 4 indoor, 4 outdoor.",
        checklist: [
            { id: "1", task: "Site survey", completed: false },
            { id: "2", task: "Cable routing plan", completed: false },
            { id: "3", task: "Camera mounting", completed: false },
            { id: "4", task: "NVR setup", completed: false },
            { id: "5", task: "Mobile app configuration", completed: false },
            { id: "6", task: "Customer training", completed: false },
        ],
    },
    {
        id: "4",
        orderNumber: "ORD-2023-045",
        title: "Inverter 3KVA Installation",
        customer: {
            name: "James Banda",
            phone: "+263 77 567 8901",
            email: "james@example.com",
        },
        location: "99 Sakubva, Mutare",
        service: "Inverters",
        status: "completed",
        priority: "low",
        progress: 100,
        startDate: "2024-01-08",
        dueDate: "2024-01-10",
        notes: "Standard residential installation with 2 batteries.",
        checklist: [
            { id: "1", task: "Site preparation", completed: true },
            { id: "2", task: "Inverter mounting", completed: true },
            { id: "3", task: "Battery connection", completed: true },
            { id: "4", task: "Changeover wiring", completed: true },
            { id: "5", task: "System testing", completed: true },
            { id: "6", task: "Customer handover", completed: true },
        ],
    },
];

const getPriorityBadge = (priority: Project["priority"]) => {
    const config: Record<Project["priority"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
        low: { variant: "secondary", label: "Low" },
        medium: { variant: "outline", label: "Medium" },
        high: { variant: "default", label: "High" },
        urgent: { variant: "destructive", label: "Urgent" },
    };
    const { variant, label } = config[priority];
    return <Badge variant={variant}>{label}</Badge>;
};

const getStatusConfig = (status: Project["status"]) => {
    const config: Record<Project["status"], { bg: string; text: string; icon: typeof Clock; label: string }> = {
        pending: { bg: "bg-gray-100", text: "text-gray-700", icon: Clock, label: "Pending" },
        in_progress: { bg: "bg-blue-100", text: "text-blue-700", icon: Play, label: "In Progress" },
        paused: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Pause, label: "Paused" },
        completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Completed" },
    };
    return config[status];
};

export default function MyWorkPage() {
    const [activeTab, setActiveTab] = useState("active");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const getFilteredProjects = () => {
        switch (activeTab) {
            case "active":
                return mockProjects.filter((p) => p.status === "in_progress" || p.status === "paused");
            case "pending":
                return mockProjects.filter((p) => p.status === "pending");
            case "completed":
                return mockProjects.filter((p) => p.status === "completed");
            default:
                return mockProjects;
        }
    };

    const stats = {
        active: mockProjects.filter((p) => p.status === "in_progress" || p.status === "paused").length,
        pending: mockProjects.filter((p) => p.status === "pending").length,
        completed: mockProjects.filter((p) => p.status === "completed").length,
        urgent: mockProjects.filter((p) => p.priority === "urgent" || p.priority === "high").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        My Work
                    </h1>
                    <p className="text-gray-500">Manage your assigned projects and tasks</p>
                </div>
                <Link href="/calendar">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Calendar
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Start</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    </CardContent>
                </Card>
                <Card className={stats.urgent > 0 ? "border-red-200 bg-red-50" : ""}>
                    <CardHeader className="pb-2">
                        <CardTitle className={cn("text-sm font-medium", stats.urgent > 0 ? "text-red-600" : "text-gray-500")}>
                            High Priority
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", stats.urgent > 0 ? "text-red-600" : "text-gray-600")}>
                            {stats.urgent}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                    <TabsTrigger value="all">All Projects</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {getFilteredProjects().map((project) => {
                            const statusConfig = getStatusConfig(project.status);
                            const completedTasks = project.checklist.filter((t) => t.completed).length;
                            const totalTasks = project.checklist.length;

                            return (
                                <Card
                                    key={project.id}
                                    className={cn(
                                        "cursor-pointer transition-all hover:shadow-md",
                                        project.priority === "urgent" && "border-red-300",
                                        project.priority === "high" && "border-orange-300"
                                    )}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500">{project.orderNumber}</p>
                                                <CardTitle className="text-lg mt-1">{project.title}</CardTitle>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getPriorityBadge(project.priority)}
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                                        statusConfig.bg,
                                                        statusConfig.text
                                                    )}
                                                >
                                                    <statusConfig.icon size={12} />
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <User size={14} />
                                                {project.customer.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} />
                                                {project.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={14} />
                                                Due: {project.dueDate}
                                            </div>

                                            {/* Progress */}
                                            <div className="space-y-1 pt-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-medium">
                                                        {completedTasks}/{totalTasks} tasks
                                                    </span>
                                                </div>
                                                <Progress value={project.progress} className="h-2" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {getFilteredProjects().length === 0 && (
                            <div className="col-span-2">
                                <Card className="p-12 text-center">
                                    <CheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects</h3>
                                    <p className="text-gray-500">
                                        {activeTab === "completed"
                                            ? "You haven't completed any projects yet"
                                            : "No projects in this category"}
                                    </p>
                                </Card>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Project Detail Dialog */}
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedProject && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{selectedProject.orderNumber}</p>
                                        <DialogTitle className="text-xl">{selectedProject.title}</DialogTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getPriorityBadge(selectedProject.priority)}
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Customer Info */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-500">Customer</h4>
                                    <Card>
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-medium">{selectedProject.customer.name}</p>
                                                    <p className="text-sm text-gray-500">{selectedProject.customer.email}</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Phone size={14} className="mr-2" />
                                                    {selectedProject.customer.phone}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Location & Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-500 mb-2">Location</h4>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin size={16} className="text-gray-400" />
                                            {selectedProject.location}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-500 mb-2">Timeline</h4>
                                        <div className="text-sm">
                                            <p>Start: {selectedProject.startDate}</p>
                                            <p>Due: {selectedProject.dueDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedProject.notes && (
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-500 mb-2">Notes</h4>
                                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedProject.notes}</p>
                                    </div>
                                )}

                                {/* Checklist */}
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500 mb-2">Task Checklist</h4>
                                    <div className="space-y-2">
                                        {selectedProject.checklist.map((task) => (
                                            <div
                                                key={task.id}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-lg border",
                                                    task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded-full flex items-center justify-center",
                                                        task.completed ? "bg-green-500" : "border-2 border-gray-300"
                                                    )}
                                                >
                                                    {task.completed && <Check size={12} className="text-white" />}
                                                </div>
                                                <span
                                                    className={cn(
                                                        "text-sm flex-1",
                                                        task.completed && "line-through text-gray-500"
                                                    )}
                                                >
                                                    {task.task}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button variant="outline" className="flex-1">
                                    <Camera size={16} className="mr-2" />
                                    Add Photos
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <FileText size={16} className="mr-2" />
                                    Add Notes
                                </Button>
                                {selectedProject.status !== "completed" && (
                                    <Button
                                        className="flex-1"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    >
                                        <CheckCircle size={16} className="mr-2" />
                                        Mark Complete
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
