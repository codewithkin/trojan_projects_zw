"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
    DollarSign,
    Users,
    ShoppingCart,
    TrendingUp,
    Package,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/stats-card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock data - in real app, fetch from API
const revenueData = [
    { month: "Jan", revenue: 4500, orders: 12 },
    { month: "Feb", revenue: 5200, orders: 15 },
    { month: "Mar", revenue: 4800, orders: 14 },
    { month: "Apr", revenue: 6100, orders: 18 },
    { month: "May", revenue: 5800, orders: 16 },
    { month: "Jun", revenue: 7200, orders: 22 },
    { month: "Jul", revenue: 6800, orders: 20 },
];

const serviceBreakdown = [
    { name: "Solar", value: 45, color: TROJAN_GOLD },
    { name: "CCTV", value: 30, color: "#3B82F6" },
    { name: "Electrical", value: 15, color: "#8B5CF6" },
    { name: "Inverters", value: 10, color: "#10B981" },
];

const recentOrders = [
    { id: "ORD-001", customer: "John Mukamuri", service: "5KVA Solar", status: "pending", amount: 2500, date: "2024-01-15" },
    { id: "ORD-002", customer: "Mary Chigumba", service: "CCTV 8-Camera", status: "in_progress", amount: 1800, date: "2024-01-14" },
    { id: "ORD-003", customer: "Peter Moyo", service: "Electric Fence", status: "completed", amount: 1200, date: "2024-01-13" },
    { id: "ORD-004", customer: "Sarah Dziva", service: "10KVA Solar", status: "pending", amount: 4500, date: "2024-01-12" },
    { id: "ORD-005", customer: "James Banda", service: "Inverter 3KVA", status: "completed", amount: 950, date: "2024-01-11" },
];

const topStaff = [
    { name: "Tendai Moyo", role: "Technician", projects: 24, rating: 4.9 },
    { name: "Gift Ncube", role: "Electrician", projects: 21, rating: 4.8 },
    { name: "Brian Chikwanha", role: "Installer", projects: 18, rating: 4.7 },
];

const chartConfig: ChartConfig = {
    revenue: {
        label: "Revenue",
        color: TROJAN_NAVY,
    },
    orders: {
        label: "Orders",
        color: TROJAN_GOLD,
    },
};

export function AdminDashboard() {
    const stats = useMemo(
        () => ({
            totalRevenue: { value: "$42,500", change: 12.5, isPositive: true },
            totalOrders: { value: "156", change: 8.2, isPositive: true },
            activeCustomers: { value: "89", change: 5.3, isPositive: true },
            pendingOrders: { value: "12", change: -15.4, isPositive: false },
        }),
        []
    );

    const getStatusBadge = (status: string) => {
        const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            in_progress: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
            completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
            cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
        };
        const style = statusStyles[status] || statusStyles.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                {style.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={stats.totalRevenue.value}
                    change={`${stats.totalRevenue.change}% from last month`}
                    changeType={stats.totalRevenue.isPositive ? "positive" : "negative"}
                    icon={DollarSign}
                    iconColor="#10B981"
                    iconBgColor="#D1FAE5"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders.value}
                    change={`${stats.totalOrders.change}% from last month`}
                    changeType={stats.totalOrders.isPositive ? "positive" : "negative"}
                    icon={ShoppingCart}
                    iconColor="#3B82F6"
                    iconBgColor="#DBEAFE"
                />
                <StatsCard
                    title="Active Customers"
                    value={stats.activeCustomers.value}
                    change={`${stats.activeCustomers.change}% from last month`}
                    changeType={stats.activeCustomers.isPositive ? "positive" : "negative"}
                    icon={Users}
                    iconColor="#8B5CF6"
                    iconBgColor="#EDE9FE"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders.value}
                    change={`${Math.abs(stats.pendingOrders.change)}% from last month`}
                    changeType={stats.pendingOrders.isPositive ? "negative" : "positive"}
                    icon={Clock}
                    iconColor="#F59E0B"
                    iconBgColor="#FEF3C7"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue and order trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={TROJAN_NAVY} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={TROJAN_NAVY} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke={TROJAN_NAVY}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Service Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Breakdown</CardTitle>
                        <CardDescription>Orders by service category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {serviceBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {serviceBreakdown.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-medium">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders and Staff Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest customer orders</CardDescription>
                        </div>
                        <Link href="/orders">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.slice(0, 5).map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Package size={18} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{order.customer}</p>
                                            <p className="text-xs text-gray-500">{order.service}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(order.status)}
                                        <span className="font-semibold text-sm">${order.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Staff */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performers</CardTitle>
                        <CardDescription>Staff by completed projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topStaff.map((staff, index) => (
                                <div key={staff.name} className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                        style={{ backgroundColor: index === 0 ? TROJAN_GOLD : index === 1 ? "#C0C0C0" : "#CD7F32" }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{staff.name}</p>
                                        <p className="text-xs text-gray-500">{staff.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">{staff.projects}</p>
                                        <p className="text-xs text-gray-500">projects</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/orders?action=new">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <ShoppingCart size={24} style={{ color: TROJAN_NAVY }} />
                                <span>New Order</span>
                            </Button>
                        </Link>
                        <Link href="/customers?action=new">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <Users size={24} style={{ color: TROJAN_NAVY }} />
                                <span>Add Customer</span>
                            </Button>
                        </Link>
                        <Link href="/services?action=new">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <Package size={24} style={{ color: TROJAN_NAVY }} />
                                <span>Add Service</span>
                            </Button>
                        </Link>
                        <Link href="/reports">
                            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                                <TrendingUp size={24} style={{ color: TROJAN_NAVY }} />
                                <span>View Reports</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
