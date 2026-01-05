"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Clock, CheckCircle2, AlertCircle, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const mockProjects = [
    {
        id: 1,
        name: "10 KVA Solar Installation",
        location: "Greendale, Harare",
        status: "in-progress",
        progress: 65,
        startDate: "Jan 1, 2026",
        estimatedCompletion: "Jan 15, 2026",
        image: projects[0].images[0],
        stages: [
            { name: "Site Survey", completed: true },
            { name: "Equipment Delivery", completed: true },
            { name: "Installation", completed: false },
            { name: "Testing", completed: false },
        ],
    },
    {
        id: 2,
        name: "CCTV System - 4 Cameras",
        location: "Borrowdale, Harare",
        status: "completed",
        progress: 100,
        startDate: "Dec 15, 2025",
        estimatedCompletion: "Dec 20, 2025",
        image: projects[3].images[0],
        stages: [
            { name: "Site Survey", completed: true },
            { name: "Equipment Delivery", completed: true },
            { name: "Installation", completed: true },
            { name: "Testing", completed: true },
        ],
    },
];

const statusConfig = {
    "in-progress": { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "In Progress" },
    completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Completed" },
    pending: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" },
};

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                            My Projects
                        </h1>
                        <p className="text-gray-500 mt-1">Track your ongoing and completed installations</p>
                    </div>
                    <Link href="/services">
                        <Button
                            size="lg"
                            className="rounded-full"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                        >
                            Start New Project
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Projects</p>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>1</p>
                                </div>
                                <Package size={32} className="text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">1</p>
                                </div>
                                <CheckCircle2 size={32} className="text-green-200" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Investment</p>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>US$4,050</p>
                                </div>
                                <Calendar size={32} className="text-gray-300" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects List */}
                <div className="space-y-6">
                    {mockProjects.map((project) => {
                        const status = statusConfig[project.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;

                        return (
                            <Card key={project.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Image */}
                                        <div className="relative w-full lg:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={project.image}
                                                alt={project.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {project.name}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            {project.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {project.startDate}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg}`}>
                                                    <StatusIcon size={14} className={status.color} />
                                                    <span className={`text-xs font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                                    <span className="text-sm font-bold" style={{ color: TROJAN_NAVY }}>
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${project.progress}%`,
                                                            backgroundColor: TROJAN_GOLD,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stages */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                                {project.stages.map((stage, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                                            stage.completed ? "bg-green-50" : "bg-gray-50"
                                                        }`}
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                            className={stage.completed ? "text-green-600" : "text-gray-300"}
                                                        />
                                                        <span
                                                            className={`text-xs font-medium ${
                                                                stage.completed ? "text-green-700" : "text-gray-500"
                                                            }`}
                                                        >
                                                            {stage.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3">
                                                <Button size="sm" variant="outline" className="rounded-full">
                                                    View Details
                                                </Button>
                                                <p className="text-sm text-gray-500">
                                                    Est. completion: {project.estimatedCompletion}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {mockProjects.length === 0 && (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Package size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-6">Start your first installation project today</p>
                            <Link href="/services">
                                <Button
                                    size="lg"
                                    className="rounded-full"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    Browse Services
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
