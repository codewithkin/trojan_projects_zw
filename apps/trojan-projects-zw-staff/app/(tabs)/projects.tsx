import { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Pressable, SafeAreaView, StatusBar, Platform, useWindowDimensions, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { FolderKanban, Clock, CheckCircle, XCircle, Car } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { hasFullAdminAccess, getEffectiveRole } from "@/config/admins";
import { env } from "@trojan_projects_zw/env/native";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type ProjectStatus = "pending" | "starting" | "in_progress" | "completed" | "cancelled";

interface Project {
    id: string;
    status: ProjectStatus;
    finalPrice: number | null;
    scheduledDate: string | null;
    service: {
        name: string;
        category: string;
    };
    location: string;
    user?: {
        name: string;
        email: string;
    };
    technicianName: string | null;
    createdAt: string;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: "Pending", color: "#CA8A04", bg: "#FEF9C3", icon: Clock },
    starting: { label: "On the way", color: "#2563EB", bg: "#DBEAFE", icon: Car },
    in_progress: { label: "In Progress", color: "#7C3AED", bg: "#EDE9FE", icon: FolderKanban },
    completed: { label: "Completed", color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
};

export default function Projects() {
    const router = useRouter();
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<ProjectStatus | "all">("all");

    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const contentPadding = isTablet ? 24 : 16;

    const effectiveRole = getEffectiveRole(user);
    const isAdmin = hasFullAdminAccess(user);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/projects`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.projects) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProjects();
        setRefreshing(false);
    };

    const filteredProjects = projects.filter((p) => filter === "all" || p.status === filter);

    const handleProjectPress = (projectId: string) => {
        // In a real app, navigate to project detail
        console.log("Open project:", projectId);
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <View style={{ padding: contentPadding, backgroundColor: "white" }}>
                <Text
                    style={{
                        fontSize: isTablet ? 28 : 22,
                        fontWeight: "700",
                        color: TROJAN_NAVY,
                    }}
                >
                    {isAdmin ? "All Projects" : effectiveRole === "staff" ? "My Projects" : "Customer Projects"}
                </Text>
                <Text
                    style={{
                        fontSize: isTablet ? 14 : 12,
                        color: "#6B7280",
                        marginTop: 4,
                    }}
                >
                    {isAdmin
                        ? "Manage all company projects"
                        : effectiveRole === "staff"
                        ? "Your assigned installations"
                        : "Track customer inquiries and quotes"}
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[TROJAN_GOLD]} />}
            >
                <View
                    style={{
                        padding: contentPadding,
                        maxWidth: isLargeTablet ? 1200 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}
                >
                    {/* Status Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 20, marginHorizontal: -8 }}
                    >
                        <Pressable
                            onPress={() => setFilter("all")}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                marginHorizontal: 4,
                                backgroundColor: filter === "all" ? TROJAN_NAVY : "white",
                                borderWidth: 1,
                                borderColor: filter === "all" ? TROJAN_NAVY : "#E5E7EB",
                            }}
                        >
                            <Text
                                style={{
                                    color: filter === "all" ? "white" : "#374151",
                                    fontWeight: "600",
                                    fontSize: 13,
                                }}
                            >
                                All ({projects.length})
                            </Text>
                        </Pressable>
                        {(["pending", "in_progress", "completed"] as ProjectStatus[]).map((status) => (
                            <Pressable
                                key={status}
                                onPress={() => setFilter(status)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    marginHorizontal: 4,
                                    backgroundColor: filter === status ? TROJAN_NAVY : "white",
                                    borderWidth: 1,
                                    borderColor: filter === status ? TROJAN_NAVY : "#E5E7EB",
                                }}
                            >
                                <Text
                                    style={{
                                        color: filter === status ? "white" : "#374151",
                                        fontWeight: "600",
                                        fontSize: 13,
                                    }}
                                >
                                    {statusConfig[status].label} ({projects.filter((p) => p.status === status).length})
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Projects List */}
                    {loading ? (
                        <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>Loading projects...</Text>
                    ) : filteredProjects.length === 0 ? (
                        <View
                            style={{
                                backgroundColor: "white",
                                borderRadius: 16,
                                padding: 40,
                                alignItems: "center",
                            }}
                        >
                            <FolderKanban size={48} color="#D1D5DB" />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginTop: 16,
                                }}
                            >
                                No projects found
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    marginTop: 8,
                                    textAlign: "center",
                                }}
                            >
                                {filter === "all"
                                    ? "No projects available"
                                    : `No ${statusConfig[filter as ProjectStatus]?.label.toLowerCase()} projects`}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
                            {filteredProjects.map((project) => {
                                const config = statusConfig[project.status];
                                const IconComponent = config.icon;
                                return (
                                    <Pressable
                                        key={project.id}
                                        onPress={() => handleProjectPress(project.id)}
                                        style={{
                                            backgroundColor: "white",
                                            borderRadius: isTablet ? 16 : 12,
                                            padding: isTablet ? 20 : 16,
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 8,
                                            elevation: 2,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: isTablet ? 18 : 16,
                                                        fontWeight: "700",
                                                        color: TROJAN_NAVY,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {project.service.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: isTablet ? 14 : 12,
                                                        color: "#6B7280",
                                                    }}
                                                >
                                                    {project.location}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: config.bg,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 12,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    height: 32,
                                                }}
                                            >
                                                <IconComponent size={14} color={config.color} strokeWidth={2.5} />
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: "600",
                                                        color: config.color,
                                                    }}
                                                >
                                                    {config.label}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Role-based content */}
                                        {isAdmin && project.user && (
                                            <View style={{ marginBottom: 8 }}>
                                                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                                                    Customer: <Text style={{ fontWeight: "600", color: TROJAN_NAVY }}>{project.user.name}</Text>
                                                </Text>
                                                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{project.user.email}</Text>
                                            </View>
                                        )}

                                        {effectiveRole === "staff" && project.technicianName && (
                                            <View style={{ marginBottom: 8 }}>
                                                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                                                    Assigned to: <Text style={{ fontWeight: "600", color: TROJAN_NAVY }}>{project.technicianName}</Text>
                                                </Text>
                                            </View>
                                        )}

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 8,
                                                paddingTop: 12,
                                                borderTopWidth: 1,
                                                borderTopColor: "#F3F4F6",
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </Text>
                                            {project.finalPrice && (
                                                <Text
                                                    style={{
                                                        fontSize: isTablet ? 18 : 16,
                                                        fontWeight: "700",
                                                        color: TROJAN_GOLD,
                                                    }}
                                                >
                                                    ${project.finalPrice}
                                                </Text>
                                            )}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}