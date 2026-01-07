"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useSession } from "@/hooks/use-session";
import { AuthModal } from "@/components/auth-modal";
import { env } from "@trojan_projects_zw/env/web";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Service {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    priceFormatted?: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useSession();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [formData, setFormData] = useState({
        serviceId: "",
        location: "",
        price: "",
        notes: "",
    });

    const serviceIdFromUrl = searchParams.get("serviceId");

    useEffect(() => {
        fetchServices();
    }, []);

    // Auto-select service when services are loaded and serviceId is in URL
    useEffect(() => {
        if (serviceIdFromUrl && services.length > 0 && !formData.serviceId) {
            const preSelectedService = services.find(s => s.id === serviceIdFromUrl);
            if (preSelectedService) {
                setFormData(prev => ({
                    ...prev,
                    serviceId: preSelectedService.id,
                    price: preSelectedService.price ? preSelectedService.price.toString() : "",
                }));
            }
        }
    }, [serviceIdFromUrl, services, formData.serviceId]);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/services`);
            const data = await response.json();
            if (data.services) {
                setServices(data.services);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load services");
        }
    };

    const handleServiceChange = (serviceId: string | null) => {
        if (!serviceId) return;
        const selectedService = services.find(s => s.id === serviceId);
        if (selectedService) {
            setFormData(prev => ({
                ...prev,
                serviceId: selectedService.id,
                price: selectedService.price ? selectedService.price.toString() : "",
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check auth before submitting
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (!formData.serviceId || !formData.location) {
            toast.error("Please select a service and enter your location");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    serviceId: formData.serviceId,
                    location: formData.location,
                    price: formData.price ? parseFloat(formData.price) : null,
                    notes: formData.notes || null,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Project created successfully!");
                router.push("/projects");
            } else {
                toast.error(data.error || "Failed to create project");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project. Please try again.");
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

    // Get selected service name for display
    const selectedService = services.find(s => s.id === formData.serviceId);

    return (
        <>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/services"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Services
                    </Link>
                    <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Request a Service
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tell us about your project and we&apos;ll get started right away
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
                                    onValueChange={handleServiceChange}
                                >
                                    <SelectTrigger id="service" className="w-full h-10">
                                        <SelectValue placeholder="Select a service">
                                            {selectedService?.name || "Select a service"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(groupedServices).map(([category, categoryServices]) => (
                                            <SelectGroup key={category}>
                                                <SelectLabel className="capitalize">{category}</SelectLabel>
                                                {categoryServices.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name} - ${service.price?.toLocaleString() || "0"}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price (auto-filled, read-only display) */}
                            {formData.price && (
                                <div className="space-y-2">
                                    <Label>Estimated Price</Label>
                                    <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        ${parseFloat(formData.price).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Final price may vary based on project requirements
                                    </p>
                                </div>
                            )}

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
                                    Include any relevant details to help us understand your needs
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
                                    {loading ? "Creating..." : "Create Project"}
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
                                <span>Our team will review your project request within 24 hours</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>We&apos;ll contact you to confirm project details and schedule</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Track your project progress from your dashboard</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Auth Modal */}
            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                message="Sign in to create a project"
            />
        </>
    );
}
