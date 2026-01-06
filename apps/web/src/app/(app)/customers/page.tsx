"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Mail,
    Phone,
    MapPin,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Customer type
type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    status: "active" | "inactive";
    createdAt: string;
    lastOrder: string | null;
};

// Mock data
const mockCustomers: Customer[] = [
    {
        id: "1",
        name: "John Mukamuri",
        email: "john@example.com",
        phone: "+263 77 123 4567",
        address: "123 Greendale, Mutare",
        totalOrders: 5,
        totalSpent: 12500,
        status: "active",
        createdAt: "2023-06-15",
        lastOrder: "2024-01-15",
    },
    {
        id: "2",
        name: "Mary Chigumba",
        email: "mary@example.com",
        phone: "+263 77 234 5678",
        address: "45 Dangamvura, Mutare",
        totalOrders: 3,
        totalSpent: 5400,
        status: "active",
        createdAt: "2023-08-20",
        lastOrder: "2024-01-14",
    },
    {
        id: "3",
        name: "Peter Moyo",
        email: "peter@example.com",
        phone: "+263 77 345 6789",
        address: "78 Chikanga, Mutare",
        totalOrders: 2,
        totalSpent: 2400,
        status: "active",
        createdAt: "2023-10-10",
        lastOrder: "2024-01-10",
    },
    {
        id: "4",
        name: "Sarah Dziva",
        email: "sarah@example.com",
        phone: "+263 77 456 7890",
        address: "22 Fairbridge, Mutare",
        totalOrders: 1,
        totalSpent: 4500,
        status: "active",
        createdAt: "2024-01-05",
        lastOrder: "2024-01-12",
    },
    {
        id: "5",
        name: "James Banda",
        email: "james@example.com",
        phone: "+263 77 567 8901",
        address: "99 Sakubva, Mutare",
        totalOrders: 4,
        totalSpent: 7800,
        status: "inactive",
        createdAt: "2023-04-01",
        lastOrder: "2023-11-15",
    },
];

const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => {
            const customer = row.original;
            const initials = customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
            return (
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
            <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                {row.getValue("address")}
            </div>
        ),
    },
    {
        accessorKey: "totalOrders",
        header: "Orders",
        cell: ({ row }) => <span className="font-medium">{row.getValue("totalOrders")}</span>,
    },
    {
        accessorKey: "totalSpent",
        header: "Total Spent",
        cell: ({ row }) => (
            <span className="font-semibold" style={{ color: TROJAN_NAVY }}>
                ${row.getValue("totalSpent")}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={status === "active" ? "default" : "secondary"}>
                    {status === "active" ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "lastOrder",
        header: "Last Order",
        cell: ({ row }) => row.getValue("lastOrder") || <span className="text-gray-400">—</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const customer = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/customers/${customer.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function CustomersPage() {
    const stats = {
        total: mockCustomers.length,
        active: mockCustomers.filter((c) => c.status === "active").length,
        totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
        avgOrderValue: Math.round(
            mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) /
            mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0)
        ),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Customers
                    </h1>
                    <p className="text-gray-500">Manage your customer base</p>
                </div>
                <Button asChild style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                    <Link href="/customers/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Customer
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {stats.total}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            ${stats.totalRevenue.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            ${stats.avgOrderValue}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={mockCustomers}
                searchKey="name"
                searchPlaceholder="Search customers..."
                exportFileName="customers"
            />
        </div>
    );
}
