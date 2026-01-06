"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Image,
    DollarSign,
    Clock,
    ListChecks,
    Plus,
    X,
    GripVertical,
    CheckCircle,
    Eye,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categories = [
    "Solar Installation",
    "Electrical",
    "Security Systems",
    "Water Systems",
    "Maintenance",
];

const defaultFeatures = [
    "Professional Installation",
    "Quality Materials",
    "Warranty Included",
    "24/7 Support",
    "Free Consultation",
];

export default function CreateServicePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        category: "",
        basePrice: "",
        priceType: "fixed",
        duration: "",
        durationUnit: "days",
        status: "draft",
    });
    const [features, setFeatures] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState("");
    const [checklist, setChecklist] = useState<string[]>([]);
    const [customChecklistItem, setCustomChecklistItem] = useState("");
    const [isPopular, setIsPopular] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const toggleFeature = (feature: string) => {
        if (features.includes(feature)) {
            setFeatures(features.filter((f) => f !== feature));
        } else {
            setFeatures([...features, feature]);
        }
    };

    const addCustomFeature = () => {
        if (customFeature.trim() && !features.includes(customFeature.trim())) {
            setFeatures([...features, customFeature.trim()]);
            setCustomFeature("");
        }
    };

    const addChecklistItem = () => {
        if (customChecklistItem.trim() && !checklist.includes(customChecklistItem.trim())) {
            setChecklist([...checklist, customChecklistItem.trim()]);
            setCustomChecklistItem("");
        }
    };

    const removeChecklistItem = (index: number) => {
        setChecklist(checklist.filter((_, i) => i !== index));
    };

    const removeFeature = (feature: string) => {
        setFeatures(features.filter((f) => f !== feature));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Service name is required";
        }
        if (!formData.shortDescription.trim()) {
            newErrors.shortDescription = "Short description is required";
        }
        if (!formData.category) {
            newErrors.category = "Please select a category";
        }
        if (!formData.basePrice.trim()) {
            newErrors.basePrice = "Base price is required";
        } else if (isNaN(Number(formData.basePrice))) {
            newErrors.basePrice = "Price must be a valid number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (asDraft: boolean = false) => {
        if (!asDraft && !validate()) return;

        setIsSubmitting(true);
        const serviceData = {
            ...formData,
            status: asDraft ? "draft" : formData.status,
            features,
            checklist,
            isPopular,
        };
        console.log(serviceData);

        // Simulate API call
        setTimeout(() => {
            router.push("/services-management");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Create New Service
                        </h1>
                        <p className="text-gray-500">Add a new service to your catalog</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                        Save as Draft
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting}
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        {isSubmitting ? (
                            "Creating..."
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Create Service
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Enter the main details of the service</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>
                                    Service Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="e.g., 5kW Solar Installation"
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Short Description <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.shortDescription}
                                    onChange={(e) => handleChange("shortDescription", e.target.value)}
                                    placeholder="Brief one-line description for listings"
                                    className={errors.shortDescription ? "border-red-500" : ""}
                                />
                                {errors.shortDescription && (
                                    <p className="text-sm text-red-500">{errors.shortDescription}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Full Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Detailed description of the service, what's included, benefits..."
                                    rows={5}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => handleChange("category", v)}
                                >
                                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        Base Price (USD) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={(e) => handleChange("basePrice", e.target.value)}
                                        placeholder="0.00"
                                        className={errors.basePrice ? "border-red-500" : ""}
                                    />
                                    {errors.basePrice && (
                                        <p className="text-sm text-red-500">{errors.basePrice}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Price Type</Label>
                                    <Select
                                        value={formData.priceType}
                                        onValueChange={(v) => handleChange("priceType", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed Price</SelectItem>
                                            <SelectItem value="starting">Starting From</SelectItem>
                                            <SelectItem value="hourly">Per Hour</SelectItem>
                                            <SelectItem value="quote">Quote Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        Estimated Duration
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => handleChange("duration", e.target.value)}
                                        placeholder="e.g., 3"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration Unit</Label>
                                    <Select
                                        value={formData.durationUnit}
                                        onValueChange={(v) => handleChange("durationUnit", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                            <SelectItem value="weeks">Weeks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                            <CardDescription>What&apos;s included in this service</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {defaultFeatures.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <Checkbox
                                            id={feature}
                                            checked={features.includes(feature)}
                                            onCheckedChange={() => toggleFeature(feature)}
                                        />
                                        <Label htmlFor={feature} className="cursor-pointer">
                                            {feature}
                                        </Label>
                                    </div>
                                ))}
                            </div>

                            {/* Custom Features Added */}
                            {features.filter((f) => !defaultFeatures.includes(f)).length > 0 && (
                                <div className="pt-3 border-t">
                                    <p className="text-sm text-gray-500 mb-2">Custom Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {features
                                            .filter((f) => !defaultFeatures.includes(f))
                                            .map((feature) => (
                                                <Badge
                                                    key={feature}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {feature}
                                                    <button onClick={() => removeFeature(feature)}>
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Add Custom Feature */}
                            <div className="flex gap-2 pt-3 border-t">
                                <Input
                                    value={customFeature}
                                    onChange={(e) => setCustomFeature(e.target.value)}
                                    placeholder="Add custom feature"
                                    onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                                />
                                <Button variant="outline" onClick={addCustomFeature}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Installation Checklist */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListChecks className="h-5 w-5" />
                                Installation Checklist
                            </CardTitle>
                            <CardDescription>
                                Tasks to be completed during installation (for staff reference)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {checklist.length > 0 && (
                                <div className="space-y-2">
                                    {checklist.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                                        >
                                            <GripVertical className="h-4 w-4 text-gray-400" />
                                            <span className="flex-1">{item}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeChecklistItem(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    value={customChecklistItem}
                                    onChange={(e) => setCustomChecklistItem(e.target.value)}
                                    placeholder="Add checklist item (e.g., Test all connections)"
                                    onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
                                />
                                <Button variant="outline" onClick={addChecklistItem}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select
                                value={formData.status}
                                onValueChange={(v) => handleChange("status", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-3 pt-2">
                                <Checkbox
                                    id="popular"
                                    checked={isPopular}
                                    onCheckedChange={(checked) => setIsPopular(checked === true)}
                                />
                                <div>
                                    <Label htmlFor="popular" className="cursor-pointer font-medium">
                                        Mark as Popular
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        Featured on homepage and listings
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="h-5 w-5" />
                                Service Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 mb-2">
                                    Click or drag to upload
                                </p>
                                <Button variant="outline" size="sm">
                                    Choose File
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border rounded-lg m-4 overflow-hidden">
                                <div className="h-24 bg-gradient-to-r from-blue-100 to-blue-200" />
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {isPopular && (
                                            <Badge style={{ backgroundColor: TROJAN_GOLD, color: "#000" }}>
                                                Popular
                                            </Badge>
                                        )}
                                        <Badge variant="outline">{formData.category || "Category"}</Badge>
                                    </div>
                                    <h3 className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                        {formData.name || "Service Name"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.shortDescription || "Short description..."}
                                    </p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="font-bold" style={{ color: TROJAN_NAVY }}>
                                            {formData.priceType === "quote" ? (
                                                "Get Quote"
                                            ) : formData.priceType === "starting" ? (
                                                <>From ${formData.basePrice || "0"}</>
                                            ) : formData.priceType === "hourly" ? (
                                                <>${formData.basePrice || "0"}/hr</>
                                            ) : (
                                                <>${formData.basePrice || "0"}</>
                                            )}
                                        </span>
                                        {formData.duration && (
                                            <span className="text-sm text-gray-500">
                                                ~{formData.duration} {formData.durationUnit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="border-green-100 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-green-800">Best Practices</h3>
                                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                                        <li>• Use clear, descriptive names</li>
                                        <li>• Include key features</li>
                                        <li>• Set realistic durations</li>
                                        <li>• Add a checklist for staff</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
