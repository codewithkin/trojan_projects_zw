import { useState, useEffect, useRef } from "react";
import { ScrollView, View, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";

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

interface Project {
    id: string;
    name: string;
    status: string;
}

type TabType = "projects" | "support";

// Mock projects - replace with actual data from your API
const mockProjects: Project[] = [
    { id: "proj-1", name: "Solar Installation - Harare", status: "In Progress" },
    { id: "proj-2", name: "CCTV System - Bulawayo", status: "Planning" },
];

export default function Chat() {
    const { data: session } = authClient.useSession();
    const [activeTab, setActiveTab] = useState<TabType>("projects");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [connected, setConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    const currentRoomId = activeTab === "projects" && selectedProject
        ? `project-${selectedProject.id}`
        : "support";

    useEffect(() => {
        if (!session?.user) return;

        // Connect to WebSocket when component mounts or tab/project changes
        connectWebSocket();

        return () => {
            // Cleanup on unmount
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [session, activeTab, selectedProject]);

    const connectWebSocket = () => {
        if (!session?.user) return;

        // Close existing connection
        if (ws.current) {
            ws.current.close();
        }

        const wsUrl = `ws://10.255.235.15:3000/ws?roomId=${encodeURIComponent(currentRoomId)}&userId=${encodeURIComponent(session.user.id)}&userName=${encodeURIComponent(session.user.name || "User")}&userRole=${encodeURIComponent(session.user.role || "customer")}`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
            setConnected(true);
        };

        ws.current.onmessage = (event) => {
            try {
                const message: ChatMessage = JSON.parse(event.data);
                setMessages((prev) => [...prev, { ...message, id: message.timestamp }]);
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
            roomId: currentRoomId,
            userId: session.user.id,
            userName: session.user.name || "User",
            userRole: session.user.role || "customer",
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
                    <Text className="text-xs text-gray-400">
                        {item.userName} {item.type === "join" ? "joined" : "left"} the chat
                    </Text>
                </View>
            );
        }

        return (
            <View className={`mb-3 ${isOwnMessage ? "items-end" : "items-start"}`}>
                {!isOwnMessage && (
                    <Text className="text-xs text-gray-500 mb-1 ml-3">
                        {item.userName} ({item.userRole})
                    </Text>
                )}
                <View
                    className="max-w-[80%] rounded-2xl px-4 py-3"
                    style={{
                        backgroundColor: isOwnMessage ? TROJAN_NAVY : "white",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                >
                    <Text
                        className="text-sm"
                        style={{ color: isOwnMessage ? "white" : "#111827" }}
                    >
                        {item.content}
                    </Text>
                    <Text
                        className="text-xs mt-1"
                        style={{
                            color: isOwnMessage ? "rgba(255,255,255,0.7)" : "#9CA3AF",
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
            style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        >
            {/* Header */}
            <View className="px-4 py-6" style={{ backgroundColor: TROJAN_NAVY }}>
                <View className="flex-row items-center mb-4">
                    <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <Ionicons name="chatbubbles" size={24} color={TROJAN_NAVY} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-white">Chat</Text>
                        <View className="flex-row items-center">
                            <View
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: connected ? "#10B981" : "#EF4444" }}
                            />
                            <Text className="text-gray-300 text-sm">
                                {connected ? "Connected" : "Disconnected"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-white/10 rounded-lg p-1">
                    <Pressable
                        onPress={() => setActiveTab("projects")}
                        className="flex-1 py-2 rounded-md items-center"
                        style={activeTab === "projects" ? { backgroundColor: TROJAN_GOLD } : {}}
                    >
                        <Text
                            className="font-medium"
                            style={{ color: activeTab === "projects" ? TROJAN_NAVY : "white" }}
                        >
                            My Projects
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab("support")}
                        className="flex-1 py-2 rounded-md items-center"
                        style={activeTab === "support" ? { backgroundColor: TROJAN_GOLD } : {}}
                    >
                        <Text
                            className="font-medium"
                            style={{ color: activeTab === "support" ? TROJAN_NAVY : "white" }}
                        >
                            Support
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Project Selection (only visible when Projects tab is active) */}
            {activeTab === "projects" && !selectedProject && (
                <View className="flex-1 p-4">
                    <Text className="text-lg font-bold mb-4" style={{ color: TROJAN_NAVY }}>
                        Select a Project to Chat
                    </Text>
                    {mockProjects.map((project) => (
                        <Pressable
                            key={project.id}
                            onPress={() => setSelectedProject(project)}
                            className="mb-3"
                        >
                            <View className="bg-white rounded-lg p-4 shadow-sm">
                                <Text className="font-semibold text-gray-900">{project.name}</Text>
                                <Text className="text-sm text-gray-500 mt-1">Status: {project.status}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Chat View */}
            {(activeTab === "support" || selectedProject) && (
                <>
                    {/* Selected Project Header */}
                    {activeTab === "projects" && selectedProject && (
                        <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center">
                            <Pressable onPress={() => setSelectedProject(null)} className="mr-3">
                                <Ionicons name="arrow-back" size={24} color={TROJAN_NAVY} />
                            </Pressable>
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-900">{selectedProject.name}</Text>
                                <Text className="text-xs text-gray-500">{selectedProject.status}</Text>
                            </View>
                        </View>
                    )}

                    {/* Messages */}
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id || item.timestamp}
                        className="flex-1 px-4 py-4"
                        contentContainerStyle={{ paddingBottom: 16 }}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-12">
                                <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
                                <Text className="text-gray-400 mt-4 text-center">
                                    {activeTab === "projects"
                                        ? "Start chatting with your project team"
                                        : "Start a conversation with our support team"}
                                </Text>
                            </View>
                        }
                    />

                    {/* Input */}
                    <View className="px-4 py-3 bg-white border-t border-gray-100">
                        <View className="flex-row items-center">
                            <TextInput
                                value={inputValue}
                                onChangeText={setInputValue}
                                placeholder="Type your message..."
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 bg-gray-50 rounded-full px-4 py-3 mr-2"
                                onSubmitEditing={sendMessage}
                            />
                            <Pressable
                                onPress={sendMessage}
                                disabled={!connected || !inputValue.trim()}
                                className="w-12 h-12 rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: connected && inputValue.trim() ? TROJAN_GOLD : "#D1D5DB",
                                }}
                            >
                                <Ionicons name="send" size={20} color={TROJAN_NAVY} />
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
        </KeyboardAvoidingView>
    );
}

