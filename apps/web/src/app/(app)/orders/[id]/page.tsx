"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    Truck,
    FileText,
    MessageSquare,
    Edit,
    Download,
    Send,
    Plus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock order data
const orderData = {
    id: "ORD-2024-001",
    status: "in-progress",
    paymentStatus: "paid",
    customer: {
        name: "John Mukamuri",
        email: "john.mukamuri@example.com",
        phone: "+263 77 123 4567",
        address: "123 Samora Machel Ave, Harare",
        avatar: "",
        initials: "JM",
    },
    service: {
        name: "5KVA Solar System",
        category: "Solar",
        description: "Complete 5KVA solar installation with panels, inverter, and batteries",
        features: ["8x 450W Panels", "5KVA Inverter", "4x 200Ah Batteries", "Installation Included"],
    },
    pricing: {
        subtotal: 800,
        discount: 50,
        tax: 0,
        total: 750,
    },
    dates: {
        ordered: "2024-01-10",
        scheduled: "2024-01-15",
        estimated: "2024-01-17",
    },
    assignedStaff: {
        name: "Tendai Moyo",
        role: "Senior Technician",
        phone: "+263 77 987 6543",
        initials: "TM",
    },
    timeline: [
        { date: "2024-01-10", time: "10:30 AM", event: "Order placed", status: "completed" },
        { date: "2024-01-10", time: "11:00 AM", event: "Payment received", status: "completed" },
        { date: "2024-01-11", time: "09:00 AM", event: "Order confirmed", status: "completed" },
        { date: "2024-01-12", time: "02:00 PM", event: "Staff assigned", status: "completed" },
        { date: "2024-01-15", time: "08:00 AM", event: "Installation scheduled", status: "current" },
        { date: "2024-01-17", time: "", event: "Estimated completion", status: "pending" },
    ],
    notes: [
        {
            id: 1,
            author: "Admin",
            date: "2024-01-11",
            content: "Customer prefers morning installation. Access from back gate.",
        },
        {
            id: 2,
            author: "Tendai Moyo",
            date: "2024-01-12",
            content: "Site inspection completed. Roof is suitable for panel mounting.",
        },
    ],
};

const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "#FEF3C7", text: "#D97706" },
    confirmed: { bg: "#DBEAFE", text: "#2563EB" },
    "in-progress": { bg: "#E0E7FF", text: TROJAN_NAVY },
    completed: { bg: "#D1FAE5", text: "#059669" },
    cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

const paymentColors: Record<string, { bg: string; text: string }> = {
    paid: { bg: "#D1FAE5", text: "#059669" },
    pending: { bg: "#FEF3C7", text: "#D97706" },
    partial: { bg: "#DBEAFE", text: "#2563EB" },
    refunded: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function OrderDetailPage() {
    const { isAuthorized, isLoading } = useAdminGuard();
    const params = useParams();
    const router = useRouter();
    const [status, setStatus] = useState(orderData.status);
    const [showNoteDialog, setShowNoteDialog] = useState(false);
    const [newNote, setNewNote] = useState("");

    // Don't render if not authorized
    if (isLoading || !isAuthorized) {
        return null;
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-600" />;
            case "in-progress":
                return <Truck className="h-5 w-5" style={{ color: TROJAN_NAVY }} />;
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                {orderData.id}
                            </h1>
                            <Badge
                                style={{
                                    backgroundColor: statusColors[status]?.bg,
                                    color: statusColors[status]?.text,
                                }}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                            </Badge>
                            <Badge
                                style={{
                                    backgroundColor: paymentColors[orderData.paymentStatus]?.bg,
                                    color: paymentColors[orderData.paymentStatus]?.text,
                                }}
                            >
                                {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                            </Badge>
                        </div>
                        <p className="text-gray-500">
                            Ordered on {new Date(orderData.dates.ordered).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/orders/${params.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Invoice
                    </Button>
                    <Button variant="outline">
                        <Send className="mr-2 h-4 w-4" />
                        Email Customer
                    </Button>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Service Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{orderData.service.name}</h3>
                                    <Badge variant="outline" className="mt-1">
                                        {orderData.service.category}
                                    </Badge>
                                    <p className="text-gray-500 mt-2">{orderData.service.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {orderData.service.features.map((feature, i) => (
                                            <Badge key={i} variant="secondary">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        ${orderData.pricing.total}
                                    </p>
                                    {orderData.pricing.discount > 0 && (
                                        <p className="text-sm text-gray-400 line-through">
                                            ${orderData.pricing.subtotal}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Order Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {orderData.timeline.map((event, index) => (
                                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className={`w-3 h-3 rounded-full ${event.status === "completed"
                                                    ? "bg-green-500"
                                                    : event.status === "current"
                                                        ? "bg-blue-500 ring-4 ring-blue-100"
                                                        : "bg-gray-300"
                                                    }`}
                                            />
                                            {index < orderData.timeline.length - 1 && (
                                                <div
                                                    className={`w-0.5 flex-1 mt-2 ${event.status === "completed" ? "bg-green-200" : "bg-gray-200"
                                                        }`}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <p className="font-medium">{event.event}</p>
                                            <p className="text-sm text-gray-500">
                                                {event.date} {event.time && `at ${event.time}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Notes
                            </CardTitle>
                            <Button size="sm" variant="outline" onClick={() => setShowNoteDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Note
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orderData.notes.map((note) => (
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={orderData.customer.avatar} />
                                    <AvatarFallback>{orderData.customer.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{orderData.customer.name}</p>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{orderData.customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{orderData.customer.phone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <span>{orderData.customer.address}</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message Customer
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Assigned Staff */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Assigned Staff
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>{orderData.assignedStaff.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{orderData.assignedStaff.name}</p>
                                    <p className="text-sm text-gray-500">{orderData.assignedStaff.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm mb-4">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{orderData.assignedStaff.phone}</span>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Change Assignment
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Scheduled</span>
                                    <span className="font-medium">
                                        {new Date(orderData.dates.scheduled).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Estimated</span>
                                    <span className="font-medium">
                                        {new Date(orderData.dates.estimated).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                <Calendar className="mr-2 h-4 w-4" />
                                Reschedule
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>${orderData.pricing.subtotal}</span>
                                </div>
                                {orderData.pricing.discount > 0 && (
                                    <div className="flex items-center justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-${orderData.pricing.discount}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex items-center justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${orderData.pricing.total}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Note Dialog */}
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                        <DialogDescription>Add a note to this order for internal reference</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <textarea
                            className="w-full p-3 rounded-md border border-gray-200 text-sm resize-none"
                            rows={4}
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Enter your note..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => setShowNoteDialog(false)}
                            style={{ backgroundColor: TROJAN_NAVY }}
                        >
                            Add Note
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
