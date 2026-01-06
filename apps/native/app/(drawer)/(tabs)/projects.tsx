import { useState, useMemo, useCallback, useEffect } from "react";
import { ScrollView, View, Pressable, SafeAreaView, StatusBar, Platform, useWindowDimensions, RefreshControl, ActivityIndicator, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { env } from "@trojan_projects_zw/env/native";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type ProjectStatus = "pending" | "starting" | "in_progress" | "waiting_for_review" | "completed" | "cancelled";
type TabId = ProjectStatus | "all";

interface Project {
    id: string;
    status: ProjectStatus;
    finalPrice: number | null;
    scheduledDate: string | null;
    startedAt: string | null;
    completedAt: string | null;
    technicianName: string | null;
    technicianPhone: string | null;
    userRating: number | null;
    userReview: string | null;
    service: {
        id: string;
        name: string;
        slug: string;
        category: string;
        images: string[];
    };
    location: string;
    notes: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

const tabs: { id: TabId; label: string; icon: string; color: string }[] = [
    { id: "all", label: "All", icon: "layers-outline", color: "#6B7280" },
    { id: "pending", label: "Pending", icon: "time-outline", color: "#CA8A04" },
    { id: "starting", label: "Starting", icon: "car-outline", color: "#2563EB" },
    { id: "in_progress", label: "In Progress", icon: "hammer-outline", color: "#7C3AED" },
    { id: "waiting_for_review", label: "Review", icon: "star-outline", color: "#F97316" },
    { id: "completed", label: "Completed", icon: "checkmark-done-outline", color: "#16A34A" },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string; icon: string }> = {
    pending: { label: "Pending", color: "#CA8A04", bg: "#FEF9C3", icon: "time-outline" },
    starting: { label: "Team on the way", color: "#2563EB", bg: "#DBEAFE", icon: "car-outline" },
    in_progress: { label: "In Progress", color: "#7C3AED", bg: "#EDE9FE", icon: "hammer-outline" },
    waiting_for_review: { label: "Waiting for Review", color: "#F97316", bg: "#FFEDD5", icon: "star-outline" },
    completed: { label: "Completed", color: "#16A34A", bg: "#DCFCE7", icon: "checkmark-done-outline" },
    cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEE2E2", icon: "close-circle-outline" },
};

export default function Projects() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isStaff = (session?.user as { role?: string } | undefined)?.role === "staff" || (session?.user as { role?: string } | undefined)?.role === "support";

    // Responsive breakpoints
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const contentPadding = isTablet ? 24 : 16;
    const gridColumns = isLargeTablet ? 2 : 1;

    const fetchProjects = useCallback(async () => {
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/projects`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.projects) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchProjects();
            setLoading(false);
        };
        loadData();
    }, [fetchProjects]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProjects();
        setRefreshing(false);
    };

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            if (activeTab === "all") return true;
            return project.status === activeTab;
        });
    }, [activeTab, projects]);

    const getTabCount = (tabId: TabId) => {
        if (tabId === "all") return projects.length;
        return projects.filter((p) => p.status === tabId).length;
    };

    const handleStatusUpdate = async (projectId: string, newStatus: ProjectStatus, extraData?: Record<string, unknown>) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/projects/${projectId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus, ...extraData }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", data.message || "Project updated successfully!");
                await fetchProjects();
            } else {
                Alert.alert("Error", data.error || "Failed to update project");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update project. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!selectedProject) return;

        setSubmitting(true);
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/projects/${selectedProject.id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ rating: reviewRating, review: reviewText }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Thank you!", "Your review has been submitted.");
                setShowReviewModal(false);
                setSelectedProject(null);
                setReviewRating(5);
                setReviewText("");
                await fetchProjects();
            } else {
                Alert.alert("Error", data.error || "Failed to submit review");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const renderProjectCard = (project: Project) => {
        const config = statusConfig[project.status];

        return (
            <Card key={project.id} className="bg-white mb-3">
                <CardContent className="p-4">
                    {/* Header with status */}
                    <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-900" numberOfLines={2}>
                                {project.service.name}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                {project.location}
                            </Text>
                            {isStaff && project.user && (
                                <Text className="text-xs text-gray-400 mt-1">
                                    Customer: {project.user.name}
                                </Text>
                            )}
                        </View>
                        <View
                            className="flex-row items-center px-2.5 py-1 rounded-full ml-2"
                            style={{ backgroundColor: config.bg }}
                        >
                            <Ionicons name={config.icon as any} size={12} color={config.color} />
                            <Text
                                className="text-xs font-medium ml-1"
                                style={{ color: config.color }}
                            >
                                {config.label}
                            </Text>
                        </View>
                    </View>

                    {/* Price & Date */}
                    <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
                        <View className="flex-row items-center">
                            <Ionicons name="cash-outline" size={16} color="#6B7280" />
                            <Text className="text-sm font-medium text-gray-700 ml-1">
                                {project.finalPrice ? `US$${project.finalPrice.toFixed(2)}` : "TBD"}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                            <Text className="text-xs text-gray-500 ml-1">
                                {formatDate(project.createdAt)}
                            </Text>
                        </View>
                    </View>

                    {/* Technician info if assigned */}
                    {project.technicianName && (
                        <View className="flex-row items-center py-2 border-t border-gray-100">
                            <Ionicons name="person-outline" size={14} color="#6B7280" />
                            <Text className="text-sm text-gray-600 ml-2">
                                {project.technicianName}
                                {project.technicianPhone && ` • ${project.technicianPhone}`}
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons based on status and role */}
                    {renderActionButton(project)}
                </CardContent>
            </Card>
        );
    };

    const renderActionButton = (project: Project) => {
        // Staff actions
        if (isStaff) {
            switch (project.status) {
                case "pending":
                    return (
                        <Button
                            className="w-full mt-2"
                            style={{ backgroundColor: TROJAN_GOLD }}
                            onPress={() => {
                                Alert.alert(
                                    "Accept Project",
                                    "Confirm that you will handle this project?",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                            text: "Accept",
                                            onPress: () => handleStatusUpdate(project.id, "starting")
                                        },
                                    ]
                                );
                            }}
                            disabled={submitting}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={16} color={TROJAN_NAVY} />
                                <Text className="font-semibold ml-2" style={{ color: TROJAN_NAVY }}>
                                    Accept Project
                                </Text>
                            </View>
                        </Button>
                    );
                case "starting":
                    return (
                        <Button
                            className="w-full mt-2"
                            style={{ backgroundColor: "#7C3AED" }}
                            onPress={() => handleStatusUpdate(project.id, "in_progress")}
                            disabled={submitting}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="hammer" size={16} color="white" />
                                <Text className="font-semibold ml-2 text-white">
                                    Start Work
                                </Text>
                            </View>
                        </Button>
                    );
                case "in_progress":
                    return (
                        <Button
                            className="w-full mt-2"
                            style={{ backgroundColor: "#F97316" }}
                            onPress={() => handleStatusUpdate(project.id, "waiting_for_review")}
                            disabled={submitting}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-done" size={16} color="white" />
                                <Text className="font-semibold ml-2 text-white">
                                    Mark as Complete
                                </Text>
                            </View>
                        </Button>
                    );
                case "waiting_for_review":
                    return (
                        <View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: "#FFEDD5" }}>
                            <Text className="text-sm text-orange-700 text-center">
                                Waiting for customer review
                            </Text>
                        </View>
                    );
                case "completed":
                    return project.userRating ? (
                        <View className="mt-2 p-3 rounded-lg flex-row items-center justify-center" style={{ backgroundColor: "#DCFCE7" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name={star <= project.userRating! ? "star" : "star-outline"}
                                    size={20}
                                    color="#FFC107"
                                />
                            ))}
                            <Text className="text-sm text-green-700 ml-2">
                                {project.userRating}/5
                            </Text>
                        </View>
                    ) : null;
                default:
                    return null;
            }
        }

        // User actions
        switch (project.status) {
            case "pending":
                return (
                    <Button
                        className="w-full mt-2"
                        disabled
                        style={{ backgroundColor: "#E5E7EB" }}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="time" size={16} color="#9CA3AF" />
                            <Text className="font-semibold ml-2" style={{ color: "#9CA3AF" }}>
                                Waiting for acceptance
                            </Text>
                        </View>
                    </Button>
                );
            case "starting":
                return (
                    <View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: "#DBEAFE" }}>
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="car" size={18} color="#2563EB" />
                            <Text className="text-sm text-blue-700 ml-2 font-medium">
                                Team is on the way!
                            </Text>
                        </View>
                    </View>
                );
            case "in_progress":
                return (
                    <View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: "#EDE9FE" }}>
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="hammer" size={18} color="#7C3AED" />
                            <Text className="text-sm text-purple-700 ml-2 font-medium">
                                Work in progress
                            </Text>
                        </View>
                    </View>
                );
            case "waiting_for_review":
                return (
                    <Button
                        className="w-full mt-2"
                        style={{ backgroundColor: TROJAN_GOLD }}
                        onPress={() => {
                            setSelectedProject(project);
                            setShowReviewModal(true);
                        }}
                        disabled={submitting}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={16} color={TROJAN_NAVY} />
                            <Text className="font-semibold ml-2" style={{ color: TROJAN_NAVY }}>
                                Leave a Review
                            </Text>
                        </View>
                    </Button>
                );
            case "completed":
                return project.userRating ? (
                    <View className="mt-2 p-3 rounded-lg flex-row items-center justify-center" style={{ backgroundColor: "#DCFCE7" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= project.userRating! ? "star" : "star-outline"}
                                size={20}
                                color="#FFC107"
                            />
                        ))}
                        <Text className="text-sm text-green-700 ml-2">
                            Your rating: {project.userRating}/5
                        </Text>
                    </View>
                ) : null;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
                <ActivityIndicator size="large" color={TROJAN_GOLD} />
            </View>
        );
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={TROJAN_GOLD} />
                }
            >
                {/* Header */}
                <View style={{
                    padding: contentPadding,
                    maxWidth: isLargeTablet ? 1200 : undefined,
                    alignSelf: "center",
                    width: "100%",
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={{ fontSize: isTablet ? 30 : 24, fontWeight: "700", color: TROJAN_NAVY }}>
                            {isStaff ? "All Projects" : "My Projects"}
                        </Text>
                        {!isStaff && (
                            <Pressable
                                onPress={() => router.push("/(drawer)/(tabs)/quotes")}
                                style={{
                                    backgroundColor: TROJAN_GOLD,
                                    paddingHorizontal: isTablet ? 20 : 16,
                                    paddingVertical: isTablet ? 12 : 10,
                                    borderRadius: 20,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <Ionicons name="add" size={isTablet ? 20 : 18} color={TROJAN_NAVY} />
                                <Text style={{ color: TROJAN_NAVY, fontWeight: "600", fontSize: isTablet ? 16 : 14 }}>
                                    New Quote
                                </Text>
                            </Pressable>
                        )}
                    </View>
                    <Text style={{ color: "#6B7280", fontSize: isTablet ? 16 : 14 }}>
                        {isStaff ? "Manage all customer projects" : "Track your service requests"}
                    </Text>
                </View>

                {/* Stats Cards */}
                {isTablet ? (
                    <View style={{
                        flexDirection: "row",
                        paddingHorizontal: contentPadding,
                        marginBottom: 16,
                        gap: 12,
                        maxWidth: isLargeTablet ? 1200 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}>
                        {tabs.slice(1).map((tab) => {
                            const count = getTabCount(tab.id);
                            const isActive = activeTab === tab.id;
                            return (
                                <Pressable
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: "white",
                                        borderRadius: 16,
                                        padding: 16,
                                        borderWidth: 2,
                                        borderColor: isActive ? tab.color : "transparent",
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: isActive ? 0.1 : 0.03,
                                        shadowRadius: 4,
                                        elevation: isActive ? 4 : 2,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                                        <View
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 22,
                                                backgroundColor: `${tab.color}20`,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Ionicons name={tab.icon as any} size={22} color={tab.color} />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 24, fontWeight: "700", color: TROJAN_NAVY }}>
                                                {count}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                                                {tab.label}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ paddingLeft: contentPadding, marginBottom: 16 }}
                        contentContainerStyle={{ paddingRight: contentPadding }}
                    >
                        {tabs.slice(1).map((tab) => {
                            const count = getTabCount(tab.id);
                            const isActive = activeTab === tab.id;
                            return (
                                <Pressable
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: 16,
                                        padding: 14,
                                        marginRight: 10,
                                        minWidth: 110,
                                        borderWidth: 2,
                                        borderColor: isActive ? tab.color : "transparent",
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: isActive ? 0.1 : 0.03,
                                        shadowRadius: 4,
                                        elevation: isActive ? 4 : 2,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        <View
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                backgroundColor: `${tab.color}20`,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Ionicons name={tab.icon as any} size={18} color={tab.color} />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 20, fontWeight: "700", color: TROJAN_NAVY }}>
                                                {count}
                                            </Text>
                                            <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                                                {tab.label}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                )}

                {/* Tab Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ paddingLeft: contentPadding, marginBottom: 16 }}
                    contentContainerStyle={{ paddingRight: contentPadding }}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = getTabCount(tab.id);
                        return (
                            <Pressable
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: isTablet ? 18 : 14,
                                    paddingVertical: isTablet ? 12 : 10,
                                    borderRadius: 20,
                                    marginRight: isTablet ? 12 : 8,
                                    backgroundColor: isActive ? TROJAN_NAVY : "white",
                                    gap: 6,
                                }}
                            >
                                <Ionicons
                                    name={tab.icon as any}
                                    size={16}
                                    color={isActive ? "white" : "#6B7280"}
                                />
                                <Text
                                    style={{
                                        color: isActive ? "white" : "#6B7280",
                                        fontWeight: "600",
                                        fontSize: 13,
                                    }}
                                >
                                    {tab.label}
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#F3F4F6",
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            fontWeight: "600",
                                            color: isActive ? "white" : "#6B7280",
                                        }}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Projects List */}
                <View style={{
                    paddingHorizontal: contentPadding,
                    paddingBottom: 32,
                    maxWidth: isLargeTablet ? 1200 : undefined,
                    alignSelf: "center",
                    width: "100%",
                }}>
                    {filteredProjects.length > 0 ? (
                        <View style={{
                            flexDirection: isTablet ? "row" : "column",
                            flexWrap: "wrap",
                            gap: isTablet ? 16 : 12,
                        }}>
                            {filteredProjects.map((project) => (
                                <View key={project.id} style={{
                                    width: isTablet ? `${100 / gridColumns - 2}%` : "100%",
                                }}>
                                    {renderProjectCard(project)}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View
                            style={{
                                alignItems: "center",
                                paddingVertical: isTablet ? 64 : 48,
                                backgroundColor: "white",
                                borderRadius: 20,
                            }}
                        >
                            <View
                                style={{
                                    width: isTablet ? 80 : 64,
                                    height: isTablet ? 80 : 64,
                                    borderRadius: isTablet ? 40 : 32,
                                    backgroundColor: `${TROJAN_GOLD}20`,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 16,
                                }}
                            >
                                <Ionicons name="layers-outline" size={isTablet ? 40 : 32} color={TROJAN_GOLD} />
                            </View>
                            <Text style={{ fontSize: isTablet ? 22 : 18, fontWeight: "600", color: TROJAN_NAVY, marginBottom: 4 }}>
                                No projects found
                            </Text>
                            <Text style={{ fontSize: isTablet ? 16 : 14, color: "#9CA3AF", textAlign: "center", paddingHorizontal: 32 }}>
                                {activeTab === "all"
                                    ? "You haven't started any projects yet. Request a quote to get started!"
                                    : `You don't have any ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} projects.`
                                }
                            </Text>
                            {activeTab === "all" && !isStaff && (
                                <Pressable
                                    onPress={() => router.push("/(drawer)/(tabs)/quotes")}
                                    style={{
                                        marginTop: 20,
                                        backgroundColor: TROJAN_GOLD,
                                        paddingHorizontal: 24,
                                        paddingVertical: 12,
                                        borderRadius: 24,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <Text style={{ color: TROJAN_NAVY, fontWeight: "700", fontSize: 15 }}>
                                        Request a Quote
                                    </Text>
                                    <Ionicons name="arrow-forward" size={18} color={TROJAN_NAVY} />
                                </Pressable>
                            )}
                            {activeTab !== "all" && (
                                <Pressable
                                    onPress={() => setActiveTab("all")}
                                    style={{
                                        marginTop: 20,
                                        borderWidth: 1,
                                        borderColor: "#E5E7EB",
                                        paddingHorizontal: 24,
                                        paddingVertical: 12,
                                        borderRadius: 24,
                                    }}
                                >
                                    <Text style={{ color: TROJAN_NAVY, fontWeight: "600", fontSize: 14 }}>
                                        View All Projects
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Review Modal */}
            <Modal
                visible={showReviewModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowReviewModal(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50"
                    onPress={() => setShowReviewModal(false)}
                />
                <View className="bg-white rounded-t-3xl p-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Rate Your Experience
                        </Text>
                        <Pressable onPress={() => setShowReviewModal(false)}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </Pressable>
                    </View>

                    {selectedProject && (
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">{selectedProject.service.name}</Text>
                            <Text className="text-sm text-gray-400">{selectedProject.location}</Text>
                        </View>
                    )}

                    {/* Star Rating */}
                    <View className="flex-row justify-center mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable
                                key={star}
                                onPress={() => setReviewRating(star)}
                                className="p-2"
                            >
                                <Ionicons
                                    name={star <= reviewRating ? "star" : "star-outline"}
                                    size={40}
                                    color={TROJAN_GOLD}
                                />
                            </Pressable>
                        ))}
                    </View>

                    {/* Review Text */}
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-gray-900 mb-6"
                        placeholder="Tell us about your experience (optional)"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={reviewText}
                        onChangeText={setReviewText}
                        style={{ minHeight: 100 }}
                    />

                    <Button
                        className="w-full"
                        style={{ backgroundColor: TROJAN_GOLD }}
                        onPress={handleSubmitReview}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color={TROJAN_NAVY} />
                        ) : (
                            <Text className="font-semibold text-base" style={{ color: TROJAN_NAVY }}>
                                Submit Review
                            </Text>
                        )}
                    </Button>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
