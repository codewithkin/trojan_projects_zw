"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Phone,
    Video,
    MoreVertical,
    Search,
    Circle,
    Clock,
    CheckCheck,
    Paperclip,
    Image,
    Smile,
    X,
    Users,
    MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Message {
    id: string;
    content: string;
    sender: "customer" | "agent";
    timestamp: string;
    read: boolean;
}

interface Chat {
    id: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
        initials: string;
    };
    lastMessage: string;
    timestamp: string;
    unread: number;
    status: "active" | "waiting" | "resolved";
    topic: string;
    messages: Message[];
}

// Mock data
const initialChats: Chat[] = [
    {
        id: "1",
        customer: {
            name: "John Mukamuri",
            email: "john@example.com",
            initials: "JM",
        },
        lastMessage: "Is the 5KVA system suitable for my 4-bedroom house?",
        timestamp: "2 min ago",
        unread: 2,
        status: "active",
        topic: "Solar System Inquiry",
        messages: [
            {
                id: "1a",
                content: "Hi, I'm interested in your solar systems",
                sender: "customer",
                timestamp: "10:30 AM",
                read: true,
            },
            {
                id: "1b",
                content: "Hello John! Thank you for reaching out. How can I help you today?",
                sender: "agent",
                timestamp: "10:32 AM",
                read: true,
            },
            {
                id: "1c",
                content: "I have a 4-bedroom house and I'm looking for a reliable solar system",
                sender: "customer",
                timestamp: "10:35 AM",
                read: true,
            },
            {
                id: "1d",
                content: "Is the 5KVA system suitable for my 4-bedroom house?",
                sender: "customer",
                timestamp: "10:36 AM",
                read: false,
            },
        ],
    },
    {
        id: "2",
        customer: {
            name: "Sarah Dziva",
            email: "sarah@example.com",
            initials: "SD",
        },
        lastMessage: "Thank you for the quick response!",
        timestamp: "15 min ago",
        unread: 0,
        status: "resolved",
        topic: "Order Status",
        messages: [
            {
                id: "2a",
                content: "Hi, I wanted to check on my order #ORD-1234",
                sender: "customer",
                timestamp: "9:45 AM",
                read: true,
            },
            {
                id: "2b",
                content:
                    "Hi Sarah! Let me check that for you. Your order is currently being prepared and will be installed on Friday.",
                sender: "agent",
                timestamp: "9:48 AM",
                read: true,
            },
            {
                id: "2c",
                content: "Thank you for the quick response!",
                sender: "customer",
                timestamp: "9:50 AM",
                read: true,
            },
        ],
    },
    {
        id: "3",
        customer: {
            name: "Peter Moyo",
            email: "peter@example.com",
            initials: "PM",
        },
        lastMessage: "I've been waiting for 30 minutes",
        timestamp: "32 min ago",
        unread: 3,
        status: "waiting",
        topic: "Installation Issue",
        messages: [
            {
                id: "3a",
                content: "Hello, I need help with my inverter",
                sender: "customer",
                timestamp: "9:00 AM",
                read: true,
            },
            {
                id: "3b",
                content: "It's showing an error code E04",
                sender: "customer",
                timestamp: "9:05 AM",
                read: true,
            },
            {
                id: "3c",
                content: "I've been waiting for 30 minutes",
                sender: "customer",
                timestamp: "9:32 AM",
                read: false,
            },
        ],
    },
    {
        id: "4",
        customer: {
            name: "Grace Ncube",
            email: "grace@example.com",
            initials: "GN",
        },
        lastMessage: "Can I get a quote for electric fencing?",
        timestamp: "1 hour ago",
        unread: 1,
        status: "active",
        topic: "Quote Request",
        messages: [
            {
                id: "4a",
                content: "Can I get a quote for electric fencing?",
                sender: "customer",
                timestamp: "8:45 AM",
                read: false,
            },
        ],
    },
];

const quickReplies = [
    "Thank you for contacting Trojan Projects! How can I help you today?",
    "I'll look into this for you right away.",
    "Let me check our records and get back to you.",
    "Our technician will contact you shortly to schedule an appointment.",
    "Is there anything else I can help you with?",
    "Thank you for your patience. We appreciate your business!",
];

export default function SupportChatPage() {
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(initialChats[0]);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "waiting" | "resolved">("all");
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat?.messages]);

    const filteredChats = chats.filter((chat) => {
        const matchesSearch =
            chat.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.topic.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || chat.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sendMessage = () => {
        if (!message.trim() || !selectedChat) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: message,
            sender: "agent",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: true,
        };

        setChats(
            chats.map((chat) =>
                chat.id === selectedChat.id
                    ? {
                        ...chat,
                        messages: [...chat.messages, newMessage],
                        lastMessage: message,
                        timestamp: "Just now",
                    }
                    : chat
            )
        );

        setSelectedChat({
            ...selectedChat,
            messages: [...selectedChat.messages, newMessage],
            lastMessage: message,
            timestamp: "Just now",
        });

        setMessage("");
        setShowQuickReplies(false);
    };

    const handleQuickReply = (reply: string) => {
        setMessage(reply);
        setShowQuickReplies(false);
    };

    const resolveChat = (chatId: string) => {
        setChats(
            chats.map((chat) => (chat.id === chatId ? { ...chat, status: "resolved" } : chat))
        );
        if (selectedChat?.id === chatId) {
            setSelectedChat({ ...selectedChat, status: "resolved" });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "#10B981";
            case "waiting":
                return "#F59E0B";
            case "resolved":
                return "#6B7280";
            default:
                return "#6B7280";
        }
    };

    const activeChats = chats.filter((c) => c.status === "active").length;
    const waitingChats = chats.filter((c) => c.status === "waiting").length;
    const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Live Chat
                    </h1>
                    <p className="text-gray-500">Respond to customer inquiries in real-time</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50">
                        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        <span className="text-sm text-green-700">{activeChats} Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50">
                        <Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm text-yellow-700">{waitingChats} Waiting</span>
                    </div>
                    {totalUnread > 0 && (
                        <Badge style={{ backgroundColor: TROJAN_NAVY }}>{totalUnread} Unread</Badge>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Chat List */}
                <Card className="lg:col-span-1 flex flex-col min-h-0">
                    <CardHeader className="pb-2 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {(["all", "active", "waiting", "resolved"] as const).map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter(status)}
                                    className={statusFilter === status ? "" : ""}
                                    style={statusFilter === status ? { backgroundColor: TROJAN_NAVY } : {}}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 min-h-0">
                        <ScrollArea className="h-full">
                            <div className="space-y-1 p-2">
                                {filteredChats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedChat?.id === chat.id
                                                ? "bg-blue-50 border border-blue-200"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <Avatar>
                                                    <AvatarImage src={chat.customer.avatar} />
                                                    <AvatarFallback>{chat.customer.initials}</AvatarFallback>
                                                </Avatar>
                                                <div
                                                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                                                    style={{ backgroundColor: getStatusColor(chat.status) }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium truncate">{chat.customer.name}</p>
                                                    <span className="text-xs text-gray-400">{chat.timestamp}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-1">{chat.topic}</p>
                                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                            </div>
                                            {chat.unread > 0 && (
                                                <Badge
                                                    className="ml-auto"
                                                    style={{ backgroundColor: TROJAN_NAVY }}
                                                >
                                                    {chat.unread}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2 flex flex-col min-h-0">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <CardHeader className="pb-2 border-b flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={selectedChat.customer.avatar} />
                                            <AvatarFallback>{selectedChat.customer.initials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{selectedChat.customer.name}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {selectedChat.customer.email} • {selectedChat.topic}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            style={{ color: getStatusColor(selectedChat.status) }}
                                        >
                                            {selectedChat.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedChat.status !== "resolved" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => resolveChat(selectedChat.id)}
                                            >
                                                Mark Resolved
                                            </Button>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Customer Profile</DropdownMenuItem>
                                                <DropdownMenuItem>View Order History</DropdownMenuItem>
                                                <DropdownMenuItem>Create Ticket</DropdownMenuItem>
                                                <DropdownMenuItem>Transfer Chat</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <CardContent className="flex-1 p-4 min-h-0 overflow-hidden">
                                <ScrollArea className="h-full pr-4">
                                    <div className="space-y-4">
                                        {selectedChat.messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "agent"
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    style={msg.sender === "agent" ? { backgroundColor: TROJAN_NAVY } : {}}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <div
                                                        className={`flex items-center gap-1 mt-1 text-xs ${msg.sender === "agent" ? "text-blue-200" : "text-gray-400"
                                                            }`}
                                                    >
                                                        <span>{msg.timestamp}</span>
                                                        {msg.sender === "agent" && (
                                                            <CheckCheck
                                                                className={`h-3 w-3 ${msg.read ? "text-blue-200" : ""}`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            {/* Quick Replies */}
                            {showQuickReplies && (
                                <div className="px-4 pb-2 flex-shrink-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">Quick Replies</span>
                                        <Button variant="ghost" size="sm" onClick={() => setShowQuickReplies(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quickReplies.map((reply, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => handleQuickReply(reply)}
                                            >
                                                {reply.slice(0, 40)}...
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Input */}
                            <div className="p-4 border-t flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Image className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        disabled={!message.trim()}
                                        style={{ backgroundColor: TROJAN_NAVY }}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
