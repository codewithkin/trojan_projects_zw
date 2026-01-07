import { useState, useRef } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar, useWindowDimensions } from "react-native";
import { Send, MessageSquare } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { getEffectiveRole } from "@/config/admins";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function Chat() {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `Hi! I'm your AI assistant. I'm here to help ${getEffectiveRole(user) === "admin" ? "with system administration, analytics, and team management" : getEffectiveRole(user) === "staff" ? "with field work, project updates, and technical questions" : "with customer support, quote generation, and service information"}. What can I help you with today?`,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const contentPadding = isTablet ? 24 : 16;

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm a demo AI assistant. In production, I'd provide real-time help based on your role and questions about Trojan Projects services.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 1000);
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
                    AI Assistant
                </Text>
                <Text
                    style={{
                        fontSize: isTablet ? 14 : 12,
                        color: "#6B7280",
                        marginTop: 4,
                    }}
                >
                    {getEffectiveRole(user) === "admin"
                        ? "Get insights on analytics, team management, and operations"
                        : getEffectiveRole(user) === "staff"
                        ? "Technical support for field installations"
                        : "Customer service and product information"}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: contentPadding,
                        maxWidth: isLargeTablet ? 900 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={{
                                marginBottom: 16,
                                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                                maxWidth: "80%",
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: message.role === "user" ? TROJAN_NAVY : "white",
                                    borderRadius: isTablet ? 16 : 12,
                                    padding: isTablet ? 16 : 12,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: message.role === "assistant" ? 0.05 : 0,
                                    shadowRadius: 8,
                                    elevation: message.role === "assistant" ? 2 : 0,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: isTablet ? 15 : 14,
                                        color: message.role === "user" ? "white" : TROJAN_NAVY,
                                        lineHeight: isTablet ? 22 : 20,
                                    }}
                                >
                                    {message.content}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: message.role === "user" ? "rgba(255,255,255,0.7)" : "#9CA3AF",
                                        marginTop: 6,
                                    }}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {isLoading && (
                        <View
                            style={{
                                alignSelf: "flex-start",
                                backgroundColor: "white",
                                borderRadius: 12,
                                padding: 12,
                                marginBottom: 16,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <Text style={{ color: "#9CA3AF", fontSize: 14 }}>Typing...</Text>
                        </View>
                    )}
                </ScrollView>

                <View
                    style={{
                        padding: contentPadding,
                        backgroundColor: "white",
                        borderTopWidth: 1,
                        borderTopColor: "#E5E7EB",
                    }}
                >
                    <View
                        style={{
                            maxWidth: isLargeTablet ? 900 : undefined,
                            alignSelf: "center",
                            width: "100%",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#F9FAFB",
                                borderRadius: isTablet ? 24 : 20,
                                paddingHorizontal: isTablet ? 18 : 14,
                                paddingVertical: isTablet ? 12 : 8,
                            }}
                        >
                            <TextInput
                                placeholder="Ask me anything..."
                                placeholderTextColor="#9CA3AF"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                style={{
                                    flex: 1,
                                    fontSize: isTablet ? 16 : 14,
                                    color: TROJAN_NAVY,
                                    maxHeight: 100,
                                }}
                                onSubmitEditing={handleSend}
                            />
                            <Pressable
                                onPress={handleSend}
                                disabled={!inputText.trim() || isLoading}
                                style={{
                                    backgroundColor: inputText.trim() && !isLoading ? TROJAN_GOLD : "#E5E7EB",
                                    width: isTablet ? 44 : 36,
                                    height: isTablet ? 44 : 36,
                                    borderRadius: isTablet ? 22 : 18,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginLeft: 8,
                                }}
                            >
                                <Send size={isTablet ? 20 : 18} color={inputText.trim() && !isLoading ? TROJAN_NAVY : "#9CA3AF"} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}