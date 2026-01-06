import { useState, useEffect, useRef } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@trojan_projects_zw/env/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ChatMessage {
    type: "message" | "join" | "leave" | "typing";
    roomId: string;
    userId: string;
    userName: string;
    userRole: string;
    content?: string;
    timestamp: string;
    id?: string;
}

export default function ChatRoom() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { session } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [connected, setConnected] = useState(false);
    const [roomName, setRoomName] = useState("Chat");
    const ws = useRef<WebSocket | null>(null);
    const flatListRef = useRef<FlatList>(null);

    // Determine room type and name from ID
    const isSupport = id === "support";
    const roomId = isSupport ? "support" : `project-${id}`;

    useEffect(() => {
        if (!session?.user || !id) return;

        // Set room name based on type
        if (isSupport) {
            setRoomName("Trojan Support");
        } else {
            // TODO: Fetch actual project name from API
            setRoomName(`Project Chat`);
        }

        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [session, id]);

    const connectWebSocket = () => {
        if (!session?.user) return;

        // Close existing connection
        if (ws.current) {
            ws.current.close();
        }

        // Convert HTTP URL to WebSocket URL
        const apiUrl = env.EXPO_PUBLIC_API_URL.replace(/^https?:/, "ws:");
        const wsUrl = `${apiUrl}/ws?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(session.user.id)}&userName=${encodeURIComponent(session.user.name || "User")}&userRole=${encodeURIComponent((session.user as { role?: string }).role || "customer")}`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket connected to room:", roomId);
            setConnected(true);
        };

        ws.current.onmessage = (event) => {
            try {
                const message: ChatMessage = JSON.parse(event.data);
                setMessages((prev) => [...prev, { ...message, id: message.timestamp + Math.random() }]);
                // Scroll to bottom on new message
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnected(false);
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
            setConnected(false);
        };
    };

    const sendMessage = () => {
        if (!inputValue.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN || !session?.user) {
            return;
        }

        const message: ChatMessage = {
            type: "message",
            roomId: roomId,
            userId: session.user.id,
            userName: session.user.name || "User",
            userRole: (session.user as { role?: string }).role || "customer",
            content: inputValue.trim(),
            timestamp: new Date().toISOString(),
        };

        ws.current.send(JSON.stringify(message));
        setInputValue("");
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isOwnMessage = item.userId === session?.user?.id;

        if (item.type === "join" || item.type === "leave") {
            return (
                <View className="items-center my-2">
                    <View className="bg-gray-200 rounded-full px-3 py-1">
                        <Text className="text-xs text-gray-500">
                            {item.userName} {item.type === "join" ? "joined" : "left"} the chat
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <View className={`mb-3 px-4 ${isOwnMessage ? "items-end" : "items-start"}`}>
                {!isOwnMessage && (
                    <Text className="text-xs text-gray-500 mb-1 ml-1">
                        {item.userName}
                    </Text>
                )}
                <View
                    className="max-w-[80%] rounded-2xl px-4 py-2.5"
                    style={{
                        backgroundColor: isOwnMessage ? TROJAN_NAVY : "white",
                        borderBottomRightRadius: isOwnMessage ? 4 : 16,
                        borderBottomLeftRadius: isOwnMessage ? 16 : 4,
                    }}
                >
                    <Text
                        className="text-sm leading-5"
                        style={{ color: isOwnMessage ? "white" : "#111827" }}
                    >
                        {item.content}
                    </Text>
                    <Text
                        className="text-xs mt-1 text-right"
                        style={{
                            color: isOwnMessage ? "rgba(255,255,255,0.6)" : "#9CA3AF",
                        }}
                    >
                        {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#E5DDD5" }}
        >
            <StatusBar barStyle="light-content" backgroundColor={TROJAN_NAVY} />

            {/* Header - WhatsApp Style */}
            <View
                className="flex-row items-center px-2"
                style={{
                    backgroundColor: TROJAN_NAVY,
                    paddingTop: insets.top,
                    paddingBottom: 12,
                }}
            >
                <Pressable
                    onPress={() => router.back()}
                    className="p-2"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <View
                    className="w-10 h-10 rounded-full items-center justify-center ml-1 mr-3"
                    style={{ backgroundColor: isSupport ? TROJAN_GOLD : `${TROJAN_GOLD}30` }}
                >
                    <Ionicons
                        name={isSupport ? "headset" : "briefcase"}
                        size={20}
                        color={isSupport ? TROJAN_NAVY : TROJAN_GOLD}
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-white font-semibold text-base" numberOfLines={1}>
                        {roomName}
                    </Text>
                    <View className="flex-row items-center">
                        <View
                            className="w-2 h-2 rounded-full mr-1.5"
                            style={{ backgroundColor: connected ? "#22C55E" : "#EF4444" }}
                        />
                        <Text className="text-white/60 text-xs">
                            {connected ? "Online" : "Connecting..."}
                        </Text>
                    </View>
                </View>

                <Pressable className="p-2">
                    <Ionicons name="call" size={22} color="white" />
                </Pressable>
                <Pressable className="p-2">
                    <Ionicons name="ellipsis-vertical" size={22} color="white" />
                </Pressable>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id || item.timestamp}
                className="flex-1"
                contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-12">
                        <View
                            className="w-20 h-20 rounded-full items-center justify-center mb-4"
                            style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                        >
                            <Ionicons
                                name={isSupport ? "headset-outline" : "briefcase-outline"}
                                size={40}
                                color={TROJAN_GOLD}
                            />
                        </View>
                        <Text className="text-gray-600 text-center font-medium">
                            {isSupport
                                ? "Welcome to Trojan Support"
                                : "Start chatting about your project"}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1 text-center px-8">
                            {isSupport
                                ? "We're here to help you with any questions"
                                : "Communicate with your project team here"}
                        </Text>
                    </View>
                }
                onContentSizeChange={() => {
                    if (messages.length > 0) {
                        flatListRef.current?.scrollToEnd({ animated: false });
                    }
                }}
            />

            {/* Input Area - WhatsApp Style */}
            <View
                className="flex-row items-end px-2 py-2 bg-transparent"
                style={{ paddingBottom: Math.max(insets.bottom, 8) }}
            >
                <View className="flex-1 bg-white rounded-3xl flex-row items-end mr-2 px-3">
                    <Pressable className="py-3">
                        <Ionicons name="happy-outline" size={24} color="#9CA3AF" />
                    </Pressable>
                    <TextInput
                        value={inputValue}
                        onChangeText={setInputValue}
                        placeholder="Message"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="flex-1 px-2 py-3"
                        style={{
                            maxHeight: 100,
                            fontSize: 16,
                            lineHeight: 20,
                        }}
                        onSubmitEditing={sendMessage}
                    />
                    <Pressable className="py-3">
                        <Ionicons name="attach" size={24} color="#9CA3AF" />
                    </Pressable>
                </View>

                <Pressable
                    onPress={sendMessage}
                    disabled={!connected || !inputValue.trim()}
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{
                        backgroundColor: TROJAN_GOLD,
                    }}
                >
                    <Ionicons
                        name={inputValue.trim() ? "send" : "mic"}
                        size={22}
                        color={TROJAN_NAVY}
                    />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
