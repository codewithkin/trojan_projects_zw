"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Clock,
  Star,
  Users,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  ListChecks,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock service data
const mockService = {
  id: "1",
  name: "5kW Solar Installation",
  shortDescription: "Complete 5kW solar power system for medium-sized homes",
  description: `Our 5kW Solar Installation package is perfect for medium-sized homes looking to reduce their electricity bills and gain energy independence. 
  
This comprehensive package includes high-efficiency solar panels, a reliable inverter system, all necessary mounting hardware, and professional installation by our certified technicians.

The system is designed to generate approximately 20-25 kWh per day under optimal conditions, which is sufficient to power most household appliances including refrigerators, washing machines, lighting, and entertainment systems.`,
  category: "Solar Installation",
  basePrice: 3500,
  priceType: "fixed",
  duration: 3,
  durationUnit: "days",
  status: "active",
  isPopular: true,
  createdAt: "2023-06-15",
  updatedAt: "2024-01-10",
  features: [
    "10x 500W High-Efficiency Solar Panels",
    "5kW Hybrid Inverter",
    "Battery Ready",
    "Professional Installation",
    "5-Year Warranty on Installation",
    "25-Year Panel Warranty",
    "Free Consultation",
    "24/7 Support",
  ],
  checklist: [
    "Site assessment and roof inspection",
    "Electrical panel evaluation",
    "Install mounting rails",
    "Mount solar panels",
    "Install inverter",
    "Wire panels to inverter",
    "Connect to electrical panel",
    "System testing",
    "Customer training",
    "Documentation handover",
  ],
};

// Mock stats
const mockStats = {
  totalOrders: 45,
  completedOrders: 38,
  revenue: 157500,
  avgRating: 4.8,
  reviewCount: 32,
};

// Mock revenue trend
const revenueTrend = [
  { month: "Aug", revenue: 10500 },
  { month: "Sep", revenue: 14000 },
  { month: "Oct", revenue: 17500 },
  { month: "Nov", revenue: 21000 },
  { month: "Dec", revenue: 28000 },
  { month: "Jan", revenue: 31500 },
];

// Mock recent orders
const recentOrders = [
  { id: "ORD001", customer: "John Moyo", date: "2024-01-15", status: "in_progress", amount: 3500 },
  { id: "ORD002", customer: "Sarah Dube", date: "2024-01-12", status: "completed", amount: 3500 },
  { id: "ORD003", customer: "Peter Ncube", date: "2024-01-08", status: "completed", amount: 3500 },
  { id: "ORD004", customer: "Grace Mutendi", date: "2024-01-05", status: "completed", amount: 3500 },
];

const getStatusBadge = (status: string) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
    draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
    inactive: { bg: "bg-red-100", text: "text-red-700", label: "Inactive" },
  };
  const { bg, text, label } = config[status] || config.draft;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: TROJAN_GOLD,
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  // In real app, fetch service data based on serviceId
  const service = mockService;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                {service.name}
              </h1>
              {getStatusBadge(service.status)}
              {service.isPopular && (
                <Badge style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-gray-500">{service.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            {service.status === "active" ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Button asChild style={{ backgroundColor: TROJAN_NAVY }}>
            <Link href={`/services-management/${serviceId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Service
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Service</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this service? This action cannot be undone.
                  All associated data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                  {mockStats.totalOrders}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${mockStats.revenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Avg. Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold" style={{ color: TROJAN_GOLD }}>
                    {mockStats.avgRating}
                  </span>
                  <span className="text-sm text-gray-500">({mockStats.reviewCount})</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                  {Math.round((mockStats.completedOrders / mockStats.totalOrders) * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Last 6 months performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={TROJAN_GOLD}
                      fill={TROJAN_GOLD}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-line">{service.description}</p>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">
                        {order.id} • {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.amount}</p>
                      <Badge
                        variant={order.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                ${service.basePrice.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {service.priceType === "starting" && "starting"}
                  {service.priceType === "hourly" && "/hour"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  Estimated: {service.duration} {service.durationUnit}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Installation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Installation Checklist
              </CardTitle>
              <CardDescription>Steps for staff during installation</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 list-decimal list-inside">
                {service.checklist.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {item}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service ID</span>
                <span className="font-mono">{service.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span>{service.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span>{service.createdAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Updated</span>
                <span>{service.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
