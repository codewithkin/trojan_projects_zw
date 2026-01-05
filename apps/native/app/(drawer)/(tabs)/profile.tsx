import { useState } from "react";
import { ScrollView, View, Pressable, Image, Switch } from "react-native";
import { useRouter } from "expo-router";
import { User, Mail, Phone, MapPin, Bell, Shield, HelpCircle, LogOut, ChevronRight, Edit2, Camera } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface SettingItemProps {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
}

const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightElement, danger }: SettingItemProps) => (
    <Pressable
        onPress={onPress}
        className="flex-row items-center py-4 border-b border-gray-100"
    >
        <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: danger ? "#FEE2E2" : "#F3F4F6" }}
        >
            <Icon size={20} color={danger ? "#DC2626" : "#6B7280"} />
        </View>
        <View className="flex-1">
            <Text className={`font-medium ${danger ? "text-red-600" : "text-gray-900"}`}>
                {title}
            </Text>
            {subtitle && (
                <Text className="text-sm text-gray-500">{subtitle}</Text>
            )}
        </View>
        {rightElement || <ChevronRight size={20} color="#9CA3AF" />}
    </Pressable>
);

export default function Profile() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.replace("/login");
    };

    const userInitials = session?.user?.name
        ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
            {/* Header with Avatar */}
            <View className="items-center pt-6 pb-8 px-4" style={{ backgroundColor: TROJAN_NAVY }}>
                <View className="relative">
                    <View
                        className="w-24 h-24 rounded-full items-center justify-center border-4 border-white/20"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        {session?.user?.image ? (
                            <Image
                                source={{ uri: session.user.image }}
                                className="w-full h-full rounded-full"
                            />
                        ) : (
                            <Text className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                                {userInitials}
                            </Text>
                        )}
                    </View>
                    <Pressable
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <Camera size={14} color={TROJAN_NAVY} />
                    </Pressable>
                </View>
                <Text className="text-xl font-bold text-white mt-4">
                    {session?.user?.name || "User"}
                </Text>
                <Text className="text-gray-300 mt-1">
                    {session?.user?.email || "email@example.com"}
                </Text>
                <View className="flex-row items-center mt-3">
                    <View className="bg-white/20 rounded-full px-3 py-1">
                        <Text className="text-white text-sm">✨ Premium Member</Text>
                    </View>
                </View>
            </View>

            {/* Quick Stats */}
            <View className="px-4 -mt-4">
                <Card className="bg-white">
                    <CardContent className="p-4 flex-row justify-around">
                        <View className="items-center">
                            <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                2
                            </Text>
                            <Text className="text-sm text-gray-500">Projects</Text>
                        </View>
                        <View className="w-px bg-gray-200" />
                        <View className="items-center">
                            <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                3
                            </Text>
                            <Text className="text-sm text-gray-500">Quotes</Text>
                        </View>
                        <View className="w-px bg-gray-200" />
                        <View className="items-center">
                            <Text className="text-2xl font-bold" style={{ color: TROJAN_GOLD }}>
                                5★
                            </Text>
                            <Text className="text-sm text-gray-500">Rating</Text>
                        </View>
                    </CardContent>
                </Card>
            </View>

            {/* Account Section */}
            <View className="px-4 mt-6">
                <Text className="text-sm font-semibold text-gray-500 uppercase mb-2 ml-1">
                    Account
                </Text>
                <Card className="bg-white">
                    <CardContent className="px-4 py-0">
                        <SettingItem
                            icon={User}
                            title="Personal Information"
                            subtitle="Name, phone, address"
                            onPress={() => console.log("Personal info")}
                        />
                        <SettingItem
                            icon={Mail}
                            title="Email"
                            subtitle={session?.user?.email || "Not set"}
                            onPress={() => console.log("Email settings")}
                        />
                        <SettingItem
                            icon={MapPin}
                            title="Default Location"
                            subtitle="Harare, Zimbabwe"
                            onPress={() => console.log("Location")}
                        />
                    </CardContent>
                </Card>
            </View>

            {/* Preferences Section */}
            <View className="px-4 mt-6">
                <Text className="text-sm font-semibold text-gray-500 uppercase mb-2 ml-1">
                    Preferences
                </Text>
                <Card className="bg-white">
                    <CardContent className="px-4 py-0">
                        <SettingItem
                            icon={Bell}
                            title="Push Notifications"
                            subtitle="Project updates, quotes"
                            rightElement={
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: "#D1D5DB", true: TROJAN_GOLD }}
                                    thumbColor="#FFFFFF"
                                />
                            }
                        />
                        <SettingItem
                            icon={Shield}
                            title="Privacy & Security"
                            subtitle="Password, 2FA"
                            onPress={() => console.log("Privacy")}
                        />
                    </CardContent>
                </Card>
            </View>

            {/* Support Section */}
            <View className="px-4 mt-6">
                <Text className="text-sm font-semibold text-gray-500 uppercase mb-2 ml-1">
                    Support
                </Text>
                <Card className="bg-white">
                    <CardContent className="px-4 py-0">
                        <SettingItem
                            icon={HelpCircle}
                            title="Help & Support"
                            subtitle="FAQs, contact us"
                            onPress={() => console.log("Help")}
                        />
                    </CardContent>
                </Card>
            </View>

            {/* Sign Out */}
            <View className="px-4 mt-6 mb-8">
                <Card className="bg-white">
                    <CardContent className="px-4 py-0">
                        <SettingItem
                            icon={LogOut}
                            title="Sign Out"
                            danger
                            onPress={handleSignOut}
                            rightElement={null}
                        />
                    </CardContent>
                </Card>
            </View>

            {/* App Version */}
            <View className="items-center pb-8">
                <Text className="text-sm text-gray-400">
                    Trojan Projects v1.0.0
                </Text>
            </View>
        </ScrollView>
    );
}
