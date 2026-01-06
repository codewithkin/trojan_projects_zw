import { useState } from "react";
import { ScrollView, View, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Message {
    id: string;
    text: string;
    sender: "user" | "support";
    timestamp: Date;
}

const quickReplies = [
    "I need a quote for solar installation",
    "What CCTV options do you have?",
    "I have a question about my project",
    "Can I schedule a site visit?",
];

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! Welcome to Trojan Projects. How can we help you today?",
            sender: "support",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");

        // Simulate support response
        setTimeout(() => {
            const supportMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Thank you for your message! Our team will respond shortly. In the meantime, feel free to browse our services or call us at +263 77 123 4567.",
                sender: "support",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, supportMessage]);
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        >
            {/* Header */}
            <View
                className="px-4 py-6"
                style={{ backgroundColor: TROJAN_NAVY }}
            >
                <View className="flex-row items-center mb-2">
                    <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <Ionicons name="chatbubbles" size={24} color={TROJAN_NAVY} />
                    </View>
                    <View>
                        <Text className="text-xl font-bold text-white">
                            Chat Support
                        </Text>
                        <Text className="text-gray-300 text-sm">
                            We typically reply within minutes
                        </Text>
                    </View>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                className="flex-1 px-4 py-4"
                contentContainerStyle={{ paddingBottom: 16 }}
            >
                {messages.map((message) => (
                    <View
                        key={message.id}
                        className={`mb-3 ${message.sender === "user" ? "items-end" : "items-start"}`}
                    >
                        <View
                            className="max-w-[80%] rounded-2xl px-4 py-3"
                            style={{
                                backgroundColor: message.sender === "user" ? TROJAN_NAVY : "white",
                            }}
                        >
                            <Text
                                className="text-sm"
                                style={{ color: message.sender === "user" ? "white" : "#111827" }}
                            >
                                {message.text}
                            </Text>
                            <Text
                                className="text-xs mt-1"
                                style={{
                                    color: message.sender === "user" ? "rgba(255,255,255,0.7)" : "#9CA3AF",
                                }}
                            >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Quick Replies */}
            <View className="px-4 py-3 bg-white border-t border-gray-100">
                <Text className="text-xs text-gray-500 mb-2">Quick replies:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {quickReplies.map((reply) => (
                        <Pressable
                            key={reply}
                            onPress={() => sendMessage(reply)}
                            className="mr-2"
                        >
                            <View className="px-3 py-2 bg-gray-50 rounded-full border border-gray-200">
                                <Text className="text-xs text-gray-700">{reply}</Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Input */}
            <View className="px-4 py-3 bg-white border-t border-gray-100">
                <View className="flex-row items-center">
                    <TextInput
                        value={inputValue}
                        onChangeText={setInputValue}
                        placeholder="Type your message..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 bg-gray-50 rounded-full px-4 py-3 mr-2"
                    />
                    <Pressable
                        onPress={() => sendMessage(inputValue)}
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <Ionicons name="send" size={20} color={TROJAN_NAVY} />
                    </Pressable>
                </View>
            </View>

            {/* Contact Alternatives */}
            <View className="px-4 py-3 bg-white">
                <View className="flex-row justify-around">
                    <View className="items-center">
                        <Ionicons name="call" size={20} color={TROJAN_GOLD} />
                        <Text className="text-xs text-gray-600 mt-1">Call</Text>
                    </View>
                    <View className="items-center">
                        <Ionicons name="mail" size={20} color={TROJAN_GOLD} />
                        <Text className="text-xs text-gray-600 mt-1">Email</Text>
                    </View>
                    <View className="items-center">
                        <Ionicons name="time" size={20} color={TROJAN_GOLD} />
                        <Text className="text-xs text-gray-600 mt-1">Mon-Fri 8-5</Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
