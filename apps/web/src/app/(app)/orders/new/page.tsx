"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Search,
    User,
    Package,
    Calendar,
    Clock,
    DollarSign,
    Plus,
    X,
    Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock data
const customers = [
    { id: "1", name: "John Mukamuri", email: "john@example.com", phone: "+263 77 123 4567", initials: "JM" },
    { id: "2", name: "Sarah Dziva", email: "sarah@example.com", phone: "+263 77 234 5678", initials: "SD" },
    { id: "3", name: "Peter Moyo", email: "peter@example.com", phone: "+263 77 345 6789", initials: "PM" },
    { id: "4", name: "Grace Ncube", email: "grace@example.com", phone: "+263 77 456 7890", initials: "GN" },
];

const services = [
    { id: "1", name: "5KVA Solar System", category: "Solar", price: 800, description: "Complete 5KVA solar installation" },
    { id: "2", name: "10KVA Solar System", category: "Solar", price: 1500, description: "High capacity 10KVA system" },
    { id: "3", name: "3KVA Inverter", category: "Inverters", price: 350, description: "Standalone inverter with batteries" },
    { id: "4", name: "Electric Fence 100m", category: "Security", price: 500, description: "100m electric fence installation" },
    { id: "5", name: "Gate Motor", category: "Security", price: 450, description: "Automated gate motor with remotes" },
    { id: "6", name: "Borehole Drilling", category: "Water", price: 2500, description: "Professional borehole drilling" },
];

const staff = [
    { id: "1", name: "Tendai Moyo", role: "Senior Technician", initials: "TM" },
    { id: "2", name: "Blessing Ncube", role: "Technician", initials: "BN" },
    { id: "3", name: "Tapiwa Dube", role: "Junior Technician", initials: "TD" },
];

interface OrderItem {
    service: typeof services[0];
    quantity: number;
}

export default function CreateOrderPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string>("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [notes, setNotes] = useState("");
    const [discount, setDiscount] = useState(0);
    const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
            c.phone.includes(customerSearch)
    );

    const addService = (service: typeof services[0]) => {
        const existing = orderItems.find((item) => item.service.id === service.id);
        if (existing) {
            setOrderItems(
                orderItems.map((item) =>
                    item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setOrderItems([...orderItems, { service, quantity: 1 }]);
        }
    };

    const removeService = (serviceId: string) => {
        setOrderItems(orderItems.filter((item) => item.service.id !== serviceId));
    };

    const updateQuantity = (serviceId: string, quantity: number) => {
        if (quantity < 1) return;
        setOrderItems(
            orderItems.map((item) =>
                item.service.id === serviceId ? { ...item, quantity } : item
            )
        );
    };

    const subtotal = orderItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
    const total = subtotal - discount;

    const canProceed = () => {
        switch (step) {
            case 1:
                return selectedCustomer !== null;
            case 2:
                return orderItems.length > 0;
            case 3:
                return selectedStaff && scheduledDate;
            default:
                return true;
        }
    };

    const handleSubmit = () => {
        // In real app, submit order to API
        console.log({
            customer: selectedCustomer,
            items: orderItems,
            staff: selectedStaff,
            scheduledDate,
            scheduledTime,
            notes,
            discount,
            total,
        });
        router.push("/orders");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Create Order
                    </h1>
                    <p className="text-gray-500">Create a new customer order</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                {[
                    { num: 1, label: "Customer" },
                    { num: 2, label: "Services" },
                    { num: 3, label: "Schedule" },
                    { num: 4, label: "Review" },
                ].map((s, i) => (
                    <div key={s.num} className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step > s.num
                                    ? "bg-green-500 text-white"
                                    : step === s.num
                                        ? "text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            style={step === s.num ? { backgroundColor: TROJAN_NAVY } : {}}
                        >
                            {step > s.num ? <Check className="h-5 w-5" /> : s.num}
                        </div>
                        <span className={`ml-2 text-sm ${step >= s.num ? "font-medium" : "text-gray-400"}`}>
                            {s.label}
                        </span>
                        {i < 3 && <div className="w-16 h-0.5 mx-4 bg-gray-200" />}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="max-w-4xl mx-auto">
                {/* Step 1: Select Customer */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Select Customer
                            </CardTitle>
                            <CardDescription>Choose an existing customer or create a new one</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, or phone..."
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline" onClick={() => setShowNewCustomerDialog(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Customer
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredCustomers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedCustomer?.id === customer.id
                                                ? "border-2"
                                                : "hover:bg-gray-50"
                                            }`}
                                        style={
                                            selectedCustomer?.id === customer.id
                                                ? { borderColor: TROJAN_NAVY, backgroundColor: "#F0F4FF" }
                                                : {}
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{customer.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{customer.name}</p>
                                                <p className="text-sm text-gray-500">{customer.email}</p>
                                                <p className="text-sm text-gray-400">{customer.phone}</p>
                                            </div>
                                            {selectedCustomer?.id === customer.id && (
                                                <Check className="ml-auto h-5 w-5" style={{ color: TROJAN_NAVY }} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Select Services */}
                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Select Services
                                    </CardTitle>
                                    <CardDescription>Add services to the order</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {services.map((service) => (
                                            <div
                                                key={service.id}
                                                className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                                                onClick={() => addService(service)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium">{service.name}</p>
                                                        <Badge variant="outline" className="mt-1">
                                                            {service.category}
                                                        </Badge>
                                                        <p className="text-sm text-gray-500 mt-2">{service.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold" style={{ color: TROJAN_NAVY }}>
                                                            ${service.price}
                                                        </p>
                                                        <Button size="sm" variant="ghost" className="mt-2">
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {orderItems.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No services added yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orderItems.map((item) => (
                                            <div key={item.service.id} className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.service.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        ${item.service.price} × {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 w-6 p-0 text-red-500"
                                                        onClick={() => removeService(item.service.id)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span>${subtotal}</span>
                                            </div>
                                            <div className="flex justify-between font-bold mt-2">
                                                <span>Total</span>
                                                <span>${total}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Schedule & Assignment
                            </CardTitle>
                            <CardDescription>Set the installation date and assign staff</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Scheduled Date</Label>
                                        <Input
                                            type="date"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Preferred Time</Label>
                                        <Select value={scheduledTime} onValueChange={setScheduledTime}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time slot" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                                                <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                                                <SelectItem value="evening">Evening (4 PM - 6 PM)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Assign Staff</Label>
                                        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select technician" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {staff.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.name} - {s.role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Order Notes</Label>
                                        <Textarea
                                            placeholder="Any special instructions or notes..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Order</CardTitle>
                            <CardDescription>Confirm the order details before submitting</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer */}
                                <div className="p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Customer
                                    </h3>
                                    {selectedCustomer && (
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{selectedCustomer.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{selectedCustomer.name}</p>
                                                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                                                <p className="text-sm text-gray-400">{selectedCustomer.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Schedule */}
                                <div className="p-4 rounded-lg bg-gray-50">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Schedule
                                    </h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="text-gray-500">Date:</span>{" "}
                                            {scheduledDate ? new Date(scheduledDate).toLocaleDateString() : "-"}
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Time:</span>{" "}
                                            {scheduledTime
                                                ? scheduledTime === "morning"
                                                    ? "8 AM - 12 PM"
                                                    : scheduledTime === "afternoon"
                                                        ? "12 PM - 4 PM"
                                                        : "4 PM - 6 PM"
                                                : "-"}
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Assigned:</span>{" "}
                                            {staff.find((s) => s.id === selectedStaff)?.name || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Services
                                </h3>
                                <div className="space-y-2">
                                    {orderItems.map((item) => (
                                        <div key={item.service.id} className="flex justify-between">
                                            <span>
                                                {item.service.name} × {item.quantity}
                                            </span>
                                            <span className="font-medium">${item.service.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="p-4 rounded-lg border-2" style={{ borderColor: TROJAN_NAVY }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Label>Discount ($)</Label>
                                    <Input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-24"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>${subtotal}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-${discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span style={{ color: TROJAN_NAVY }}>${total}</span>
                                    </div>
                                </div>
                            </div>

                            {notes && (
                                <div className="p-4 rounded-lg bg-yellow-50">
                                    <h3 className="font-medium mb-2">Notes</h3>
                                    <p className="text-sm text-gray-600">{notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between max-w-4xl mx-auto">
                <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                    Back
                </Button>
                {step < 4 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} style={{ backgroundColor: TROJAN_NAVY }}>
                        Create Order
                    </Button>
                )}
            </div>

            {/* New Customer Dialog */}
            <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                        <DialogDescription>Create a new customer record</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="Enter customer name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="Enter email address" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input type="tel" placeholder="+263 77 XXX XXXX" />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Textarea placeholder="Enter full address" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                            Cancel
                        </Button>
                        <Button style={{ backgroundColor: TROJAN_NAVY }}>Add Customer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
