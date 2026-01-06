"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Service {
    id: string;
    name: string;
    slug: string;
    category: string;
}

export default function NewQuotePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [formData, setFormData] = useState({
        serviceId: "",
        location: "",
        notes: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
            const data = await response.json();
            if (data.services) {
                setServices(data.services);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load services");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.serviceId || !formData.location) {
            toast.error("Please select a service and enter your location");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    serviceId: formData.serviceId,
                    location: formData.location,
                    notes: formData.notes || null,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Quote request submitted successfully!");
                router.push("/quotes");
            } else {
                toast.error(data.error || "Failed to submit quote");
            }
        } catch (error) {
            console.error("Error submitting quote:", error);
            toast.error("Failed to submit quote. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) {
            acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/quotes"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Quotes
                    </Link>
                    <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Request a Quote
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tell us about your project and we'll provide a detailed estimate
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Service Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="service">Service Type *</Label>
                                <Select
                                    value={formData.serviceId}
                                    onValueChange={(value) => {
                                        if (value) setFormData({ ...formData, serviceId: value });
                                    }}
                                >
                                    <SelectTrigger id="service" className="w-full h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(groupedServices).map(([category, categoryServices]) => (
                                            <SelectGroup key={category}>
                                                <SelectLabel>{category}</SelectLabel>
                                                {categoryServices.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Project Location *</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="e.g., Borrowdale, Harare"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Project Description */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Project Description</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Describe your project requirements, timeline, and any specific details..."
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    rows={5}
                                />
                                <p className="text-xs text-gray-500">
                                    Include any relevant details to help us provide an accurate quote
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit Quote Request"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="mt-6 border-blue-100 bg-blue-50">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Our team will review your quote request within 24 hours</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>We'll contact you to discuss project details and provide an estimate</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Once approved, you can start your project from the quotes page</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
