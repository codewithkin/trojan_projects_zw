import { View } from "react-native";
import { LucideIcon, TrendingUp, Package, FileText, DollarSign } from "lucide-react-native";
import { Text } from "@/components/ui/text";

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
        positive: "#16A34A",
        negative: "#DC2626",
        neutral: "#6B7280",
    };

    return (
        <View
            className="bg-white rounded-xl border border-gray-100 p-4"
            style={{ elevation: 1 }}
        >
            <View className="flex-row items-start justify-between">
                <View className="flex-1">
                    <Text className="text-sm text-gray-500 mb-1">{title}</Text>
                    <Text className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
                        {value}
                    </Text>
                    {change && (
                        <Text
                            className="text-xs mt-1"
                            style={{ color: changeColors[changeType] }}
                        >
                            {changeType === "positive" && "↑ "}
                            {changeType === "negative" && "↓ "}
                            {change}
                        </Text>
                    )}
                </View>
                <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: iconBgColor }}
                >
                    <Icon size={20} color={iconColor} />
                </View>
            </View>
        </View>
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
        <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[48%]">
                <StatsCard
                    title="Active Projects"
                    value={data.projects}
                    change="2 pending"
                    changeType="neutral"
                    icon={Package}
                    iconColor="#3B82F6"
                    iconBgColor="#EFF6FF"
                />
            </View>
            <View className="flex-1 min-w-[48%]">
                <StatsCard
                    title="Open Quotes"
                    value={data.quotes}
                    change="3 this week"
                    changeType="positive"
                    icon={FileText}
                    iconColor="#8B5CF6"
                    iconBgColor="#F5F3FF"
                />
            </View>
            <View className="flex-1 min-w-[48%]">
                <StatsCard
                    title="Total Spent"
                    value={data.revenue}
                    change="+12%"
                    changeType="positive"
                    icon={DollarSign}
                    iconColor="#10B981"
                    iconBgColor="#ECFDF5"
                />
            </View>
            <View className="flex-1 min-w-[48%]">
                <StatsCard
                    title="Savings"
                    value={data.growth}
                    change="vs market"
                    changeType="positive"
                    icon={TrendingUp}
                    iconColor={TROJAN_GOLD}
                    iconBgColor="#FFFBEB"
                />
            </View>
        </View>
    );
}
