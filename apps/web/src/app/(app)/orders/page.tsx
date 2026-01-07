"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import { ColumnDef } from "@tanstack/react-table";
import {
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    AlertTriangle,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Order type
type Order = {
    id: string;
    orderNumber: string;
    customer: string;
    email: string;
    service: string;
    amount: number;
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
    paymentStatus: "unpaid" | "partial" | "paid";
    createdAt: string;
    dueDate: string;
    assignedTo: string | null;
};

// Mock data
const mockOrders: Order[] = [
    {
        id: "1",
        orderNumber: "ORD-2024-001",
        customer: "John Mukamuri",
        email: "john@example.com",
        service: "5KVA Solar System",
        amount: 2500,
        status: "in_progress",
        paymentStatus: "partial",
        createdAt: "2024-01-15",
        dueDate: "2024-01-25",
        assignedTo: "Tendai Moyo",
    },
    {
        id: "2",
        orderNumber: "ORD-2024-002",
        customer: "Mary Chigumba",
        email: "mary@example.com",
        service: "CCTV 8-Camera System",
        amount: 1800,
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: "2024-01-14",
        dueDate: "2024-01-24",
        assignedTo: null,
    },
    {
        id: "3",
        orderNumber: "ORD-2024-003",
        customer: "Peter Moyo",
        email: "peter@example.com",
        service: "Electric Fence Installation",
        amount: 1200,
        status: "completed",
        paymentStatus: "paid",
        createdAt: "2024-01-10",
        dueDate: "2024-01-20",
        assignedTo: "Gift Ncube",
    },
    {
        id: "4",
        orderNumber: "ORD-2024-004",
        customer: "Sarah Dziva",
        email: "sarah@example.com",
        service: "10KVA Solar System",
        amount: 4500,
        status: "confirmed",
        paymentStatus: "partial",
        createdAt: "2024-01-12",
        dueDate: "2024-01-30",
        assignedTo: "Tendai Moyo",
    },
    {
        id: "5",
        orderNumber: "ORD-2024-005",
        customer: "James Banda",
        email: "james@example.com",
        service: "Inverter 3KVA",
        amount: 950,
        status: "completed",
        paymentStatus: "paid",
        createdAt: "2024-01-08",
        dueDate: "2024-01-15",
        assignedTo: "Brian Chikwanha",
    },
    {
        id: "6",
        orderNumber: "ORD-2024-006",
        customer: "Grace Mutasa",
        email: "grace@example.com",
        service: "Solar Geyser 200L",
        amount: 800,
        status: "cancelled",
        paymentStatus: "unpaid",
        createdAt: "2024-01-05",
        dueDate: "2024-01-12",
        assignedTo: null,
    },
];

const getStatusBadge = (status: Order["status"]) => {
    const config: Record<Order["status"], { variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock; label: string }> = {
        pending: { variant: "secondary", icon: Clock, label: "Pending" },
        confirmed: { variant: "outline", icon: CheckCircle, label: "Confirmed" },
        in_progress: { variant: "default", icon: Clock, label: "In Progress" },
        completed: { variant: "default", icon: CheckCircle, label: "Completed" },
        cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" },
    };
    const { variant, icon: Icon, label } = config[status];
    return (
        <Badge variant={variant} className="gap-1">
            <Icon size={12} />
            {label}
        </Badge>
    );
};

const getPaymentBadge = (status: Order["paymentStatus"]) => {
    const config: Record<Order["paymentStatus"], { bg: string; text: string; label: string }> = {
        unpaid: { bg: "bg-red-100", text: "text-red-700", label: "Unpaid" },
        partial: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Partial" },
        paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
    };
    const { bg, text, label } = config[status];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => (
            <span className="font-medium" style={{ color: TROJAN_NAVY }}>
                {row.getValue("orderNumber")}
            </span>
        ),
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.getValue("customer")}</p>
                <p className="text-sm text-gray-500">{row.original.email}</p>
            </div>
        ),
    },
    {
        accessorKey: "service",
        header: "Service",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <span className="font-semibold">${row.getValue("amount")}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => getPaymentBadge(row.getValue("paymentStatus")),
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => row.getValue("assignedTo") || <span className="text-gray-400">Unassigned</span>,
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Order
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function OrdersPage() {
    const { isAuthorized, isLoading } = useAdminGuard();
    const [activeTab, setActiveTab] = useState("all");

    // Don't render if not authorized
    if (isLoading || !isAuthorized) {
        return null;
    }

    const filteredOrders = activeTab === "all"
        ? mockOrders
        : mockOrders.filter((order) => order.status === activeTab);

    const stats = {
        all: mockOrders.length,
        pending: mockOrders.filter((o) => o.status === "pending").length,
        in_progress: mockOrders.filter((o) => o.status === "in_progress").length,
        completed: mockOrders.filter((o) => o.status === "completed").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Orders
                    </h1>
                    <p className="text-gray-500">Manage customer orders and installations</p>
                </div>
                <Button asChild style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                    <Link href="/orders/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Order
                    </Link>
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">
                        All Orders ({stats.all})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending ({stats.pending})
                    </TabsTrigger>
                    <TabsTrigger value="in_progress">
                        In Progress ({stats.in_progress})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Completed ({stats.completed})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <DataTable
                        columns={columns}
                        data={filteredOrders}
                        searchPlaceholder="Search orders..."
                        exportFileName="orders"
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
