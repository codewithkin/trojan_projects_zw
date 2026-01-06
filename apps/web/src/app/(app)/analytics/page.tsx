"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock data
const revenueData = [
  { month: "Jan", revenue: 4500, orders: 12, profit: 1350 },
  { month: "Feb", revenue: 5200, orders: 15, profit: 1560 },
  { month: "Mar", revenue: 6100, orders: 18, profit: 1830 },
  { month: "Apr", revenue: 5800, orders: 16, profit: 1740 },
  { month: "May", revenue: 7200, orders: 22, profit: 2160 },
  { month: "Jun", revenue: 6800, orders: 20, profit: 2040 },
  { month: "Jul", revenue: 7500, orders: 24, profit: 2250 },
  { month: "Aug", revenue: 8200, orders: 26, profit: 2460 },
  { month: "Sep", revenue: 7800, orders: 23, profit: 2340 },
  { month: "Oct", revenue: 9100, orders: 28, profit: 2730 },
  { month: "Nov", revenue: 8500, orders: 25, profit: 2550 },
  { month: "Dec", revenue: 10200, orders: 32, profit: 3060 },
];

const serviceBreakdown = [
  { name: "Solar Installation", value: 45, revenue: 42000, color: TROJAN_NAVY },
  { name: "Inverters", value: 25, revenue: 23500, color: TROJAN_GOLD },
  { name: "Electric Fencing", value: 15, revenue: 14000, color: "#10B981" },
  { name: "Borehole", value: 10, revenue: 9400, color: "#3B82F6" },
  { name: "Gate Motors", value: 5, revenue: 4700, color: "#8B5CF6" },
];

const customerAcquisition = [
  { month: "Jan", newCustomers: 8, returningCustomers: 4 },
  { month: "Feb", newCustomers: 12, returningCustomers: 6 },
  { month: "Mar", newCustomers: 15, returningCustomers: 8 },
  { month: "Apr", newCustomers: 10, returningCustomers: 9 },
  { month: "May", newCustomers: 18, returningCustomers: 12 },
  { month: "Jun", newCustomers: 14, returningCustomers: 14 },
];

const conversionFunnel = [
  { stage: "Website Visits", count: 1500, rate: 100 },
  { stage: "Inquiries", count: 450, rate: 30 },
  { stage: "Quotations Sent", count: 180, rate: 12 },
  { stage: "Quotes Accepted", count: 95, rate: 6.3 },
  { stage: "Projects Completed", count: 85, rate: 5.7 },
];

const topProducts = [
  { name: "5KVA Solar System", units: 28, revenue: 22400, growth: 15 },
  { name: "3KVA Inverter", units: 22, revenue: 15400, growth: 8 },
  { name: "10KVA Solar System", units: 12, revenue: 18000, growth: 25 },
  { name: "Electric Fence 100m", units: 18, revenue: 9000, growth: -5 },
  { name: "Gate Motor Double", units: 15, revenue: 7500, growth: 12 },
];

const regionData = [
  { region: "Harare", orders: 85, revenue: 42000, customers: 120 },
  { region: "Bulawayo", orders: 35, revenue: 17500, customers: 48 },
  { region: "Chitungwiza", orders: 28, revenue: 14000, customers: 38 },
  { region: "Mutare", orders: 15, revenue: 7500, customers: 22 },
  { region: "Gweru", orders: 12, revenue: 6000, customers: 16 },
];

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: TROJAN_NAVY },
  profit: { label: "Profit", color: TROJAN_GOLD },
  orders: { label: "Orders", color: "#10B981" },
  newCustomers: { label: "New Customers", color: TROJAN_NAVY },
  returningCustomers: { label: "Returning", color: TROJAN_GOLD },
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12m");

  const totalRevenue = revenueData.reduce((sum, m) => sum + m.revenue, 0);
  const totalProfit = revenueData.reduce((sum, m) => sum + m.profit, 0);
  const totalOrders = revenueData.reduce((sum, m) => sum + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
            Analytics
          </h1>
          <p className="text-gray-500">Deep dive into business performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}K`}
          change="+23% from last year"
          changeType="positive"
          icon={DollarSign}
          iconColor="#10B981"
          iconBgColor="#D1FAE5"
        />
        <StatsCard
          title="Gross Profit"
          value={`$${(totalProfit / 1000).toFixed(1)}K`}
          change="30% margin"
          changeType="positive"
          icon={TrendingUp}
          iconColor={TROJAN_GOLD}
          iconBgColor="#FEF3C7"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          change="+18% from last year"
          changeType="positive"
          icon={Package}
          iconColor={TROJAN_NAVY}
          iconBgColor="#E0E7FF"
        />
        <StatsCard
          title="Avg Order Value"
          value={`$${avgOrderValue}`}
          change="+5% from last year"
          changeType="positive"
          icon={BarChart3}
          iconColor="#3B82F6"
          iconBgColor="#DBEAFE"
        />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Profit</TabsTrigger>
          <TabsTrigger value="services">Service Breakdown</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue & Profit Trend</CardTitle>
                <CardDescription>Monthly revenue and profit over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TROJAN_NAVY} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={TROJAN_NAVY} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TROJAN_GOLD} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={TROJAN_GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={TROJAN_NAVY}
                      fill="url(#revenueGradient)"
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke={TROJAN_GOLD}
                      fill="url(#profitGradient)"
                      name="Profit"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <span className="text-sm font-medium truncate max-w-[120px]">
                            {product.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">${product.revenue}</span>
                          {product.growth > 0 ? (
                            <Badge variant="secondary" className="text-green-600 bg-green-50">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              {product.growth}%
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-red-600 bg-red-50">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              {Math.abs(product.growth)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{product.units} units sold</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Sales breakdown by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Region</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Orders</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Customers</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionData.map((region) => (
                      <tr key={region.region} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{region.region}</td>
                        <td className="py-3 px-4">{region.orders}</td>
                        <td className="py-3 px-4">${region.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{region.customers}</td>
                        <td className="py-3 px-4">
                          ${Math.round(region.revenue / region.orders)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>Revenue breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {serviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Revenue</CardTitle>
                <CardDescription>Revenue by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceBreakdown.map((service) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: service.color }}
                          />
                          <span className="text-sm font-medium">{service.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          ${service.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            width: `${service.value}%`,
                            backgroundColor: service.color,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">{service.value}% of total revenue</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={customerAcquisition}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="newCustomers"
                      fill={TROJAN_NAVY}
                      name="New Customers"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="returningCustomers"
                      fill={TROJAN_GOLD}
                      name="Returning"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>Key customer statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: TROJAN_NAVY }}>
                      1,248
                    </p>
                    <p className="text-xs text-green-600 mt-1">+12% this month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Retention Rate</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: TROJAN_NAVY }}>
                      78%
                    </p>
                    <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Avg Lifetime Value</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: TROJAN_NAVY }}>
                      $1,850
                    </p>
                    <p className="text-xs text-green-600 mt-1">+8% this quarter</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Churn Rate</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: TROJAN_NAVY }}>
                      3.2%
                    </p>
                    <p className="text-xs text-green-600 mt-1">-0.5% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Customer journey from visit to completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => {
                  const width = (stage.count / conversionFunnel[0].count) * 100;
                  return (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{stage.count}</span>
                          <Badge variant="secondary">{stage.rate}%</Badge>
                        </div>
                      </div>
                      <div className="relative h-10 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded flex items-center justify-center text-white text-sm font-medium"
                          style={{
                            width: `${width}%`,
                            backgroundColor:
                              index === 0
                                ? "#94A3B8"
                                : index === conversionFunnel.length - 1
                                  ? "#10B981"
                                  : TROJAN_NAVY,
                            minWidth: "60px",
                          }}
                        >
                          {stage.count}
                        </div>
                      </div>
                      {index < conversionFunnel.length - 1 && (
                        <div className="flex justify-center my-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <TrendingDown className="h-3 w-3" />
                            <span>
                              {Math.round(
                                ((conversionFunnel[index].count - conversionFunnel[index + 1].count) /
                                  conversionFunnel[index].count) *
                                  100
                              )}
                              % drop-off
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
