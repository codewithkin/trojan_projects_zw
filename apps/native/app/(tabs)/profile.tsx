import { useState, useMemo } from "react";
import { ScrollView, View, Pressable, Switch, StatusBar, Platform, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { userProjects } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface SettingItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
}

const SettingItem = ({ icon, title, subtitle, onPress, rightElement, danger }: SettingItemProps) => (
    <Pressable
        onPress={onPress}
        style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
        }}
    >
        <View
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
                backgroundColor: danger ? "#FEE2E2" : "#F3F4F6",
            }}
        >
            <Ionicons name={icon as any} size={20} color={danger ? "#DC2626" : "#6B7280"} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600", color: danger ? "#DC2626" : TROJAN_NAVY, fontSize: 15 }}>
                {title}
            </Text>
            {subtitle && (
                <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{subtitle}</Text>
            )}
        </View>
        {rightElement !== undefined ? rightElement : (
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
    </Pressable>
);

export default function Profile() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [projectNotifications, setProjectNotifications] = useState(true);
    const [technicianNotifications, setTechnicianNotifications] = useState(true);
    const [promotionalEmails, setPromotionalEmails] = useState(false);
    const [smsNotifications, setSmsNotifications] = useState(true);

    // Responsive breakpoints
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const contentPadding = isTablet ? 24 : 16;

    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.replace("/login");
    };

    // Calculate user stats from projects
    const { completedProjects, activeProjects, totalSpent } = useMemo(() => ({
        completedProjects: userProjects.filter(p => p.status === "completed").length,
        activeProjects: userProjects.filter(p => ["pending", "confirmed", "in-progress"].includes(p.status)).length,
        totalSpent: userProjects
            .filter(p => p.status === "completed")
            .reduce((sum, p) => sum + p.price, 0),
    }), []);

    if (isPending) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F9FAFB" }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 3, borderColor: TROJAN_GOLD, borderTopColor: "transparent", transform: [{ rotate: "0deg" }] }} />
            </View>
        );
    }

    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "user@example.com";
    const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Header Banner with Avatar */}
                <View style={{ backgroundColor: TROJAN_NAVY, paddingBottom: 60 }}>
                    <View style={{
                        paddingHorizontal: contentPadding,
                        paddingTop: contentPadding,
                        paddingBottom: 20,
                        maxWidth: isLargeTablet ? 1200 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <Text style={{ color: "white", fontSize: isTablet ? 30 : 24, fontWeight: "700" }}>
                                My Profile
                            </Text>
                            <Pressable
                                onPress={handleSignOut}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 6,
                                    paddingHorizontal: isTablet ? 18 : 14,
                                    paddingVertical: isTablet ? 10 : 8,
                                    borderRadius: 20,
                                    backgroundColor: "rgba(220,38,38,0.2)",
                                    borderWidth: 1,
                                    borderColor: "rgba(220,38,38,0.3)",
                                }}
                            >
                                <Ionicons name="log-out-outline" size={isTablet ? 18 : 16} color="#FCA5A5" />
                                <Text style={{ color: "#FCA5A5", fontWeight: "600", fontSize: isTablet ? 15 : 13 }}>
                                    Sign Out
                                </Text>
                            </Pressable>
                        </View>

                        <View style={{ alignItems: "center" }}>
                            <View style={{ position: "relative" }}>
                                <View
                                    style={{
                                        width: isTablet ? 120 : 96,
                                        height: isTablet ? 120 : 96,
                                        borderRadius: isTablet ? 60 : 48,
                                        backgroundColor: TROJAN_GOLD,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderWidth: 4,
                                        borderColor: "rgba(255,255,255,0.2)",
                                    }}
                                >
                                    <Text style={{ fontSize: isTablet ? 40 : 32, fontWeight: "700", color: TROJAN_NAVY }}>
                                        {userInitials}
                                    </Text>
                                </View>
                                <Pressable
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: isTablet ? 40 : 32,
                                        height: isTablet ? 40 : 32,
                                        borderRadius: isTablet ? 20 : 16,
                                        backgroundColor: "white",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                >
                                    <Ionicons name="camera" size={isTablet ? 20 : 16} color={TROJAN_NAVY} />
                                </Pressable>
                            </View>
                            <Text style={{ color: "white", fontSize: isTablet ? 24 : 20, fontWeight: "700", marginTop: 12 }}>
                                {userName}
                            </Text>
                            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 16 : 14, marginTop: 2 }}>
                                {userEmail}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content Container for tablet layout */}
                <View style={{
                    maxWidth: isLargeTablet ? 1200 : undefined,
                    alignSelf: "center",
                    width: "100%",
                    flexDirection: isLargeTablet ? "row" : "column",
                    flexWrap: isLargeTablet ? "wrap" : "nowrap",
                    paddingHorizontal: isLargeTablet ? contentPadding : 0,
                }}>
                    {/* Stats Card */}
                    <View style={{
                        paddingHorizontal: isLargeTablet ? 0 : contentPadding,
                        marginTop: -40,
                        marginBottom: 20,
                        width: isLargeTablet ? "100%" : undefined,
                    }}>
                        <View
                            style={{
                                backgroundColor: "white",
                                borderRadius: isTablet ? 24 : 20,
                                padding: isTablet ? 28 : 20,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View style={{
                                flexDirection: "row",
                                justifyContent: isTablet ? "space-evenly" : "space-around"
                            }}>
                                <View style={{ alignItems: "center" }}>
                                    <View
                                        style={{
                                            width: isTablet ? 56 : 44,
                                            height: isTablet ? 56 : 44,
                                            borderRadius: isTablet ? 28 : 22,
                                            backgroundColor: `${TROJAN_GOLD}20`,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: 6,
                                        }}
                                    >
                                        <Ionicons name="layers" size={isTablet ? 26 : 22} color={TROJAN_GOLD} />
                                    </View>
                                    <Text style={{ fontSize: isTablet ? 24 : 20, fontWeight: "700", color: TROJAN_NAVY }}>
                                        {userProjects.length}
                                    </Text>
                                    <Text style={{ fontSize: isTablet ? 14 : 12, color: "#9CA3AF" }}>Total</Text>
                                </View>
                                {!isTablet && <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />}
                                <View style={{ alignItems: "center" }}>
                                    <View
                                        style={{
                                            width: isTablet ? 56 : 44,
                                            height: isTablet ? 56 : 44,
                                            borderRadius: isTablet ? 28 : 22,
                                            backgroundColor: "#DBEAFE",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: 6,
                                        }}
                                    >
                                        <Ionicons name="time-outline" size={isTablet ? 26 : 22} color="#2563EB" />
                                    </View>
                                    <Text style={{ fontSize: isTablet ? 24 : 20, fontWeight: "700", color: TROJAN_NAVY }}>
                                        {activeProjects}
                                    </Text>
                                    <Text style={{ fontSize: isTablet ? 14 : 12, color: "#9CA3AF" }}>Active</Text>
                                </View>
                                {!isTablet && <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />}
                                <View style={{ alignItems: "center" }}>
                                    <View
                                        style={{
                                            width: isTablet ? 56 : 44,
                                            height: isTablet ? 56 : 44,
                                            borderRadius: isTablet ? 28 : 22,
                                            backgroundColor: "#DCFCE7",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: 6,
                                        }}
                                    >
                                        <Ionicons name="checkmark-done" size={isTablet ? 26 : 22} color="#16A34A" />
                                    </View>
                                    <Text style={{ fontSize: isTablet ? 24 : 20, fontWeight: "700", color: TROJAN_NAVY }}>
                                        {completedProjects}
                                    </Text>
                                    <Text style={{ fontSize: isTablet ? 14 : 12, color: "#9CA3AF" }}>Done</Text>
                                </View>
                            </View>

                            {/* Total Spent */}
                            <View
                                style={{
                                    marginTop: isTablet ? 20 : 16,
                                    paddingTop: isTablet ? 20 : 16,
                                    borderTopWidth: 1,
                                    borderTopColor: "#F3F4F6",
                                }}
                            >
                                <Text style={{ fontSize: isTablet ? 14 : 12, color: "#9CA3AF", textAlign: "center", marginBottom: 4 }}>
                                    Total Invested
                                </Text>
                                <Text style={{ fontSize: isTablet ? 28 : 24, fontWeight: "700", color: TROJAN_NAVY, textAlign: "center" }}>
                                    US${totalSpent.toLocaleString()}
                                </Text>
                            </View>

                            {/* View Projects Button */}
                            <Pressable
                                onPress={() => router.push("/projects")}
                                style={{
                                    marginTop: isTablet ? 20 : 16,
                                    backgroundColor: TROJAN_GOLD,
                                    paddingVertical: isTablet ? 14 : 12,
                                    borderRadius: 24,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: TROJAN_NAVY, fontWeight: "700", fontSize: isTablet ? 17 : 15 }}>
                                    View My Projects
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Settings Sections Container - 2 columns on tablet */}
                    <View style={{
                        flexDirection: isLargeTablet ? "row" : "column",
                        flexWrap: isLargeTablet ? "wrap" : "nowrap",
                        paddingHorizontal: contentPadding,
                        gap: isLargeTablet ? 16 : 0,
                        maxWidth: isLargeTablet ? 1200 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}>

                        {/* Account Section */}
                        <View style={{
                            marginBottom: 20,
                            width: isLargeTablet ? `${(100 - 2) / 2}%` : "100%",
                        }}>
                            <Text style={{ fontSize: isTablet ? 13 : 12, fontWeight: "700", color: "#9CA3AF", marginBottom: 10, marginLeft: 4 }}>
                                ACCOUNT
                            </Text>
                            <Card style={{ backgroundColor: "white" }}>
                                <CardContent style={{ padding: isTablet ? 20 : 16 }}>
                                    <SettingItem
                                        icon="person-outline"
                                        title="Personal Information"
                                        subtitle="Name, phone, address"
                                        onPress={() => console.log("Personal info")}
                                    />
                                    <SettingItem
                                        icon="mail-outline"
                                        title="Email"
                                        subtitle={userEmail}
                                        onPress={() => console.log("Email settings")}
                                    />
                                    <SettingItem
                                        icon="location-outline"
                                        title="Default Location"
                                        subtitle="Harare, Zimbabwe"
                                        onPress={() => console.log("Location")}
                                        rightElement={<Ionicons name="chevron-forward" size={isTablet ? 22 : 20} color="#9CA3AF" />}
                                    />
                                </CardContent>
                            </Card>
                        </View>

                        {/* Notifications Section */}
                        <View style={{
                            marginBottom: 20,
                            width: isLargeTablet ? `${(100 - 2) / 2}%` : "100%",
                        }}>
                            <Text style={{ fontSize: isTablet ? 13 : 12, fontWeight: "700", color: "#9CA3AF", marginBottom: 10, marginLeft: 4 }}>
                                NOTIFICATIONS
                            </Text>
                            <Card style={{ backgroundColor: "white" }}>
                                <CardContent style={{ padding: isTablet ? 20 : 16 }}>
                                    <SettingItem
                                        icon="notifications-outline"
                                        title="Project Updates"
                                        subtitle="Get notified when your project status changes"
                                        rightElement={
                                            <Switch
                                                value={projectNotifications}
                                                onValueChange={setProjectNotifications}
                                                trackColor={{ false: "#D1D5DB", true: `${TROJAN_GOLD}60` }}
                                                thumbColor={projectNotifications ? TROJAN_GOLD : "#9CA3AF"}
                                            />
                                        }
                                    />
                                    <SettingItem
                                        icon="person-outline"
                                        title="Technician Assignments"
                                        subtitle="Know when a technician is assigned"
                                        rightElement={
                                            <Switch
                                                value={technicianNotifications}
                                                onValueChange={setTechnicianNotifications}
                                                trackColor={{ false: "#D1D5DB", true: `${TROJAN_GOLD}60` }}
                                                thumbColor={technicianNotifications ? TROJAN_GOLD : "#9CA3AF"}
                                            />
                                        }
                                    />
                                    <SettingItem
                                        icon="pricetag-outline"
                                        title="Promotional Emails"
                                        subtitle="Receive special offers and promotions"
                                        rightElement={
                                            <Switch
                                                value={promotionalEmails}
                                                onValueChange={setPromotionalEmails}
                                                trackColor={{ false: "#D1D5DB", true: `${TROJAN_GOLD}60` }}
                                                thumbColor={promotionalEmails ? TROJAN_GOLD : "#9CA3AF"}
                                            />
                                        }
                                    />
                                    <SettingItem
                                        icon="chatbubble-outline"
                                        title="SMS Notifications"
                                        subtitle="Receive text messages for important updates"
                                        rightElement={
                                            <Switch
                                                value={smsNotifications}
                                                onValueChange={setSmsNotifications}
                                                trackColor={{ false: "#D1D5DB", true: `${TROJAN_GOLD}60` }}
                                                thumbColor={smsNotifications ? TROJAN_GOLD : "#9CA3AF"}
                                            />
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </View>

                        {/* Security Section */}
                        <View style={{
                            marginBottom: 20,
                            width: isLargeTablet ? `${(100 - 2) / 2}%` : "100%",
                        }}>
                            <Text style={{ fontSize: isTablet ? 13 : 12, fontWeight: "700", color: "#9CA3AF", marginBottom: 10, marginLeft: 4 }}>
                                SECURITY
                            </Text>
                            <Card style={{ backgroundColor: "white" }}>
                                <CardContent style={{ padding: isTablet ? 20 : 16 }}>
                                    <SettingItem
                                        icon="shield-checkmark-outline"
                                        title="Privacy & Security"
                                        subtitle="Password, authentication"
                                        onPress={() => console.log("Privacy")}
                                    />
                                    <SettingItem
                                        icon="lock-closed-outline"
                                        title="Change Password"
                                        subtitle="Update your password"
                                        onPress={() => console.log("Change password")}
                                        rightElement={<Ionicons name="chevron-forward" size={isTablet ? 22 : 20} color="#9CA3AF" />}
                                    />
                                </CardContent>
                            </Card>
                        </View>

                        {/* Support Section */}
                        <View style={{
                            marginBottom: 20,
                            width: isLargeTablet ? `${(100 - 2) / 2}%` : "100%",
                        }}>
                            <Text style={{ fontSize: isTablet ? 13 : 12, fontWeight: "700", color: "#9CA3AF", marginBottom: 10, marginLeft: 4 }}>
                                SUPPORT
                            </Text>
                            <Card style={{ backgroundColor: "white" }}>
                                <CardContent style={{ padding: isTablet ? 20 : 16 }}>
                                    <SettingItem
                                        icon="help-circle-outline"
                                        title="Help & Support"
                                        subtitle="FAQs, contact us"
                                        onPress={() => console.log("Help")}
                                    />
                                    <SettingItem
                                        icon="information-circle-outline"
                                        title="About"
                                        subtitle="Version 1.0.0"
                                        onPress={() => console.log("About")}
                                        rightElement={<Ionicons name="chevron-forward" size={isTablet ? 22 : 20} color="#9CA3AF" />}
                                    />
                                </CardContent>
                            </Card>
                        </View>

                        {/* Danger Zone */}
                        <View style={{
                            marginBottom: 32,
                            width: "100%",
                        }}>
                            <Text style={{ fontSize: isTablet ? 13 : 12, fontWeight: "700", color: "#DC2626", marginBottom: 10, marginLeft: 4 }}>
                                DANGER ZONE
                            </Text>
                            <Card style={{ backgroundColor: "white", borderWidth: 1, borderColor: "#FEE2E2" }}>
                                <CardContent style={{ padding: isTablet ? 20 : 16 }}>
                                    <SettingItem
                                        icon="trash-outline"
                                        title="Delete Account"
                                        subtitle="Permanently delete your account and all data"
                                        danger
                                        onPress={() => console.log("Delete account")}
                                        rightElement={null}
                                    />
                                </CardContent>
                            </Card>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
