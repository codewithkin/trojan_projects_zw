"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { AuthModal } from "@/components/auth-modal";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const zimbabweLocations = [
    "Harare",
    "Bulawayo",
    "Mutare",
    "Gweru",
    "Kwekwe",
    "Kadoma",
    "Masvingo",
    "Chinhoyi",
    "Norton",
    "Marondera",
    "Ruwa",
    "Chitungwiza",
    "Bindura",
    "Beitbridge",
    "Redcliff",
    "Victoria Falls",
    "Hwange",
    "Chegutu",
    "Kariba",
    "Karoi",
    "Other",
];

interface Service {
    id: string;
    name: string;
    slug: string;
    category: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const { user } = useSession();
    const [loading, setLoading] = useState(false);
    const [fetchingServices, setFetchingServices] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [formData, setFormData] = useState({
        serviceId: "",
        location: "",
        price: "",
        scheduledDate: "",
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
        } finally {
            setFetchingServices(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check auth before submitting
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (!formData.serviceId) {
            toast.error("Please select a service");
            return;
        }

        if (!formData.location) {
            toast.error("Please select a location");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        serviceId: formData.serviceId,
                        location: formData.location,
                        price: formData.price ? parseFloat(formData.price) : null,
                        scheduledDate: formData.scheduledDate || null,
                        notes: formData.notes || null,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                toast.success("Project created successfully!");
                router.push("/");
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

    // If not logged in, show auth prompt
    if (!user) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="shadow-lg">
                            <CardContent className="pt-12 pb-12">
                                <div className="text-center">
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                    >
                                        <Lock size={40} style={{ color: TROJAN_NAVY }} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: TROJAN_NAVY }}>
                                        Sign In Required
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Please sign in to create a new project
                                    </p>
                                    <Button
                                        onClick={() => setShowAuthModal(true)}
                                        size="lg"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <AuthModal
                    open={showAuthModal}
                    onOpenChange={setShowAuthModal}
                    message="Sign in to create a new project"
                />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 transition-colors w-fit"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                        >
                            <ArrowLeft size={20} />
                            <span className="font-semibold">Back</span>
                        </button>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                            New Project
                        </h1>
                        <p className="text-gray-600">
                            Create a new project request
                        </p>
                    </div>

                {fetchingServices ? (
                    <Card className="shadow-lg">
                        <CardContent className="pt-12 pb-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: TROJAN_GOLD }}></div>
                                <p className="text-gray-600">Loading services...</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Form */}
                        <Card className="shadow-lg">
                            <CardHeader className="border-b" style={{ backgroundColor: `${TROJAN_NAVY}05` }}>
                                <CardTitle style={{ color: TROJAN_NAVY }}>Project Details</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Service Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="service" className="text-base font-medium">
                                            Service <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.serviceId}
                                            onValueChange={(value) => {
                                                if (value) {
                                                    setFormData({ ...formData, serviceId: value });
                                                }
                                            }}
                                        >
                                            <SelectTrigger id="service" className="w-full h-12 text-base">
                                                <SelectValue>
                                                    {formData.serviceId
                                                        ? services.find((s) => s.id === formData.serviceId)?.name || "Select a service"
                                                        : "Select a service"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        <div className="flex flex-col items-start">
                                                            <span className="font-medium">{service.name}</span>
                                                            <span className="text-sm text-gray-500">{service.category}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Location Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-base font-medium">
                                            Location <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.location}
                                            onValueChange={(value) => {
                                                if (value) {
                                                    setFormData({ ...formData, location: value });
                                                }
                                            }}
                                        >
                                            <SelectTrigger id="location" className="w-full h-12 text-base">
                                                <SelectValue>
                                                    {formData.location || "Select location"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80">
                                                {zimbabweLocations.map((location) => {
                                                    const isDisabled = location !== "Mutare";
                                                    return (
                                                        <SelectItem
                                                            key={location}
                                                            value={location}
                                                            disabled={isDisabled}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <span className={isDisabled ? "opacity-50" : ""}>
                                                                    {location}
                                                                </span>
                                                                {isDisabled && (
                                                                    <span className="text-xs text-gray-400 italic ml-2">
                                                                        Coming Soon
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Project Price */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-base font-medium">
                                            Project Price (Optional)
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 1250.00"
                                            className="h-12 text-base"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({ ...formData, price: e.target.value })
                                            }
                                        />
                                        <p className="text-sm text-gray-500">
                                            Agreed upon price in USD
                                        </p>
                                    </div>

                                    {/* Scheduled Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="scheduledDate" className="text-base font-medium">
                                            Scheduled Start Date (Optional)
                                        </Label>
                                        <Input
                                            id="scheduledDate"
                                            type="date"
                                            className="h-12 text-base"
                                            value={formData.scheduledDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, scheduledDate: e.target.value })
                                            }
                                        />
                                        <p className="text-sm text-gray-500">
                                            Format: YYYY-MM-DD (e.g., 2026-02-15)
                                        </p>
                                    </div>

                                    {/* Additional Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="text-base font-medium">
                                            Project Details (Optional)
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Describe what you need for this project..."
                                            className="min-h-30 text-base"
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({ ...formData, notes: e.target.value })
                                            }
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 h-12 text-base"
                                            onClick={() => router.back()}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 h-12 text-base font-semibold"
                                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                            disabled={loading}
                                        >
                                            {loading ? "Creating Project..." : "Create Project"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="mt-6 shadow-md border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-blue-900 mb-3 text-lg">
                                    What happens next?
                                </h3>
                                <ul className="space-y-3 text-sm text-blue-800">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-900 font-bold mt-0.5">•</span>
                                        <span>
                                            Your project request will be reviewed by our team
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-900 font-bold mt-0.5">•</span>
                                        <span>
                                            We&apos;ll contact you to confirm details and schedule the work
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-900 font-bold mt-0.5">•</span>
                                        <span>
                                            You can track progress from the home page once approved
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </>
                )}
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                message="Sign in to create a new project"
            />
        </>
    );
}
