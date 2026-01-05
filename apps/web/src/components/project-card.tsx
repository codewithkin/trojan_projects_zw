"use client";

import Image from "next/image";
import { Clock, CheckCircle2, XCircle, Truck, AlertCircle, Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type UserProject, type ProjectStatus } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ProjectCardProps {
    project: UserProject;
    onViewDetails?: () => void;
}

const statusConfig: Record<ProjectStatus, { icon: typeof Clock; label: string; color: string; bgColor: string }> = {
    pending: {
        icon: Clock,
        label: "Pending",
        color: "#CA8A04",
        bgColor: "#FEF9C3",
    },
    confirmed: {
        icon: AlertCircle,
        label: "Confirmed",
        color: "#2563EB",
        bgColor: "#DBEAFE",
    },
    "in-progress": {
        icon: Truck,
        label: "In Progress",
        color: "#7C3AED",
        bgColor: "#EDE9FE",
    },
    completed: {
        icon: CheckCircle2,
        label: "Completed",
        color: "#16A34A",
        bgColor: "#DCFCE7",
    },
    cancelled: {
        icon: XCircle,
        label: "Cancelled",
        color: "#DC2626",
        bgColor: "#FEE2E2",
    },
};

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
    const status = statusConfig[project.status];
    const StatusIcon = status.icon;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <Image
                        src={project.serviceImage}
                        alt={project.serviceName}
                        fill
                        className="object-cover"
                    />
                    {/* Status Badge on Image (Mobile) */}
                    <div 
                        className="sm:hidden absolute top-3 left-3 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                        style={{ backgroundColor: status.bgColor }}
                    >
                        <StatusIcon size={14} style={{ color: status.color }} />
                        <span 
                            className="text-xs font-semibold"
                            style={{ color: status.color }}
                        >
                            {status.label}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 
                                className="font-semibold text-lg mb-1"
                                style={{ color: TROJAN_NAVY }}
                            >
                                {project.serviceName}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Order #{project.id}
                            </p>
                        </div>
                        {/* Status Badge (Desktop) */}
                        <div 
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: status.bgColor }}
                        >
                            <StatusIcon size={14} style={{ color: status.color }} />
                            <span 
                                className="text-sm font-semibold"
                                style={{ color: status.color }}
                            >
                                {status.label}
                            </span>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} className="text-gray-400" />
                            <span>Requested: {formatDate(project.requestDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{project.location}</span>
                        </div>
                        {project.estimatedArrival && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Truck size={16} className="text-gray-400" />
                                <span>ETA: {formatDate(project.estimatedArrival)}</span>
                            </div>
                        )}
                        {project.technician && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User size={16} className="text-gray-400" />
                                <span>Tech: {project.technician}</span>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    {project.notes && (
                        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mb-4">
                            📝 {project.notes}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p 
                            className="text-lg font-bold"
                            style={{ color: TROJAN_NAVY }}
                        >
                            {project.price}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={onViewDetails}
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
