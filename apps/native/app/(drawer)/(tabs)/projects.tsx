import { useState } from "react";
import { ScrollView, View, Pressable, Image } from "react-native";
import { Clock, CheckCircle2, Wrench, Calendar, MapPin } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type ProjectStatus = "pending" | "in-progress" | "completed";

interface Project {
    id: string;
    name: string;
    category: string;
    status: ProjectStatus;
    progress: number;
    startDate: string;
    location: string;
    image: string;
}

const userProjects: Project[] = [
    {
        id: "1",
        name: "10 KVA Solar Installation",
        category: "Solar",
        status: "in-progress",
        progress: 65,
        startDate: "Dec 15, 2024",
        location: "Borrowdale, Harare",
        image: "https://trojan-bucket-434.s3.eu-north-1.amazonaws.com/images/solar.jpeg",
    },
    {
        id: "2",
        name: "CCTV 8-Camera System",
        category: "CCTV",
        status: "completed",
        progress: 100,
        startDate: "Nov 20, 2024",
        location: "Avondale, Harare",
        image: "https://trojan-bucket-434.s3.eu-north-1.amazonaws.com/images/cctv.jpeg",
    },
];

const statusFilters: { label: string; value: ProjectStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
];

const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
        case "completed":
            return { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7", label: "Completed" };
        case "in-progress":
            return { icon: Wrench, color: "#2563EB", bg: "#DBEAFE", label: "In Progress" };
        case "pending":
            return { icon: Clock, color: "#CA8A04", bg: "#FEF9C3", label: "Pending" };
    }
};

export default function Projects() {
    const [selectedFilter, setSelectedFilter] = useState<ProjectStatus | "all">("all");

    const filteredProjects = userProjects.filter((project) => {
        if (selectedFilter === "all") return true;
        return project.status === selectedFilter;
    });

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
            {/* Header */}
            <View className="p-4">
                <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                    My Projects
                </Text>
                <Text className="text-gray-500 mt-1">
                    Track your installations and progress
                </Text>
            </View>

            {/* Filter Pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4 mb-4"
            >
                {statusFilters.map((filter) => (
                    <Pressable
                        key={filter.value}
                        onPress={() => setSelectedFilter(filter.value)}
                        className={`mr-2 px-4 py-2 rounded-full border ${selectedFilter === filter.value
                                ? "border-transparent"
                                : "border-gray-200 bg-white"
                            }`}
                        style={
                            selectedFilter === filter.value
                                ? { backgroundColor: TROJAN_NAVY }
                                : {}
                        }
                    >
                        <Text
                            className={`text-sm font-medium ${selectedFilter === filter.value ? "text-white" : "text-gray-600"
                                }`}
                        >
                            {filter.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Projects List */}
            <View className="px-4 pb-8">
                {filteredProjects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <Card key={project.id} className="bg-white mb-4">
                            <CardContent className="p-0">
                                {/* Image */}
                                <Image
                                    source={{ uri: project.image }}
                                    className="w-full h-40 rounded-t-lg"
                                    resizeMode="cover"
                                />

                                {/* Content */}
                                <View className="p-4">
                                    {/* Status Badge */}
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View
                                            className="flex-row items-center px-2 py-1 rounded-full"
                                            style={{ backgroundColor: statusConfig.bg }}
                                        >
                                            <StatusIcon size={14} color={statusConfig.color} />
                                            <Text
                                                className="text-xs font-medium ml-1"
                                                style={{ color: statusConfig.color }}
                                            >
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                        <View
                                            className="px-2 py-1 rounded-full"
                                            style={{ backgroundColor: `${TROJAN_GOLD}30` }}
                                        >
                                            <Text
                                                className="text-xs font-medium"
                                                style={{ color: TROJAN_NAVY }}
                                            >
                                                {project.category}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Title */}
                                    <Text className="text-lg font-semibold text-gray-900 mb-2">
                                        {project.name}
                                    </Text>

                                    {/* Meta */}
                                    <View className="flex-row items-center mb-1">
                                        <Calendar size={14} color="#9CA3AF" />
                                        <Text className="text-sm text-gray-500 ml-2">
                                            Started: {project.startDate}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center mb-3">
                                        <MapPin size={14} color="#9CA3AF" />
                                        <Text className="text-sm text-gray-500 ml-2">
                                            {project.location}
                                        </Text>
                                    </View>

                                    {/* Progress Bar */}
                                    <View className="mb-2">
                                        <View className="flex-row items-center justify-between mb-1">
                                            <Text className="text-sm font-medium text-gray-700">
                                                Progress
                                            </Text>
                                            <Text className="text-sm font-semibold" style={{ color: TROJAN_NAVY }}>
                                                {project.progress}%
                                            </Text>
                                        </View>
                                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <View
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${project.progress}%`,
                                                    backgroundColor: project.progress === 100 ? "#16A34A" : TROJAN_GOLD,
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {/* Action Button */}
                                    <Button
                                        className="w-full mt-2"
                                        variant="outline"
                                    >
                                        <Text className="font-medium" style={{ color: TROJAN_NAVY }}>
                                            View Details
                                        </Text>
                                    </Button>
                                </View>
                            </CardContent>
                        </Card>
                    );
                })}

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <View className="items-center justify-center py-16">
                        <Text className="text-5xl mb-3">📋</Text>
                        <Text className="text-lg font-medium text-gray-900">No projects found</Text>
                        <Text className="text-gray-500 mt-1 text-center">
                            {selectedFilter === "all"
                                ? "Request a quote to start a new project"
                                : "No projects with this status"}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
