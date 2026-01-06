"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock data
const monthlyRevenue = [
  { month: "Jan", revenue: 12500, expenses: 8200, profit: 4300 },
  { month: "Feb", revenue: 15200, expenses: 9100, profit: 6100 },
  { month: "Mar", revenue: 14800, expenses: 8800, profit: 6000 },
  { month: "Apr", revenue: 18100, expenses: 10200, profit: 7900 },
  { month: "May", revenue: 16800, expenses: 9500, profit: 7300 },
  { month: "Jun", revenue: 21200, expenses: 11800, profit: 9400 },
  { month: "Jul", revenue: 19800, expenses: 11200, profit: 8600 },
  { month: "Aug", revenue: 22500, expenses: 12500, profit: 10000 },
  { month: "Sep", revenue: 20100, expenses: 11000, profit: 9100 },
  { month: "Oct", revenue: 24200, expenses: 13200, profit: 11000 },
  { month: "Nov", revenue: 26800, expenses: 14500, profit: 12300 },
  { month: "Dec", revenue: 28500, expenses: 15200, profit: 13300 },
];

const ordersByService = [
  { service: "Solar Systems", orders: 45, revenue: 125000 },
  { service: "CCTV", orders: 32, revenue: 48000 },
  { service: "Electric Fence", orders: 28, revenue: 33600 },
  { service: "Inverters", orders: 22, revenue: 20900 },
  { service: "Solar Geysers", orders: 18, revenue: 14400 },
];

const customerGrowth = [
  { month: "Jan", new: 12, returning: 28 },
  { month: "Feb", new: 15, returning: 32 },
  { month: "Mar", new: 18, returning: 35 },
  { month: "Apr", new: 22, returning: 40 },
  { month: "May", new: 20, returning: 38 },
  { month: "Jun", new: 25, returning: 45 },
];

const staffPerformance = [
  { name: "Tendai M.", completed: 24, target: 30, satisfaction: 96 },
  { name: "Gift N.", completed: 21, target: 28, satisfaction: 94 },
  { name: "Brian C.", completed: 18, target: 25, satisfaction: 92 },
  { name: "Farai M.", completed: 15, target: 22, satisfaction: 90 },
];

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: TROJAN_NAVY },
  expenses: { label: "Expenses", color: "#EF4444" },
  profit: { label: "Profit", color: "#10B981" },
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("year");
  const [reportType, setReportType] = useState("financial");

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = monthlyRevenue.reduce((sum, m) => sum + m.profit, 0);
  const totalOrders = ordersByService.reduce((sum, s) => sum + s.orders, 0);

  const exportReport = (format: "csv" | "pdf") => {
    // In real app, generate and download report
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
            Reports
          </h1>
          <p className="text-gray-500">Business analytics and performance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => exportReport("pdf")}
            style={{ backgroundColor: TROJAN_NAVY }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}k`}
          change="18.2% from last year"
          changeType="positive"
          icon={DollarSign}
          iconColor="#10B981"
          iconBgColor="#D1FAE5"
        />
        <StatsCard
          title="Total Expenses"
          value={`$${(totalExpenses / 1000).toFixed(0)}k`}
          change="12.5% from last year"
          changeType="negative"
          icon={TrendingUp}
          iconColor="#EF4444"
          iconBgColor="#FEE2E2"
        />
        <StatsCard
          title="Net Profit"
          value={`$${(totalProfit / 1000).toFixed(0)}k`}
          change="24.8% from last year"
          changeType="positive"
          icon={TrendingUp}
          iconColor="#3B82F6"
          iconBgColor="#DBEAFE"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          change="15.3% from last year"
          changeType="positive"
          icon={ShoppingCart}
          iconColor="#8B5CF6"
          iconBgColor="#EDE9FE"
        />
      </div>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="orders">Orders & Services</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
        </TabsList>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial overview for {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TROJAN_NAVY} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={TROJAN_NAVY} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={TROJAN_NAVY}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Profit"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name="Expenses"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders & Services Reports */}
        <TabsContent value="orders" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Service Category</CardTitle>
              <CardDescription>Service performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={ordersByService} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis dataKey="service" type="category" stroke="#6B7280" fontSize={12} width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill={TROJAN_NAVY} radius={[0, 4, 4, 0]} name="Orders" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordersByService.map((service) => (
                    <div key={service.service} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{service.service}</span>
                      <span className="font-semibold">${service.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ordersByService}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="orders"
                        label={({ service, percent }) =>
                          `${service.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {ordersByService.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              [TROJAN_NAVY, TROJAN_GOLD, "#3B82F6", "#8B5CF6", "#10B981"][index % 5]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Reports */}
        <TabsContent value="customers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>New vs returning customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="new" fill={TROJAN_GOLD} name="New Customers" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" fill={TROJAN_NAVY} name="Returning" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Performance Reports */}
        <TabsContent value="staff" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Overview</CardTitle>
              <CardDescription>Projects completed vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={staffPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPerformance.map((staff) => (
                  <div key={staff.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{staff.name}</span>
                      <span className="text-sm text-gray-600">{staff.satisfaction}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${staff.satisfaction}%`,
                          backgroundColor: staff.satisfaction >= 95 ? "#10B981" : staff.satisfaction >= 90 ? TROJAN_GOLD : "#EF4444",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
