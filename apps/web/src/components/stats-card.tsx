"use client";

import { LucideIcon, TrendingUp, Package, FileText, DollarSign } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
}

export function StatsCard({
    title,
    value,
    change,
    changeType = "neutral",
    icon: Icon,
    iconColor = TROJAN_NAVY,
    iconBgColor = "#E8F5E9",
}: StatsCardProps) {
    const changeColors = {
        positive: "text-green-600",
        negative: "text-red-600",
        neutral: "text-gray-600",
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        {value}
                    </h3>
                    {change && (
                        <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
                            {changeType === "positive" && "↑ "}
                            {changeType === "negative" && "↓ "}
                            {change}
                        </p>
                    )}
                </div>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: iconBgColor }}
                >
                    <Icon size={24} style={{ color: iconColor }} />
                </div>
            </div>
        </div>
    );
}

interface DashboardStatsProps {
    stats?: {
        projects: number;
        quotes: number;
        revenue: string;
        growth: string;
    };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const defaultStats = {
        projects: 0,
        quotes: 0,
        revenue: "US$0",
        growth: "0%",
    };

    const data = stats || defaultStats;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
                title="Active Projects"
                value={data.projects}
                change="2 pending"
                changeType="neutral"
                icon={Package}
                iconColor="#3B82F6"
                iconBgColor="#EFF6FF"
            />
            <StatsCard
                title="Open Quotes"
                value={data.quotes}
                change="3 this week"
                changeType="positive"
                icon={FileText}
                iconColor="#8B5CF6"
                iconBgColor="#F5F3FF"
            />
            <StatsCard
                title="Total Spent"
                value={data.revenue}
                change="+12% from last month"
                changeType="positive"
                icon={DollarSign}
                iconColor="#10B981"
                iconBgColor="#ECFDF5"
            />
            <StatsCard
                title="Savings"
                value={data.growth}
                change="vs market price"
                changeType="positive"
                icon={TrendingUp}
                iconColor={TROJAN_GOLD}
                iconBgColor="#FFFBEB"
            />
        </div>
    );
}
