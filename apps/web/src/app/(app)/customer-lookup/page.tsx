"use client";

import { useState } from "react";
import {
    Search,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    DollarSign,
    Clock,
    MessageSquare,
    FileText,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock customer data
const mockCustomerData = {
    id: "1",
    name: "John Mukamuri",
    email: "john@example.com",
    phone: "+263 77 123 4567",
    address: "123 Greendale, Mutare, Zimbabwe",
    status: "active",
    joinDate: "2023-06-15",
    totalOrders: 5,
    totalSpent: 12500,
    lastOrder: "2024-01-15",
    orders: [
        {
            id: "ORD-001",
            service: "5KVA Solar System",
            amount: 2500,
            status: "in_progress",
            date: "2024-01-15",
        },
        {
            id: "ORD-002",
            service: "Solar Geyser 200L",
            amount: 800,
            status: "completed",
            date: "2023-11-20",
        },
        {
            id: "ORD-003",
            service: "CCTV 4-Camera",
            amount: 1200,
            status: "completed",
            date: "2023-09-10",
        },
    ],
    tickets: [
        {
            id: "TKT-001",
            subject: "Solar panel not charging properly",
            status: "open",
            date: "2024-01-15",
        },
        {
            id: "TKT-002",
            subject: "Warranty inquiry",
            status: "resolved",
            date: "2023-10-05",
        },
    ],
    notes: [
        {
            id: 1,
            text: "VIP customer - prioritize support requests",
            author: "Admin",
            date: "2023-06-15",
        },
        {
            id: 2,
            text: "Prefers WhatsApp communication",
            author: "Rumbi K.",
            date: "2023-08-20",
        },
    ],
};

export default function CustomerLookupPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [customer, setCustomer] = useState<typeof mockCustomerData | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setCustomer(mockCustomerData);
            setIsSearching(false);
        }, 500);
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
            active: { variant: "default", label: "Active" },
            in_progress: { variant: "secondary", label: "In Progress" },
            completed: { variant: "default", label: "Completed" },
            open: { variant: "destructive", label: "Open" },
            resolved: { variant: "secondary", label: "Resolved" },
        };
        const { variant, label } = config[status] || { variant: "secondary", label: status };
        return <Badge variant={variant}>{label}</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                    Customer Lookup
                </h1>
                <p className="text-gray-500">Search for customer information and history</p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, email, phone, or order number..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching}
                            style={{ backgroundColor: TROJAN_NAVY }}
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Tip: You can search by customer name, email, phone number, or order/ticket number
                    </p>
                </CardContent>
            </Card>

            {/* Customer Info */}
            {customer && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center text-center mb-6">
                                <Avatar className="h-20 w-20 mb-4">
                                    <AvatarFallback
                                        className="text-2xl"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    >
                                        {customer.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-semibold">{customer.name}</h3>
                                {getStatusBadge(customer.status)}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-sm">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-sm">{customer.phone}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                    <span className="text-sm">{customer.address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-sm">Customer since {customer.joinDate}</span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        {customer.totalOrders}
                                    </p>
                                    <p className="text-xs text-gray-500">Total Orders</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        ${customer.totalSpent.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <Button variant="outline" className="w-full">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Customer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="orders">
                            <TabsList className="w-full">
                                <TabsTrigger value="orders" className="flex-1">
                                    Orders ({customer.orders.length})
                                </TabsTrigger>
                                <TabsTrigger value="tickets" className="flex-1">
                                    Tickets ({customer.tickets.length})
                                </TabsTrigger>
                                <TabsTrigger value="notes" className="flex-1">
                                    Notes ({customer.notes.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order History</CardTitle>
                                        <CardDescription>All orders placed by this customer</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {customer.orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <Package size={18} className="text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{order.service}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {order.id} • {order.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {getStatusBadge(order.status)}
                                                        <span className="font-semibold">${order.amount}</span>
                                                        <Button variant="ghost" size="icon">
                                                            <ExternalLink size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="tickets" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Support Tickets</CardTitle>
                                        <CardDescription>All support requests from this customer</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {customer.tickets.map((ticket) => (
                                                <div
                                                    key={ticket.id}
                                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <MessageSquare size={18} className="text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{ticket.subject}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {ticket.id} • {ticket.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {getStatusBadge(ticket.status)}
                                                        <Button variant="ghost" size="icon">
                                                            <ExternalLink size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notes" className="mt-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Internal Notes</CardTitle>
                                            <CardDescription>Team notes about this customer</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Add Note
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {customer.notes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="p-4 rounded-lg bg-yellow-50 border border-yellow-100"
                                                >
                                                    <p className="text-sm">{note.text}</p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        — {note.author}, {note.date}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!customer && !isSearching && (
                <Card className="p-12 text-center">
                    <User size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No customer selected</h3>
                    <p className="text-gray-500">
                        Use the search bar above to find a customer by name, email, phone, or order number.
                    </p>
                </Card>
            )}
        </div>
    );
}
