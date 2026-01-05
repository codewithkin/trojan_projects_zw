import { ScrollView, View, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, Clock, CheckCircle2, Sun, Camera, Zap } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/stats-card";
import { projects } from "@/data/projects";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const recentActivity = [
    {
        id: 1,
        title: "Quote Requested",
        description: "3.5 KVA Solar System",
        time: "2 hours ago",
        status: "pending",
    },
    {
        id: 2,
        title: "Installation Complete",
        description: "CCTV 4-camera system",
        time: "Yesterday",
        status: "completed",
    },
];

const quickActions = [
    { name: "Solar", icon: Sun, color: "#FFC107" },
    { name: "CCTV", icon: Camera, color: "#3B82F6" },
    { name: "Electrical", icon: Zap, color: "#8B5CF6" },
];

export default function Home() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
            <View className="p-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Welcome back! 👋
                        </Text>
                        <Text className="text-gray-500 mt-1">
                            Here's what's happening
                        </Text>
                    </View>
                    <Button
                        className="rounded-full"
                        style={{ backgroundColor: TROJAN_GOLD }}
                        onPress={() => router.push("/quotes")}
                    >
                        <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                            Get Quote
                        </Text>
                    </Button>
                </View>

                {/* Stats */}
                <DashboardStats
                    stats={{
                        projects: 1,
                        quotes: 2,
                        revenue: "US$4,050",
                        growth: "15%",
                    }}
                />

                {/* Quick Actions */}
                <View className="mt-6">
                    <Text className="text-lg font-semibold mb-4" style={{ color: TROJAN_NAVY }}>
                        Quick Actions
                    </Text>
                    <View className="flex-row gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Pressable
                                    key={action.name}
                                    onPress={() => router.push("/services")}
                                    className="flex-1 bg-white rounded-xl border border-gray-100 p-4 items-center"
                                    style={{ elevation: 1 }}
                                >
                                    <View
                                        className="w-12 h-12 rounded-full items-center justify-center mb-2"
                                        style={{ backgroundColor: `${action.color}20` }}
                                    >
                                        <Icon size={24} color={action.color} />
                                    </View>
                                    <Text className="font-medium text-gray-900">{action.name}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="mt-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold" style={{ color: TROJAN_NAVY }}>
                            Recent Activity
                        </Text>
                        <Pressable onPress={() => router.push("/projects")}>
                            <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                                View all
                            </Text>
                        </Pressable>
                    </View>
                    <Card className="bg-white">
                        <CardContent className="p-0">
                            {recentActivity.map((activity, index) => (
                                <View
                                    key={activity.id}
                                    className={`flex-row items-center gap-3 p-4 ${
                                        index < recentActivity.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                                >
                                    <View
                                        className={`w-10 h-10 rounded-full items-center justify-center ${
                                            activity.status === "completed" ? "bg-green-100" : "bg-yellow-100"
                                        }`}
                                    >
                                        {activity.status === "completed" ? (
                                            <CheckCircle2 size={20} color="#16A34A" />
                                        ) : (
                                            <Clock size={20} color="#CA8A04" />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-medium text-gray-900">{activity.title}</Text>
                                        <Text className="text-sm text-gray-500">{activity.description}</Text>
                                    </View>
                                    <Text className="text-xs text-gray-400">{activity.time}</Text>
                                </View>
                            ))}
                        </CardContent>
                    </Card>
                </View>

                {/* Popular Services */}
                <View className="mt-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold" style={{ color: TROJAN_NAVY }}>
                            Popular Services
                        </Text>
                        <Pressable onPress={() => router.push("/services")}>
                            <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                                Browse all
                            </Text>
                        </Pressable>
                    </View>
                    {projects.slice(0, 3).map((product) => (
                        <Pressable
                            key={product.id}
                            onPress={() => router.push("/services")}
                            className="flex-row items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 mb-3"
                            style={{ elevation: 1 }}
                        >
                            <Image
                                source={{ uri: product.images[0] }}
                                className="w-14 h-14 rounded-lg"
                                resizeMode="cover"
                            />
                            <View className="flex-1">
                                <Text className="font-medium text-gray-900" numberOfLines={1}>
                                    {product.name}
                                </Text>
                                <Text className="text-xs text-gray-500">{product.priceRange}</Text>
                            </View>
                            <ArrowRight size={18} color="#9CA3AF" />
                        </Pressable>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

