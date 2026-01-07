"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Loader2,
    Package,
    DollarSign,
    Star,
    Image as ImageIcon,
    Plus,
    X,
    Zap,
    Camera,
    Sparkles,
    Droplets,
    Flame,
    Tag,
    FileText,
    Wrench,
    Building2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ServiceForm {
    name: string;
    description: string;
    price: string;
    priceRange: string;
    category: string;
    featured: boolean;
    images: string[];
    brands: string[];
    supports: string[];
    specifications: Record<string, string>;
}

const categories = [
    { value: "solar", label: "Solar", icon: Zap, color: "#F59E0B" },
    { value: "cctv", label: "CCTV", icon: Camera, color: "#3B82F6" },
    { value: "electrical", label: "Electrical", icon: Sparkles, color: "#8B5CF6" },
    { value: "water", label: "Water", icon: Droplets, color: "#06B6D4" },
    { value: "welding", label: "Welding", icon: Flame, color: "#EF4444" },
];

export default function NewServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<ServiceForm>({
        name: "",
        description: "",
        price: "",
        priceRange: "",
        category: "",
        featured: false,
        images: [],
        brands: [],
        supports: [],
        specifications: {},
    });

    // Dynamic input states
    const [newBrand, setNewBrand] = useState("");
    const [newSupport, setNewSupport] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newSpecKey, setNewSpecKey] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.description || !form.price || !form.category) {
            toast.error("Please fill in all required fields");
            return;
        }

        const price = parseFloat(form.price);
        if (isNaN(price) || price <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: price,
                    priceRange: form.priceRange || null,
                    category: form.category,
                    featured: form.featured,
                    images: form.images,
                    brands: form.brands,
                    supports: form.supports,
                    specifications: Object.keys(form.specifications).length > 0 ? form.specifications : null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Service created successfully!");
                router.push("/services");
            } else {
                toast.error(data.error || "Failed to create service");
            }
        } catch (error) {
            console.error("Error creating service:", error);
            toast.error("Failed to create service");
        } finally {
            setLoading(false);
        }
    };

    const addBrand = () => {
        if (newBrand.trim() && !form.brands.includes(newBrand.trim())) {
            setForm({ ...form, brands: [...form.brands, newBrand.trim()] });
            setNewBrand("");
        }
    };

    const removeBrand = (brand: string) => {
        setForm({ ...form, brands: form.brands.filter((b) => b !== brand) });
    };

    const addSupport = () => {
        if (newSupport.trim() && !form.supports.includes(newSupport.trim())) {
            setForm({ ...form, supports: [...form.supports, newSupport.trim()] });
            setNewSupport("");
        }
    };

    const removeSupport = (support: string) => {
        setForm({ ...form, supports: form.supports.filter((s) => s !== support) });
    };

    const addImage = () => {
        if (newImageUrl.trim() && !form.images.includes(newImageUrl.trim())) {
            setForm({ ...form, images: [...form.images, newImageUrl.trim()] });
            setNewImageUrl("");
        }
    };

    const removeImage = (url: string) => {
        setForm({ ...form, images: form.images.filter((img) => img !== url) });
    };

    const addSpecification = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setForm({
                ...form,
                specifications: {
                    ...form.specifications,
                    [newSpecKey.trim()]: newSpecValue.trim(),
                },
            });
            setNewSpecKey("");
            setNewSpecValue("");
        }
    };

    const removeSpecification = (key: string) => {
        const updated = { ...form.specifications };
        delete updated[key];
        setForm({ ...form, specifications: updated });
    };

    const selectedCategory = categories.find((c) => c.value === form.category);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/services">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Add New Service
                    </h1>
                    <p className="text-gray-500">Create a new service offering for customers</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" style={{ color: TROJAN_NAVY }} />
                            Basic Information
                        </CardTitle>
                        <CardDescription>The main details of your service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Service Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Solar Panel Installation"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(value) => setForm({ ...form, category: value || "" })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                <div className="flex items-center gap-2">
                                                    <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                                                    {cat.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the service in detail..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" style={{ color: "#16A34A" }} />
                            Pricing
                        </CardTitle>
                        <CardDescription>Set the base price for this service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Base Price (USD) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        $
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="pl-8"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priceRange">Price Range (Optional)</Label>
                                <Input
                                    id="priceRange"
                                    placeholder="e.g., $500 - $2,000"
                                    value={form.priceRange}
                                    onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                                />
                                <p className="text-xs text-gray-500">
                                    Display a range if prices vary based on requirements
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Featured Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" style={{ color: TROJAN_GOLD }} />
                            Featured Status
                        </CardTitle>
                        <CardDescription>Highlight this service for customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                                <p className="font-medium">Featured Service</p>
                                <p className="text-sm text-gray-500">
                                    Featured services appear prominently on the home page
                                </p>
                            </div>
                            <Switch
                                checked={form.featured}
                                onCheckedChange={(checked: boolean) => setForm({ ...form, featured: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Brands */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" style={{ color: "#8B5CF6" }} />
                            Supported Brands
                        </CardTitle>
                        <CardDescription>Brands or manufacturers you work with</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Samsung, Hikvision"
                                value={newBrand}
                                onChange={(e) => setNewBrand(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBrand())}
                            />
                            <Button type="button" variant="outline" onClick={addBrand}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {form.brands.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.brands.map((brand) => (
                                    <Badge key={brand} variant="secondary" className="px-3 py-1">
                                        {brand}
                                        <button
                                            type="button"
                                            onClick={() => removeBrand(brand)}
                                            className="ml-2 hover:text-red-500"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Support Features */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" style={{ color: "#06B6D4" }} />
                            Support Features
                        </CardTitle>
                        <CardDescription>What&apos;s included with this service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., 24/7 Support, 2 Year Warranty"
                                value={newSupport}
                                onChange={(e) => setNewSupport(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSupport())}
                            />
                            <Button type="button" variant="outline" onClick={addSupport}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {form.supports.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.supports.map((support) => (
                                    <Badge key={support} variant="secondary" className="px-3 py-1">
                                        {support}
                                        <button
                                            type="button"
                                            onClick={() => removeSupport(support)}
                                            className="ml-2 hover:text-red-500"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Specifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" style={{ color: "#EF4444" }} />
                            Specifications
                        </CardTitle>
                        <CardDescription>Technical details or specifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Specification name"
                                value={newSpecKey}
                                onChange={(e) => setNewSpecKey(e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                placeholder="Value"
                                value={newSpecValue}
                                onChange={(e) => setNewSpecValue(e.target.value)}
                                className="flex-1"
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecification())}
                            />
                            <Button type="button" variant="outline" onClick={addSpecification}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {Object.keys(form.specifications).length > 0 && (
                            <div className="border rounded-lg divide-y">
                                {Object.entries(form.specifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between px-4 py-2">
                                        <div>
                                            <span className="font-medium">{key}:</span>{" "}
                                            <span className="text-gray-600">{value}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSpecification(key)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Images */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" style={{ color: "#F59E0B" }} />
                            Images
                        </CardTitle>
                        <CardDescription>Add image URLs for this service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                            />
                            <Button type="button" variant="outline" onClick={addImage}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {form.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {form.images.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "";
                                                    (e.target as HTMLImageElement).className = "hidden";
                                                }}
                                            />
                                            <ImageIcon className="h-8 w-8 text-gray-300 absolute" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(url)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/services">
                        <Button type="button" variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Service
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
