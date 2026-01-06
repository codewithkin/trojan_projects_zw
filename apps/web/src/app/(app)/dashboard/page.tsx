"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, AlertCircle, Sun, Camera, Zap } from "lucide-react";
import { DashboardStats } from "@/components/stats-card";
import { ProductCard } from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/use-services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const recentActivity = [
    {
        id: 1,
        title: "Quote Requested",
        description: "3.5 KVA Solar System for residential installation",
        time: "2 hours ago",
        status: "pending",
        icon: Clock,
    },
    {
        id: 2,
        title: "Installation Complete",
        description: "CCTV 4-camera system - Greendale",
        time: "Yesterday",
        status: "completed",
        icon: CheckCircle2,
    },
    {
        id: 3,
        title: "Quote Approved",
        description: "10 KVA Solar System for commercial property",
        time: "3 days ago",
        status: "approved",
        icon: CheckCircle2,
    },
];

const quickActions = [
    { name: "Solar", icon: Sun, color: "#FFC107", href: "/services?category=solar" },
    { name: "CCTV", icon: Camera, color: "#3B82F6", href: "/services?category=cctv" },
    { name: "Electrical", icon: Zap, color: "#8B5CF6", href: "/services?category=electrical" },
];

export default function DashboardPage() {
    const { data: services } = useServices();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Welcome back!
                        </h1>
                        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your projects</p>
                    </div>
                    <Link href="/quotes">
                        <Button
                            size="lg"
                            className="rounded-full"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                        >
                            Request Quote
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <DashboardStats />

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: TROJAN_NAVY }}>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {quickActions.map((action) => (
                            <Link key={action.name} href={action.href}>
                                <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-all cursor-pointer group">
                                    <div
                                        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                                        style={{ backgroundColor: `${action.color}20` }}
                                    >
                                        <action.icon size={28} style={{ color: action.color }} />
                                    </div>
                                    <p className="font-medium text-gray-900">{action.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Recent Activity</CardTitle>
                                <Link href="/projects" className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                                    View all
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === "completed" || activity.status === "approved"
                                                    ? "bg-green-100"
                                                    : "bg-yellow-100"
                                                    }`}
                                            >
                                                <activity.icon
                                                    size={20}
                                                    className={
                                                        activity.status === "completed" || activity.status === "approved"
                                                            ? "text-green-600"
                                                            : "text-yellow-600"
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{activity.title}</p>
                                                <p className="text-sm text-gray-500">{activity.description}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Popular Services */}
                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Popular Services</CardTitle>
                                <Link href="/services" className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                                    Browse all
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {services?.slice(0, 3).map((service) => (
                                        <Link key={service.id} href={`/services/${service.slug}`}>
                                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={service.images[0]}
                                                        alt={service.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">
                                                        {service.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{service.priceFormatted}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
