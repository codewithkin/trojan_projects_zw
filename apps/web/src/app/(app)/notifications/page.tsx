"use client";

import { useState } from "react";
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    Ticket,
    Package,
    Users,
    Settings,
    CheckCheck,
    Trash2,
    Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type NotificationType = "order" | "ticket" | "system" | "user" | "alert";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "order",
        title: "New Order Received",
        message: "John Mukamuri placed an order for 5kW Solar Installation worth $3,500",
        timestamp: "5 minutes ago",
        read: false,
        link: "/orders/ORD001",
    },
    {
        id: "2",
        type: "ticket",
        title: "Urgent Ticket Assigned",
        message: "Ticket #TKT-2024-0045 about billing issue has been assigned to you",
        timestamp: "15 minutes ago",
        read: false,
        link: "/tickets/TKT-2024-0045",
    },
    {
        id: "3",
        type: "alert",
        title: "Low Stock Alert",
        message: "Solar Panel 400W inventory is running low (5 units remaining)",
        timestamp: "1 hour ago",
        read: false,
    },
    {
        id: "4",
        type: "user",
        title: "New Staff Member Joined",
        message: "Tatenda Chiweshe has joined the Solar Installation team",
        timestamp: "2 hours ago",
        read: true,
        link: "/staff/8",
    },
    {
        id: "5",
        type: "order",
        title: "Order Completed",
        message: "Order #ORD-2024-0089 for Mary Chigumba has been marked as completed",
        timestamp: "3 hours ago",
        read: true,
        link: "/orders/ORD-2024-0089",
    },
    {
        id: "6",
        type: "system",
        title: "System Update Scheduled",
        message: "System maintenance scheduled for tonight at 11:00 PM CAT",
        timestamp: "5 hours ago",
        read: true,
    },
    {
        id: "7",
        type: "ticket",
        title: "Ticket Resolved",
        message: "Ticket #TKT-2024-0039 has been resolved and closed",
        timestamp: "6 hours ago",
        read: true,
        link: "/tickets/TKT-2024-0039",
    },
    {
        id: "8",
        type: "order",
        title: "Payment Received",
        message: "Payment of $1,200 received for Order #ORD-2024-0092",
        timestamp: "Yesterday",
        read: true,
        link: "/orders/ORD-2024-0092",
    },
    {
        id: "9",
        type: "alert",
        title: "Customer Feedback",
        message: "Peter Moyo left a 5-star review for their solar installation",
        timestamp: "Yesterday",
        read: true,
        link: "/customers/3",
    },
    {
        id: "10",
        type: "system",
        title: "Weekly Report Ready",
        message: "Your weekly performance report is ready for review",
        timestamp: "2 days ago",
        read: true,
        link: "/reports",
    },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case "order":
            return <Package className="h-5 w-5 text-blue-500" />;
        case "ticket":
            return <Ticket className="h-5 w-5 text-purple-500" />;
        case "system":
            return <Settings className="h-5 w-5 text-gray-500" />;
        case "user":
            return <Users className="h-5 w-5 text-green-500" />;
        case "alert":
            return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        default:
            return <Info className="h-5 w-5 text-gray-500" />;
    }
};

const getNotificationBadgeColor = (type: NotificationType) => {
    switch (type) {
        case "order":
            return "bg-blue-100 text-blue-700";
        case "ticket":
            return "bg-purple-100 text-purple-700";
        case "system":
            return "bg-gray-100 text-gray-700";
        case "user":
            return "bg-green-100 text-green-700";
        case "alert":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [activeTab, setActiveTab] = useState("all");

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = () => {
        switch (activeTab) {
            case "unread":
                return notifications.filter((n) => !n.read);
            case "orders":
                return notifications.filter((n) => n.type === "order");
            case "tickets":
                return notifications.filter((n) => n.type === "ticket");
            case "system":
                return notifications.filter((n) => n.type === "system" || n.type === "alert");
            default:
                return notifications;
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: TROJAN_NAVY }}>
                        <Bell className="h-6 w-6" />
                        Notifications
                        {unreadCount > 0 && (
                            <Badge className="ml-2" style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                {unreadCount} unread
                            </Badge>
                        )}
                    </h1>
                    <p className="text-gray-500">Stay updated with the latest activity</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark All Read
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={clearAll} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear All Notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {notifications.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Unread</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: TROJAN_GOLD }}>
                            {unreadCount}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {notifications.filter((n) => n.type === "order").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {notifications.filter((n) => n.type === "ticket").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread {unreadCount > 0 && `(${unreadCount})`}
                    </TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            {filteredNotifications().length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No notifications to show</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredNotifications().map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/50" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className={`font-medium ${!notification.read ? "text-black" : "text-gray-700"}`}>
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-0.5">
                                                                {notification.message}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Badge className={getNotificationBadgeColor(notification.type)}>
                                                                    {notification.type}
                                                                </Badge>
                                                                <span className="text-xs text-gray-400">
                                                                    {notification.timestamp}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {!notification.read && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => markAsRead(notification.id)}
                                                                    title="Mark as read"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => deleteNotification(notification.id)}
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
