import { useState } from "react";
import { ScrollView, View, SafeAreaView, StatusBar, Platform, useWindowDimensions, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { BarChart3, Users, FolderKanban, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { hasAdminAccess, hasFullAdminAccess, getEffectiveRole } from "@/config/admins";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const contentPadding = isTablet ? 24 : 16;

  const effectiveRole = getEffectiveRole(user);
  const isAdmin = hasFullAdminAccess(user);
  const canManage = hasAdminAccess(user);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Role-based stats
  const getStatsForRole = (): StatCard[] => {
    if (isAdmin) {
      return [
        { title: "Active Projects", value: 23, icon: FolderKanban, color: "#3B82F6", trend: "+12%" },
        { title: "Pending Quotes", value: 8, icon: FileText, color: "#F59E0B", trend: "+3" },
        { title: "Total Staff", value: 15, icon: Users, color: "#10B981" },
        { title: "Revenue (Month)", value: "$45.2K", icon: TrendingUp, color: "#8B5CF6", trend: "+18%" },
      ];
    } else if (effectiveRole === "staff") {
      return [
        { title: "Assigned Projects", value: 5, icon: FolderKanban, color: "#3B82F6" },
        { title: "In Progress", value: 3, icon: Clock, color: "#F59E0B" },
        { title: "Completed Today", value: 2, icon: CheckCircle, color: "#10B981" },
        { title: "Pending Tasks", value: 7, icon: AlertCircle, color: "#EF4444" },
      ];
    } else {
      // Support role
      return [
        { title: "Active Inquiries", value: 12, icon: FileText, color: "#3B82F6" },
        { title: "Quotes Sent", value: 18, icon: CheckCircle, color: "#10B981" },
        { title: "Pending Followups", value: 5, icon: Clock, color: "#F59E0B" },
        { title: "Customer Calls", value: 24, icon: Users, color: "#8B5CF6" },
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