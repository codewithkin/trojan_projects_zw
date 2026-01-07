"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    Package,
    Users,
    Settings,
    CheckCheck,
    Trash2,
    FileText,
    MessageSquare,
    Loader2,
    RefreshCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStoredToken } from "@/lib/auth-client";
import { env } from "@trojan_projects_zw/env/web";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Map notification types from backend
type NotificationType =
    | "user_created"
    | "user_invited"
    | "role_updated"
    | "project_created"
    | "project_updated"
    | "project_accepted"
    | "project_completed"
    | "quote_created"
    | "quote_approved"
    | "quote_rejected"
    | "message_received"
    | "system";

type UICategory = "user" | "project" | "quote" | "message" | "system";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data: Record<string, unknown> | null;
    read: boolean;
    createdAt: string;
}

interface NotificationsResponse {
    notifications: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

const getNotificationCategory = (type: NotificationType): UICategory => {
    if (type.startsWith("user_") || type === "role_updated") return "user";
    if (type.startsWith("project_")) return "project";
    if (type.startsWith("quote_")) return "quote";
    if (type === "message_received") return "message";
    return "system";
};

const getNotificationIcon = (type: NotificationType) => {
    const category = getNotificationCategory(type);
    switch (category) {
        case "project":
            return <Package className="h-5 w-5 text-blue-500" />;
        case "quote":
            return <FileText className="h-5 w-5 text-purple-500" />;
        case "message":
            return <MessageSquare className="h-5 w-5 text-green-500" />;
        case "user":
            return <Users className="h-5 w-5 text-amber-500" />;
        case "system":
            return <Settings className="h-5 w-5 text-gray-500" />;
        default:
            return <Info className="h-5 w-5 text-gray-500" />;
    }
};

const getNotificationBadgeColor = (type: NotificationType) => {
    const category = getNotificationCategory(type);
    switch (category) {
        case "project":
            return "bg-blue-100 text-blue-700";
        case "quote":
            return "bg-purple-100 text-purple-700";
        case "message":
            return "bg-green-100 text-green-700";
        case "user":
            return "bg-amber-100 text-amber-700";
        case "system":
            return "bg-gray-100 text-gray-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = getStoredToken();
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/notifications?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch notifications");
            const data: NotificationsResponse = await response.json();
            setNotifications(data.notifications);
            setError(null);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError("Failed to load notifications");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = () => {
        switch (activeTab) {
            case "unread":
                return notifications.filter((n) => !n.read);
            case "projects":
                return notifications.filter((n) => getNotificationCategory(n.type) === "project");
            case "quotes":
                return notifications.filter((n) => getNotificationCategory(n.type) === "quote");
            case "users":
                return notifications.filter((n) => getNotificationCategory(n.type) === "user");
            case "system":
                return notifications.filter((n) =>
                    getNotificationCategory(n.type) === "system" ||
                    getNotificationCategory(n.type) === "message"
                );
            default:
                return notifications;
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const token = getStoredToken();
            await fetch(`${env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = getStoredToken();
            await fetch(`${env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(notifications.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error("Error marking all notifications as read:", err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const token = getStoredToken();
            await fetch(`${env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(notifications.filter((n) => n.id !== id));
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const clearAll = async () => {
        // Delete all notifications one by one (or add a bulk delete endpoint)
        for (const notification of notifications) {
            await deleteNotification(notification.id);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-gray-600">{error}</p>
                <Button onClick={fetchNotifications}>Try Again</Button>
            </div>
        );
    }

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
                    <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                        <CardTitle className="text-sm font-medium text-gray-500">Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {notifications.filter((n) => getNotificationCategory(n.type) === "project").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Quotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {notifications.filter((n) => getNotificationCategory(n.type) === "quote").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">
                            {notifications.filter((n) => getNotificationCategory(n.type) === "user").length}
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
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
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
                                                                    {notification.type.replace(/_/g, " ")}
                                                                </Badge>
                                                                <span className="text-xs text-gray-400">
                                                                    {formatTimeAgo(notification.createdAt)}
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
