import { useState, useMemo } from "react";
import { ScrollView, View, Pressable, SafeAreaView, StatusBar, Platform, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { ProjectCard } from "@/components/project-card";
import { userProjects, statusConfig, type ProjectStatus } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type TabId = ProjectStatus | "all";

const tabs: { id: TabId; label: string; icon: string; color: string }[] = [
    { id: "all", label: "All", icon: "layers-outline", color: "#6B7280" },
    { id: "pending", label: "Pending", icon: "time-outline", color: "#CA8A04" },
    { id: "confirmed", label: "Confirmed", icon: "checkmark-circle-outline", color: "#2563EB" },
    { id: "in-progress", label: "In Progress", icon: "car-outline", color: "#7C3AED" },
    { id: "completed", label: "Completed", icon: "checkmark-done-outline", color: "#16A34A" },
    { id: "cancelled", label: "Cancelled", icon: "close-circle-outline", color: "#DC2626" },
];

export default function Projects() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState<TabId>("all");

    // Responsive breakpoints
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const contentPadding = isTablet ? 24 : 16;
    const gridColumns = isLargeTablet ? 2 : 1;

    const filteredProjects = useMemo(() => {
        return userProjects.filter((project) => {
            if (activeTab === "all") return true;
            return project.status === activeTab;
        });
    }, [activeTab]);

    const getTabCount = (tabId: TabId) => {
        if (tabId === "all") return userProjects.length;
        return userProjects.filter((p) => p.status === tabId).length;
    };

    const totalInvestment = useMemo(() => {
        return userProjects
            .filter(p => p.status !== "cancelled")
            .reduce((sum, p) => sum + p.price, 0);
    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={{ 
                    padding: contentPadding,
                    maxWidth: isLargeTablet ? 1200 : undefined,
                    alignSelf: "center",
                    width: "100%",
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={{ fontSize: isTablet ? 30 : 24, fontWeight: "700", color: TROJAN_NAVY }}>
                            My Projects
                        </Text>
                        <Pressable
                            onPress={() => router.push("/")}
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
                                New
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={{ color: "#6B7280", fontSize: isTablet ? 16 : 14 }}>
                        Track and manage your service requests
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

                {/* Total Investment Banner */}
                <View
                    style={{
                        marginHorizontal: contentPadding,
                        marginBottom: 16,
                        backgroundColor: TROJAN_NAVY,
                        borderRadius: isTablet ? 20 : 16,
                        padding: isTablet ? 24 : 16,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: isLargeTablet ? 1200 - contentPadding * 2 : undefined,
                        alignSelf: "center",
                        width: isLargeTablet ? "100%" : undefined,
                    }}
                >
                    <View>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 14 : 12, marginBottom: 2 }}>
                            Total Investment
                        </Text>
                        <Text style={{ color: "white", fontSize: isTablet ? 32 : 24, fontWeight: "700" }}>
                            US${totalInvestment.toLocaleString()}
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 14 : 12, marginBottom: 2 }}>
                            Total Projects
                        </Text>
                        <Text style={{ color: TROJAN_GOLD, fontSize: isTablet ? 32 : 24, fontWeight: "700" }}>
                            {userProjects.length}
                        </Text>
                    </View>
                </View>

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
                                    <ProjectCard
                                        project={project}
                                        onPress={() => console.log("View project:", project.id)}
                                    />
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
                                    ? "You haven't requested any services yet. Browse our services to get started!"
                                    : `You don't have any ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} projects.`
                                }
                            </Text>
                            {activeTab === "all" && (
                                <Pressable
                                    onPress={() => router.push("/")}
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
                                        Browse Services
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
        </SafeAreaView>
    );
}
