import { useState, useCallback, useEffect } from "react";
import { ScrollView, View, SafeAreaView, StatusBar, Platform, useWindowDimensions, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { BarChart3, Users, FolderKanban, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, ChevronRight, MapPin, Calendar } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { hasAdminAccess, hasFullAdminAccess, getEffectiveRole } from "@/config/admins";
import { get, patch } from "@/lib/api";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
}

interface PendingProject {
  id: string;
  status: string;
  service: {
    name: string;
    category: string;
    images?: string[];
  };
  location: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ProjectsResponse {
  projects: PendingProject[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  
  // Real stats from API
  const [statsData, setStatsData] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    inProgressProjects: 0,
    completedProjects: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
  });

  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const contentPadding = isTablet ? 24 : 16;

  const effectiveRole = getEffectiveRole(user);
  const isAdmin = hasFullAdminAccess(user);
  const canManage = hasAdminAccess(user);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch projects summary
      const projectsData = await get<ProjectsResponse>("/api/projects?limit=100");
      const projects = projectsData.projects || [];
      
      // Fetch quotes
      const quotesData = await get<{ quotes: Array<{ status: string }> }>("/api/quotes?limit=100");
      const quotes = quotesData.quotes || [];
      
      setStatsData({
        totalProjects: projects.length,
        pendingProjects: projects.filter(p => p.status === "pending").length,
        inProgressProjects: projects.filter(p => p.status === "in_progress" || p.status === "starting").length,
        completedProjects: projects.filter(p => p.status === "completed").length,
        totalQuotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === "pending").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchPendingProjects = useCallback(async () => {
    try {
      const data = await get<ProjectsResponse>("/api/projects?status=pending&limit=10");
      const pending = (data.projects || []).filter((p) => p.status === "pending");
      setPendingProjects(pending);
    } catch (error) {
      console.error("Error fetching pending projects:", error);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingProjects();
    fetchStats();
  }, [fetchPendingProjects, fetchStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPendingProjects(), fetchStats()]);
    setRefreshing(false);
  };

  const handleAcceptProject = async (projectId: string) => {
    try {
      setAcceptingId(projectId);
      await patch(`/api/projects/${projectId}`, { status: "starting" });
      // Remove from list after accepting
      setPendingProjects((prev) => prev.filter((p) => p.id !== projectId));
      // Navigate to the project chat or detail
      router.push(`/chat/${projectId}` as any);
    } catch (error) {
      console.error("Error accepting project:", error);
    } finally {
      setAcceptingId(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Role-based stats with real data
  const getStatsForRole = (): StatCard[] => {
    if (isAdmin) {
      return [
        { title: "Total Projects", value: statsData.totalProjects, icon: FolderKanban, color: "#3B82F6" },
        { title: "Pending Quotes", value: statsData.pendingQuotes, icon: FileText, color: "#F59E0B" },
        { title: "In Progress", value: statsData.inProgressProjects, icon: Clock, color: "#10B981" },
        { title: "Completed", value: statsData.completedProjects, icon: CheckCircle, color: "#8B5CF6" },
      ];
    } else if (effectiveRole === "staff") {
      return [
        { title: "Total Projects", value: statsData.totalProjects, icon: FolderKanban, color: "#3B82F6" },
        { title: "In Progress", value: statsData.inProgressProjects, icon: Clock, color: "#F59E0B" },
        { title: "Completed", value: statsData.completedProjects, icon: CheckCircle, color: "#10B981" },
        { title: "Pending", value: statsData.pendingProjects, icon: AlertCircle, color: "#EF4444" },
      ];
    } else {
      // Support role
      return [
        { title: "Total Quotes", value: statsData.totalQuotes, icon: FileText, color: "#3B82F6" },
        { title: "Pending Quotes", value: statsData.pendingQuotes, icon: Clock, color: "#F59E0B" },
        { title: "Projects Active", value: statsData.inProgressProjects, icon: FolderKanban, color: "#10B981" },
        { title: "Completed", value: statsData.completedProjects, icon: CheckCircle, color: "#8B5CF6" },
      ];
    }
  };

  const stats = getStatsForRole();

  // Quick actions based on role
  const getQuickActions = () => {
    if (isAdmin) {
      return [
        { title: "View Analytics", icon: BarChart3, route: "/analytics", color: "#3B82F6" },
        { title: "Manage Staff", icon: Users, route: "/staff", color: "#10B981" },
        { title: "All Projects", icon: FolderKanban, route: "/projects", color: "#F59E0B" },
        { title: "All Quotations", icon: FileText, route: "/quotes", color: "#8B5CF6" },
      ];
    } else if (effectiveRole === "staff") {
      return [
        { title: "My Projects", icon: FolderKanban, route: "/projects", color: "#3B82F6" },
        { title: "Update Status", icon: Clock, route: "/projects", color: "#F59E0B" },
        { title: "Upload Photos", icon: CheckCircle, route: "/projects", color: "#10B981" },
        { title: "AI Chat Help", icon: AlertCircle, route: "/chat", color: "#8B5CF6" },
      ];
    } else {
      return [
        { title: "Create Quote", icon: FileText, route: "/quotes", color: "#3B82F6" },
        { title: "View Inquiries", icon: Users, route: "/projects", color: "#10B981" },
        { title: "AI Assistant", icon: AlertCircle, route: "/chat", color: "#F59E0B" },
        { title: "My Quotations", icon: CheckCircle, route: "/quotes", color: "#8B5CF6" },
      ];
    }
  };

  const quickActions = getQuickActions();

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
          {/* Header */}
          <View style={{ marginBottom: isTablet ? 32 : 24 }}>
            <Text
              style={{
                fontSize: isTablet ? 32 : 24,
                fontWeight: "700",
                color: TROJAN_NAVY,
                marginBottom: 8,
              }}
            >
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </Text>
            <Text
              style={{
                fontSize: isTablet ? 16 : 14,
                color: "#6B7280",
              }}
            >
              {effectiveRole === "admin" && "You have full administrative access"}
              {effectiveRole === "staff" && "Field Technician Dashboard"}
              {effectiveRole === "support" && "Customer Support Dashboard"}
            </Text>
          </View>

          {/* Stats Grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginHorizontal: -8,
              marginBottom: isTablet ? 32 : 24,
            }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View
                  key={index}
                  style={{
                    width: isLargeTablet ? "25%" : isTablet ? "50%" : "50%",
                    padding: 8,
                  }}
                >
                  <View
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
                    <View
                      style={{
                        backgroundColor: `${stat.color}15`,
                        width: isTablet ? 48 : 40,
                        height: isTablet ? 48 : 40,
                        borderRadius: isTablet ? 12 : 10,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <IconComponent size={isTablet ? 24 : 20} color={stat.color} strokeWidth={2} />
                    </View>
                    <Text
                      style={{
                        fontSize: isTablet ? 28 : 24,
                        fontWeight: "700",
                        color: TROJAN_NAVY,
                        marginBottom: 4,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: isTablet ? 14 : 12,
                        color: "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      {stat.title}
                    </Text>
                    {stat.trend && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#10B981",
                          fontWeight: "600",
                          marginTop: 4,
                        }}
                      >
                        {stat.trend}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Quick Actions */}
          <View style={{ marginBottom: isTablet ? 32 : 24 }}>
            <Text
              style={{
                fontSize: isTablet ? 20 : 18,
                fontWeight: "700",
                color: TROJAN_NAVY,
                marginBottom: isTablet ? 16 : 12,
              }}
            >
              Quick Actions
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginHorizontal: -8,
              }}
            >
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <View
                    key={index}
                    style={{
                      width: isLargeTablet ? "25%" : isTablet ? "50%" : "50%",
                      padding: 8,
                    }}
                  >
                    <Pressable
                      onPress={() => router.push(action.route as any)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: isTablet ? 16 : 12,
                        padding: isTablet ? 20 : 16,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: `${action.color}15`,
                          width: isTablet ? 56 : 48,
                          height: isTablet ? 56 : 48,
                          borderRadius: isTablet ? 14 : 12,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 12,
                        }}
                      >
                        <IconComponent size={isTablet ? 28 : 24} color={action.color} strokeWidth={2} />
                      </View>
                      <Text
                        style={{
                          fontSize: isTablet ? 14 : 13,
                          fontWeight: "600",
                          color: TROJAN_NAVY,
                          textAlign: "center",
                        }}
                      >
                        {action.title}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Pending Requests Section */}
          <View style={{ marginBottom: isTablet ? 32 : 24 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: isTablet ? 16 : 12,
              }}
            >
              <Text
                style={{
                  fontSize: isTablet ? 20 : 18,
                  fontWeight: "700",
                  color: TROJAN_NAVY,
                }}
              >
                Pending Requests
              </Text>
              {pendingProjects.length > 0 && (
                <Pressable onPress={() => router.push("/projects" as any)}>
                  <Text style={{ fontSize: 14, color: "#3B82F6", fontWeight: "600" }}>
                    View All
                  </Text>
                </Pressable>
              )}
            </View>

            {loadingPending ? (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: isTablet ? 16 : 12,
                  padding: 40,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color={TROJAN_GOLD} />
                <Text style={{ marginTop: 12, color: "#6B7280" }}>Loading requests...</Text>
              </View>
            ) : pendingProjects.length === 0 ? (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: isTablet ? 16 : 12,
                  padding: 40,
                  alignItems: "center",
                }}
              >
                <CheckCircle size={48} color="#10B981" strokeWidth={1.5} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: TROJAN_NAVY,
                    marginTop: 12,
                  }}
                >
                  All caught up!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  No pending project requests at the moment
                </Text>
              </View>
            ) : (
              pendingProjects.map((project, index) => (
                <Pressable
                  key={project.id}
                  onPress={() => router.push(`/service/${project.id}` as any)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: isTablet ? 16 : 12,
                    padding: isTablet ? 20 : 16,
                    marginBottom: index < pendingProjects.length - 1 ? 12 : 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#FEF9C3",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                            marginRight: 8,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: "600", color: "#CA8A04" }}>
                            NEW REQUEST
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: "#6B7280" }}>
                          {formatTimeAgo(project.createdAt)}
                        </Text>
                      </View>

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

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <MapPin size={14} color="#6B7280" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#6B7280",
                            marginLeft: 4,
                            flex: 1,
                          }}
                          numberOfLines={1}
                        >
                          {project.location}
                        </Text>
                      </View>

                      {project.user && (
                        <Text style={{ fontSize: 13, color: "#6B7280" }}>
                          By: {project.user.name}
                        </Text>
                      )}
                    </View>

                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>

                  <Pressable
                    onPress={() => handleAcceptProject(project.id)}
                    disabled={acceptingId === project.id}
                    style={{
                      backgroundColor: acceptingId === project.id ? "#94a3b8" : TROJAN_GOLD,
                      borderRadius: 8,
                      paddingVertical: 12,
                      marginTop: 16,
                      alignItems: "center",
                    }}
                  >
                    {acceptingId === project.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: TROJAN_NAVY,
                        }}
                      >
                        Accept Request
                      </Text>
                    )}
                  </Pressable>
                </Pressable>
              ))
            )}
          </View>

          {/* Role Badge */}
          <View
            style={{
              backgroundColor: TROJAN_GOLD,
              borderRadius: isTablet ? 16 : 12,
              padding: isTablet ? 20 : 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: isTablet ? 16 : 14,
                fontWeight: "700",
                color: TROJAN_NAVY,
              }}
            >
              Your Role: {effectiveRole.toUpperCase()}
            </Text>
            <Text
              style={{
                fontSize: isTablet ? 14 : 12,
                color: TROJAN_NAVY,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              {canManage ? "You have access to manage operations" : "Standard access level"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}