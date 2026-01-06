"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    FileText,
    Tag,
    Save,
    X,
    Plus,
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

const cities = ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Kwekwe", "Kadoma", "Masvingo"];
const sources = ["Website", "Referral", "Social Media", "Walk-in", "Phone Inquiry", "Other"];
const presetTags = ["VIP", "Solar Customer", "Commercial", "Residential", "Returning"];

export default function CreateCustomerPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        address: "",
        city: "",
        postalCode: "",
        company: "",
        source: "",
        notes: "",
        sendWelcomeEmail: true,
    });
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string | boolean) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setNewTag("");
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // In real app, submit to API
        console.log({ ...formData, tags });
        router.push("/customers");
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
                            Add New Customer
                        </h1>
                        <p className="text-gray-500">Create a new customer record</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} style={{ backgroundColor: TROJAN_NAVY }}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Customer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        placeholder="Enter first name"
                                        className={errors.firstName ? "border-red-500" : ""}
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-red-500">{errors.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        placeholder="Enter last name"
                                        className={errors.lastName ? "border-red-500" : ""}
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-red-500">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="customer@example.com"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        Phone <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        placeholder="+263 77 XXX XXXX"
                                        className={errors.phone ? "border-red-500" : ""}
                                    />
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        Alternate Phone
                                    </Label>
                                    <Input
                                        type="tel"
                                        value={formData.alternatePhone}
                                        onChange={(e) => handleChange("alternatePhone", e.target.value)}
                                        placeholder="+263 77 XXX XXXX"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Street Address</Label>
                                <Textarea
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    placeholder="Enter full street address"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Select
                                        value={formData.city}
                                        onValueChange={(v) => handleChange("city", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city} value={city}>
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Postal Code</Label>
                                    <Input
                                        value={formData.postalCode}
                                        onChange={(e) => handleChange("postalCode", e.target.value)}
                                        placeholder="Enter postal code"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        Company (Optional)
                                    </Label>
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => handleChange("company", e.target.value)}
                                        placeholder="Company name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>How did they find us?</Label>
                                    <Select
                                        value={formData.source}
                                        onValueChange={(v) => handleChange("source", v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sources.map((source) => (
                                                <SelectItem key={source} value={source}>
                                                    {source}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                    placeholder="Any additional notes about the customer..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Tags
                            </CardTitle>
                            <CardDescription>Categorize this customer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="cursor-pointer gap-1"
                                        onClick={() => removeTag(tag)}
                                    >
                                        {tag}
                                        <X className="h-3 w-3" />
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add custom tag"
                                    onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
                                />
                                <Button variant="outline" size="icon" onClick={() => addTag(newTag)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="pt-2 border-t">
                                <p className="text-sm text-gray-500 mb-2">Quick add:</p>
                                <div className="flex flex-wrap gap-1">
                                    {presetTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className={`cursor-pointer ${tags.includes(tag) ? "opacity-50" : ""}`}
                                            onClick={() => !tags.includes(tag) && addTag(tag)}
                                        >
                                            + {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="welcomeEmail"
                                    checked={formData.sendWelcomeEmail}
                                    onCheckedChange={(checked) => handleChange("sendWelcomeEmail", checked as boolean)}
                                />
                                <Label htmlFor="welcomeEmail" className="cursor-pointer">
                                    Send welcome email
                                </Label>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 ml-6">
                                An email will be sent to the customer with account details
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quick Tips */}
                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="pt-6">
                            <h3 className="font-medium mb-2" style={{ color: TROJAN_NAVY }}>
                                Quick Tips
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Use tags to easily filter customers later</li>
                                <li>• Add notes about preferences or requirements</li>
                                <li>• Verify phone numbers before saving</li>
                                <li>• Complete addresses help with service scheduling</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
