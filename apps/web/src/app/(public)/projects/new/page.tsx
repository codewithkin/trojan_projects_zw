"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

interface Quote {
    id: string;
    service: {
        id: string;
        name: string;
        category: string;
    };
    location: string;
    notes: string | null;
    estimatedPrice: number | null;
    status: string;
    hasProject?: boolean;
    createdAt: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const { user } = useSession();
    const [loading, setLoading] = useState(false);
    const [fetchingQuotes, setFetchingQuotes] = useState(true);
    const [approvedQuotes, setApprovedQuotes] = useState<Quote[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [formData, setFormData] = useState({
        quoteId: "",
        finalPrice: "",
        scheduledDate: "",
        notes: "",
    });

    useEffect(() => {
        // Only fetch if authenticated
        if (user) {
            fetchApprovedQuotes();
        } else {
            setFetchingQuotes(false);
        }
    }, [user]);

    const fetchApprovedQuotes = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quotes?status=approved`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (data.quotes) {
                // Filter quotes that don't have projects yet
                const quotesWithoutProjects = data.quotes.filter((q: Quote) => !q.hasProject);
                setApprovedQuotes(quotesWithoutProjects);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
            toast.error("Failed to load approved quotes");
        } finally {
            setFetchingQuotes(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check auth before submitting
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (!formData.quoteId) {
            toast.error("Please select an approved quote");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quotes/${formData.quoteId}/promote`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        finalPrice: formData.finalPrice ? parseFloat(formData.finalPrice) : null,
                        scheduledDate: formData.scheduledDate || null,
                        notes: formData.notes || null,
                    }),
                }
            );

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

    const selectedQuote = approvedQuotes.find((q) => q.id === formData.quoteId);

    // If not logged in, show auth prompt
    if (!user) {
        return (
            <>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <p className="text-5xl mb-3">🔒</p>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Sign In Required
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Please sign in to create a new project
                                </p>
                                <Button
                                    onClick={() => setShowAuthModal(true)}
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    Sign In
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
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
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/projects" as any)}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Projects
                    </button>
                    <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Start New Project
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Convert an approved quote into an active project
                    </p>
                </div>

                {fetchingQuotes ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading approved quotes...</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : approvedQuotes.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <p className="text-5xl mb-3">📋</p>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Approved Quotes
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    You need an approved quote before starting a project
                                </p>
                                <Button
                                    onClick={() => router.push("/quotes/new" as never)}
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    Request a Quote
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Quote Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="quote">Select Approved Quote *</Label>
                                        <Select
                                            value={formData.quoteId}
                                            onValueChange={(value) => {
                                                if (value) setFormData({ ...formData, quoteId: value });
                                            }}
                                        >
                                            <SelectTrigger id="quote" className="w-full h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {approvedQuotes.map((quote) => (
                                                    <SelectItem key={quote.id} value={quote.id}>
                                                        {quote.service.name} - {quote.location}
                                                        {quote.estimatedPrice && (
                                                            <span className="text-gray-500 ml-2">
                                                                (US${quote.estimatedPrice.toFixed(2)})
                                                            </span>
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Selected Quote Details */}
                                    {selectedQuote && (
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <h4 className="font-semibold text-blue-900 mb-2">
                                                Quote Details
                                            </h4>
                                            <div className="space-y-1 text-sm text-blue-800">
                                                <p>
                                                    <strong>Service:</strong> {selectedQuote.service.name}
                                                </p>
                                                <p>
                                                    <strong>Location:</strong> {selectedQuote.location}
                                                </p>
                                                {selectedQuote.notes && (
                                                    <p>
                                                        <strong>Notes:</strong> {selectedQuote.notes}
                                                    </p>
                                                )}
                                                {selectedQuote.estimatedPrice && (
                                                    <p>
                                                        <strong>Estimated Price:</strong> US$
                                                        {selectedQuote.estimatedPrice.toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Final Price */}
                                    <div className="space-y-2">
                                        <Label htmlFor="finalPrice">Final Price (Optional)</Label>
                                        <Input
                                            id="finalPrice"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 1250.00"
                                            value={formData.finalPrice}
                                            onChange={(e) =>
                                                setFormData({ ...formData, finalPrice: e.target.value })
                                            }
                                        />
                                        <p className="text-xs text-gray-500">
                                            Leave blank to use the estimated price from the quote
                                        </p>
                                    </div>

                                    {/* Scheduled Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="scheduledDate">Scheduled Start Date (Optional)</Label>
                                        <Input
                                            id="scheduledDate"
                                            type="date"
                                            value={formData.scheduledDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, scheduledDate: e.target.value })
                                            }
                                        />
                                    </div>

                                    {/* Additional Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Any additional information about the project..."
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({ ...formData, notes: e.target.value })
                                            }
                                            rows={4}
                                        />
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
                                            {loading ? "Creating Project..." : "Start Project"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="mt-6 border-blue-100 bg-blue-50">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    What happens next?
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-800">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            Your project will be created with a "scheduled" status
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            Our team will assign a technician and contact you to confirm
                                            details
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            You can track project progress from the projects page
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </>
                )}
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
