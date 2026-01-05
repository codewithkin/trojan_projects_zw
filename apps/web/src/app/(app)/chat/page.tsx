"use client";

import { useState } from "react";
import { Send, MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

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

export default function ChatPage() {
    const { data: session } = authClient.useSession();
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
                text: "Thank you for your message! Our team will respond shortly. In the meantime, feel free to browse our services or call us directly at +263 77 123 4567.",
                sender: "support",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, supportMessage]);
        }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <MessageCircle size={32} style={{ color: TROJAN_GOLD }} />
                    </div>
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: TROJAN_NAVY }}
                    >
                        Chat with Us
                    </h1>
                    <p className="text-gray-600">
                        Get quick answers to your questions
                    </p>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === "user"
                                        ? "text-white"
                                        : "bg-gray-100 text-gray-900"
                                        }`}
                                    style={message.sender === "user" ? { backgroundColor: TROJAN_NAVY } : {}}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${message.sender === "user" ? "text-gray-300" : "text-gray-400"
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Replies */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickReplies.map((reply) => (
                                <button
                                    key={reply}
                                    onClick={() => sendMessage(reply)}
                                    className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-gray-600 hover:border-gray-300 transition"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-full"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full w-12 h-12"
                                style={{ backgroundColor: TROJAN_GOLD }}
                            >
                                <Send size={18} color={TROJAN_NAVY} />
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Contact Alternatives */}
                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                        <Phone size={24} className="mx-auto mb-2" style={{ color: TROJAN_GOLD }} />
                        <p className="font-medium text-gray-900">Call Us</p>
                        <p className="text-sm text-gray-500">+263 77 123 4567</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                        <Mail size={24} className="mx-auto mb-2" style={{ color: TROJAN_GOLD }} />
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">info@trojanprojects.co.zw</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                        <Clock size={24} className="mx-auto mb-2" style={{ color: TROJAN_GOLD }} />
                        <p className="font-medium text-gray-900">Hours</p>
                        <p className="text-sm text-gray-500">Mon-Fri 8am-5pm</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
