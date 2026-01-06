import { useState, useEffect, useRef } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@trojan_projects_zw/env/native";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ChatRoom {
    id: string;
    name: string;
    type: "project" | "support";
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    avatar?: string;
    status?: string;
}

type TabType = "projects" | "support";

// TODO: Replace with actual data from API
const mockChatRooms: ChatRoom[] = [];

export default function Chat() {
    const router = useRouter();
    const { isAuthenticated, requireAuth } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("projects");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRooms = mockChatRooms.filter((room) => {
        const matchesTab = activeTab === "support" ? room.type === "support" : room.type === "project";
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const formatTime = (time?: string) => {
        return time || "";
    };

    const handleRoomPress = async (room: ChatRoom) => {
        const authed = await requireAuth("Sign in to access chat");
        if (authed) {
            // Navigate to individual chat screen without tabs/header
            router.push(`/chat/${room.id}`);
        }
    };

    const renderChatRoom = ({ item }: { item: ChatRoom }) => (
        <Pressable
            onPress={() => handleRoomPress(item)}
            className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
            {/* Avatar */}
            <View
                className="w-14 h-14 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: item.type === "support" ? TROJAN_GOLD : `${TROJAN_NAVY}20` }}
            >
                <Ionicons
                    name={item.type === "support" ? "headset" : "briefcase"}
                    size={24}
                    color={item.type === "support" ? TROJAN_NAVY : TROJAN_NAVY}
                />
            </View>

            {/* Chat Info */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-gray-900 text-base" numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text className="text-xs text-gray-400">{formatTime(item.lastMessageTime)}</Text>
                </View>
                {item.status && (
                    <Text className="text-xs text-gray-500 mt-0.5">{item.status}</Text>
                )}
                <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-sm text-gray-500 flex-1 mr-2" numberOfLines={1}>
                        {item.lastMessage || "No messages yet"}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View
                            className="min-w-5 h-5 rounded-full items-center justify-center px-1.5"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <Text className="text-xs font-bold" style={{ color: TROJAN_NAVY }}>
                                {item.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            {/* Header */}
            <View className="px-4 pt-16 pb-4" style={{ backgroundColor: TROJAN_NAVY }}>
                <View className="mb-4">
                    <Text className="text-2xl font-bold text-white">Chats</Text>
                </View>

                {/* Search Bar */}
                <View className="bg-white/10 rounded-full px-4 flex-row items-center" style={{ height: 40 }}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
                    <TextInput
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        className="flex-1 ml-2 text-white"
                        style={{ fontSize: 14 }}
                    />
                </View>

                {/* Tabs */}
                <View className="flex-row mt-4">
                    <Pressable
                        onPress={() => setActiveTab("projects")}
                        className="flex-1 py-2 items-center"
                        style={{
                            borderBottomWidth: 2,
                            borderBottomColor: activeTab === "projects" ? TROJAN_GOLD : "transparent",
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{ color: activeTab === "projects" ? TROJAN_GOLD : "rgba(255,255,255,0.6)" }}
                        >
                            Projects
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab("support")}
                        className="flex-1 py-2 items-center"
                        style={{
                            borderBottomWidth: 2,
                            borderBottomColor: activeTab === "support" ? TROJAN_GOLD : "transparent",
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{ color: activeTab === "support" ? TROJAN_GOLD : "rgba(255,255,255,0.6)" }}
                        >
                            Support
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Chat List */}
            <FlatList
                data={filteredRooms}
                renderItem={renderChatRoom}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-20">
                        <Ionicons
                            name={activeTab === "projects" ? "chatbubbles-outline" : "headset-outline"}
                            size={64}
                            color="#D1D5DB"
                        />
                        <Text className="text-lg font-semibold text-gray-900 mt-4">
                            No {activeTab} chats yet
                        </Text>
                        <Text className="text-gray-500 mt-2 text-center px-8">
                            {activeTab === "projects"
                                ? "Project chats will appear here when you start working on projects with our team."
                                : "Need help? Contact our support team to start a conversation."}
                        </Text>
                    </View>
                }
            />

            {/* FAB for new support chat */}
            {activeTab === "support" && (
                <Pressable
                    onPress={() => handleRoomPress({ id: "support", name: "Trojan Support", type: "support", unreadCount: 0 })}
                    style={{
                        position: "absolute",
                        bottom: 24,
                        right: 24,
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: TROJAN_GOLD,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Ionicons name="create" size={24} color={TROJAN_NAVY} />
                </Pressable>
            )}
        </View>
    );
}

