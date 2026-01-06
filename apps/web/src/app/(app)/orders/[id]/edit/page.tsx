"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    User,
    Package,
    Calendar,
    DollarSign,
    Clock,
    MapPin,
    AlertCircle,
    FileText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock existing order data
const existingOrder = {
    id: "ORD-2024-0045",
    customer: {
        id: "1",
        name: "John Moyo",
        email: "john.moyo@example.com",
        phone: "+263 77 123 4567",
        address: "123 Greendale, Harare",
    },
    service: {
        id: "1",
        name: "5kW Solar Installation",
        price: 3500,
    },
    status: "in_progress",
    priority: "normal",
    scheduledDate: "2024-01-20",
    scheduledTime: "09:00",
    assignedStaff: "Tendai Moyo",
    notes: "Customer prefers morning installations. Gate code: 1234",
    amount: 3500,
    discount: 0,
    paymentStatus: "partial",
    paidAmount: 1750,
};

const statusOptions = [
    { value: "pending", label: "Pending", description: "Order created, awaiting confirmation" },
    { value: "confirmed", label: "Confirmed", description: "Order confirmed, awaiting scheduling" },
    { value: "in_progress", label: "In Progress", description: "Work has started" },
    { value: "completed", label: "Completed", description: "Work finished" },
    { value: "cancelled", label: "Cancelled", description: "Order cancelled" },
];

const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
];

const staffOptions = [
    { value: "tendai", label: "Tendai Moyo" },
    { value: "gift", label: "Gift Ncube" },
    { value: "brian", label: "Brian Chikwanha" },
    { value: "farai", label: "Farai Mutendi" },
];

const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partially Paid" },
    { value: "paid", label: "Fully Paid" },
    { value: "refunded", label: "Refunded" },
];

export default function EditOrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [formData, setFormData] = useState({
        status: existingOrder.status,
        priority: existingOrder.priority,
        scheduledDate: existingOrder.scheduledDate,
        scheduledTime: existingOrder.scheduledTime,
        assignedStaff: existingOrder.assignedStaff,
        notes: existingOrder.notes,
        discount: existingOrder.discount.toString(),
        paymentStatus: existingOrder.paymentStatus,
        paidAmount: existingOrder.paidAmount.toString(),
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        console.log("Saving order:", { orderId, ...formData });

        // Simulate API call
        setTimeout(() => {
            router.push(`/orders/${orderId}`);
        }, 1000);
    };

    const hasChanges = () => {
        return (
            formData.status !== existingOrder.status ||
            formData.priority !== existingOrder.priority ||
            formData.scheduledDate !== existingOrder.scheduledDate ||
            formData.scheduledTime !== existingOrder.scheduledTime ||
            formData.assignedStaff !== existingOrder.assignedStaff ||
            formData.notes !== existingOrder.notes ||
            formData.discount !== existingOrder.discount.toString() ||
            formData.paymentStatus !== existingOrder.paymentStatus ||
            formData.paidAmount !== existingOrder.paidAmount.toString()
        );
    };

    const handleBack = () => {
        if (hasChanges()) {
            setShowDiscardDialog(true);
        } else {
            router.back();
        }
    };

    const finalAmount = existingOrder.amount - Number(formData.discount || 0);
    const remainingBalance = finalAmount - Number(formData.paidAmount || 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Edit Order
                        </h1>
                        <p className="text-gray-500">{existingOrder.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleBack}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        {isSubmitting ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status & Priority */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                            <CardDescription>Update the current status and priority</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v) => handleChange("status", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(v) => handleChange("priority", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scheduling */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Scheduling
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Scheduled Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => handleChange("scheduledDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Scheduled Time</Label>
                                    <Input
                                        type="time"
                                        value={formData.scheduledTime}
                                        onChange={(e) => handleChange("scheduledTime", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Assigned Staff</Label>
                                <Select
                                    value={formData.assignedStaff.toLowerCase().split(" ")[0]}
                                    onValueChange={(v) => {
                                        const staff = staffOptions.find((s) => s.value === v);
                                        if (staff) handleChange("assignedStaff", staff.label);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staffOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Payment Status</Label>
                                    <Select
                                        value={formData.paymentStatus}
                                        onValueChange={(v) => handleChange("paymentStatus", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentStatusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount Paid ($)</Label>
                                    <Input
                                        type="number"
                                        value={formData.paidAmount}
                                        onChange={(e) => handleChange("paidAmount", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Discount ($)</Label>
                                    <Input
                                        type="number"
                                        value={formData.discount}
                                        onChange={(e) => handleChange("discount", e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service Price:</span>
                                    <span>${existingOrder.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Discount:</span>
                                    <span className="text-red-500">-${formData.discount || 0}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Final Amount:</span>
                                    <span>${finalAmount}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Balance Due:</span>
                                    <span className={remainingBalance > 0 ? "text-red-500" : "text-green-500"}>
                                        ${remainingBalance}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                placeholder="Add notes about this order..."
                                rows={4}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info (Read-only) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                        {existingOrder.customer.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{existingOrder.customer.name}</p>
                                    <p className="text-sm text-gray-500">{existingOrder.customer.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    {existingOrder.customer.address}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Info (Read-only) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Service
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium">{existingOrder.service.name}</p>
                                <p className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>
                                    ${existingOrder.service.price}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                To change the service, please create a new order.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Unsaved Changes Alert */}
                    {hasChanges() && (
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-yellow-800">Unsaved Changes</h3>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Remember to save your changes.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Discard Dialog */}
            <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Discard Changes?</DialogTitle>
                        <DialogDescription>
                            You have unsaved changes. Are you sure you want to leave?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
                            Keep Editing
                        </Button>
                        <Button variant="destructive" onClick={() => router.back()}>
                            Discard Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
