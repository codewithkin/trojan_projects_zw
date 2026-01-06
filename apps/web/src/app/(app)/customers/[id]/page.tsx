"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    ShoppingCart,
    Star,
    MessageSquare,
    Edit,
    FileText,
    Plus,
    ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock customer data
const customerData = {
    id: "CUS-001",
    name: "John Mukamuri",
    email: "john.mukamuri@example.com",
    phone: "+263 77 123 4567",
    address: "123 Samora Machel Ave, Harare",
    city: "Harare",
    joinDate: "2023-06-15",
    avatar: "",
    initials: "JM",
    stats: {
        totalOrders: 5,
        totalSpent: 3250,
        avgOrderValue: 650,
        rating: 4.8,
    },
    tags: ["VIP", "Solar Customer"],
};

const orders = [
    {
        id: "ORD-2024-001",
        service: "5KVA Solar System",
        date: "2024-01-10",
        status: "in-progress",
        amount: 750,
    },
    {
        id: "ORD-2023-089",
        service: "Electric Fence 50m",
        date: "2023-11-20",
        status: "completed",
        amount: 350,
    },
    {
        id: "ORD-2023-056",
        service: "3KVA Inverter",
        date: "2023-08-15",
        status: "completed",
        amount: 400,
    },
    {
        id: "ORD-2023-034",
        service: "Gate Motor",
        date: "2023-07-05",
        status: "completed",
        amount: 500,
    },
    {
        id: "ORD-2023-012",
        service: "Solar Geyser",
        date: "2023-06-20",
        status: "completed",
        amount: 1250,
    },
];

const tickets = [
    {
        id: "TKT-001",
        subject: "Inverter making noise",
        date: "2024-01-08",
        status: "open",
        priority: "medium",
    },
    {
        id: "TKT-002",
        subject: "Battery replacement inquiry",
        date: "2023-12-15",
        status: "resolved",
        priority: "low",
    },
];

const notes = [
    {
        id: 1,
        author: "Admin",
        date: "2024-01-11",
        content: "Customer prefers morning appointments. Very responsive on WhatsApp.",
    },
    {
        id: 2,
        author: "Sales Team",
        date: "2023-11-15",
        content: "Interested in upgrading to 10KVA system next year.",
    },
];

const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "#FEF3C7", text: "#D97706" },
    confirmed: { bg: "#DBEAFE", text: "#2563EB" },
    "in-progress": { bg: "#E0E7FF", text: TROJAN_NAVY },
    completed: { bg: "#D1FAE5", text: "#059669" },
    cancelled: { bg: "#FEE2E2", text: "#DC2626" },
    open: { bg: "#FEF3C7", text: "#D97706" },
    resolved: { bg: "#D1FAE5", text: "#059669" },
};

const orderColumns: ColumnDef<(typeof orders)[0]>[] = [
    {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => (
            <span className="font-medium" style={{ color: TROJAN_NAVY }}>
                {row.getValue("id")}
            </span>
        ),
    },
    {
        accessorKey: "service",
        header: "Service",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    style={{
                        backgroundColor: statusColors[status]?.bg,
                        color: statusColors[status]?.text,
                    }}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <span className="font-medium">${row.getValue("amount")}</span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
            </Button>
        ),
    },
];

const ticketColumns: ColumnDef<(typeof tickets)[0]>[] = [
    {
        accessorKey: "id",
        header: "Ticket ID",
        cell: ({ row }) => (
            <span className="font-medium" style={{ color: TROJAN_NAVY }}>
                {row.getValue("id")}
            </span>
        ),
    },
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string;
            const colors: Record<string, string> = {
                high: "#DC2626",
                medium: "#D97706",
                low: "#6B7280",
            };
            return (
                <Badge variant="outline" style={{ borderColor: colors[priority], color: colors[priority] }}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    style={{
                        backgroundColor: statusColors[status]?.bg,
                        color: statusColors[status]?.text,
                    }}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    },
];

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-500">({rating})</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={customerData.avatar} />
                            <AvatarFallback className="text-lg">{customerData.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                    {customerData.name}
                                </h1>
                                {customerData.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        style={{
                                            backgroundColor: tag === "VIP" ? TROJAN_GOLD : "#E5E7EB",
                                            color: tag === "VIP" ? TROJAN_NAVY : "#374151",
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-gray-500">
                                Customer since {new Date(customerData.joinDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                    </Button>
                    <Button style={{ backgroundColor: TROJAN_NAVY }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#E0E7FF" }}
                            >
                                <ShoppingCart className="h-6 w-6" style={{ color: TROJAN_NAVY }} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                    {customerData.stats.totalOrders}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#D1FAE5" }}
                            >
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Spent</p>
                                <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                    ${customerData.stats.totalSpent}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#FEF3C7" }}
                            >
                                <Star className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rating</p>
                                {renderStars(customerData.stats.rating)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="orders">
                        <TabsList>
                            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
                            <TabsTrigger value="tickets">Tickets ({tickets.length})</TabsTrigger>
                            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order History</CardTitle>
                                    <CardDescription>All orders placed by this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        columns={orderColumns}
                                        data={orders}
                                        searchKey="service"
                                        searchPlaceholder="Search orders..."
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tickets" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Support Tickets</CardTitle>
                                    <CardDescription>Customer support history</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        columns={ticketColumns}
                                        data={tickets}
                                        searchKey="subject"
                                        searchPlaceholder="Search tickets..."
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Notes</CardTitle>
                                        <CardDescription>Internal notes about this customer</CardDescription>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Note
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {notes.map((note) => (
                                            <div key={note.id} className="p-4 rounded-lg bg-gray-50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-medium">{note.author}</p>
                                                    <p className="text-sm text-gray-400">{note.date}</p>
                                                </div>
                                                <p className="text-gray-600">{note.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p>{customerData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p>{customerData.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p>{customerData.address}</p>
                                        <p className="text-gray-500">{customerData.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p>{new Date(customerData.joinDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Create Order
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Create Quote
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Create Ticket
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
