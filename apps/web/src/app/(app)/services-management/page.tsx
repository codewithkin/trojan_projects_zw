"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Upload,
    Star,
    Package,
    DollarSign,
    TrendingUp,
    X,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { StatsCard } from "@/components/stats-card";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Service {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    description: string;
    features: string[];
    image: string;
    isActive: boolean;
    isFeatured: boolean;
    totalSales: number;
    rating: number;
    reviewCount: number;
}

// Mock data
const initialServices: Service[] = [
    {
        id: "1",
        name: "5KVA Solar System",
        category: "Solar",
        basePrice: 800,
        description: "Complete 5KVA solar installation with panels, inverter, and batteries",
        features: ["8x 450W Panels", "5KVA Inverter", "4x 200Ah Batteries", "Installation Included"],
        image: "/services/solar-5kva.jpg",
        isActive: true,
        isFeatured: true,
        totalSales: 45,
        rating: 4.8,
        reviewCount: 38,
    },
    {
        id: "2",
        name: "10KVA Solar System",
        category: "Solar",
        basePrice: 1500,
        description: "High capacity 10KVA solar system for larger homes and businesses",
        features: ["16x 450W Panels", "10KVA Inverter", "8x 200Ah Batteries", "Monitoring App"],
        image: "/services/solar-10kva.jpg",
        isActive: true,
        isFeatured: true,
        totalSales: 22,
        rating: 4.9,
        reviewCount: 18,
    },
    {
        id: "3",
        name: "3KVA Inverter System",
        category: "Inverters",
        basePrice: 350,
        description: "Standalone inverter system with battery backup",
        features: ["3KVA Pure Sine Wave", "2x 200Ah Batteries", "Automatic Changeover"],
        image: "/services/inverter-3kva.jpg",
        isActive: true,
        isFeatured: false,
        totalSales: 68,
        rating: 4.7,
        reviewCount: 52,
    },
    {
        id: "4",
        name: "Electric Fence 100m",
        category: "Security",
        basePrice: 500,
        description: "100 meter electric fence installation with energizer",
        features: ["100m Fence Wire", "6000V Energizer", "Warning Signs", "Gate Handles"],
        image: "/services/fence.jpg",
        isActive: true,
        isFeatured: false,
        totalSales: 35,
        rating: 4.6,
        reviewCount: 28,
    },
    {
        id: "5",
        name: "Borehole Drilling",
        category: "Water",
        basePrice: 2500,
        description: "Professional borehole drilling and pump installation",
        features: ["Up to 80m Depth", "Submersible Pump", "Water Testing", "1 Year Warranty"],
        image: "/services/borehole.jpg",
        isActive: true,
        isFeatured: true,
        totalSales: 15,
        rating: 4.9,
        reviewCount: 12,
    },
    {
        id: "6",
        name: "Gate Motor Installation",
        category: "Security",
        basePrice: 450,
        description: "Automated gate motor with remote controls",
        features: ["500kg Capacity", "2 Remotes", "Battery Backup", "Safety Beam"],
        image: "/services/gate-motor.jpg",
        isActive: false,
        isFeatured: false,
        totalSales: 28,
        rating: 4.5,
        reviewCount: 22,
    },
];

const categories = ["All", "Solar", "Inverters", "Security", "Water", "CCTV"];

export default function ServicesManagementPage() {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        basePrice: 0,
        description: "",
        features: [] as string[],
        isActive: true,
        isFeatured: false,
    });
    const [newFeature, setNewFeature] = useState("");

    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || service.category === categoryFilter;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && service.isActive) ||
            (statusFilter === "inactive" && !service.isActive);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const totalRevenue = services.reduce((sum, s) => sum + s.basePrice * s.totalSales, 0);
    const activeServices = services.filter((s) => s.isActive).length;
    const avgRating = (
        services.reduce((sum, s) => sum + s.rating, 0) / services.length
    ).toFixed(1);

    const openCreateDialog = () => {
        setEditingService(null);
        setFormData({
            name: "",
            category: "",
            basePrice: 0,
            description: "",
            features: [],
            isActive: true,
            isFeatured: false,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            category: service.category,
            basePrice: service.basePrice,
            description: service.description,
            features: service.features,
            isActive: service.isActive,
            isFeatured: service.isFeatured,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (editingService) {
            // Update existing
            setServices(
                services.map((s) =>
                    s.id === editingService.id
                        ? { ...s, ...formData }
                        : s
                )
            );
        } else {
            // Create new
            const newService: Service = {
                id: Date.now().toString(),
                ...formData,
                image: "/services/default.jpg",
                totalSales: 0,
                rating: 0,
                reviewCount: 0,
            };
            setServices([...services, newService]);
        }
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        setServices(services.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
    };

    const toggleActive = (id: string) => {
        setServices(
            services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
        );
    };

    const toggleFeatured = (id: string) => {
        setServices(
            services.map((s) => (s.id === id ? { ...s, isFeatured: !s.isFeatured } : s))
        );
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Services Management
                    </h1>
                    <p className="text-gray-500">Manage your service catalog</p>
                </div>
                <Button onClick={openCreateDialog} style={{ backgroundColor: TROJAN_NAVY }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Services"
                    value={services.length}
                    change={`${activeServices} active`}
                    changeType="neutral"
                    icon={Package}
                    iconColor={TROJAN_NAVY}
                    iconBgColor="#E0E7FF"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`$${(totalRevenue / 1000).toFixed(0)}K`}
                    change="All time sales"
                    changeType="positive"
                    icon={DollarSign}
                    iconColor="#10B981"
                    iconBgColor="#D1FAE5"
                />
                <StatsCard
                    title="Avg Rating"
                    value={avgRating}
                    change="out of 5.0"
                    changeType="positive"
                    icon={Star}
                    iconColor="#F59E0B"
                    iconBgColor="#FEF3C7"
                />
                <StatsCard
                    title="Featured"
                    value={services.filter((s) => s.isFeatured).length}
                    change="On homepage"
                    changeType="neutral"
                    icon={TrendingUp}
                    iconColor="#3B82F6"
                    iconBgColor="#DBEAFE"
                />
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                    <Card key={service.id} className={!service.isActive ? "opacity-60" : ""}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        {service.isFeatured && (
                                            <Badge style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                                Featured
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline">{service.category}</Badge>
                                        {!service.isActive && <Badge variant="secondary">Inactive</Badge>}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditDialog(service)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleActive(service.id)}>
                                            {service.isActive ? (
                                                <>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Activate
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleFeatured(service.id)}>
                                            <Star className="mr-2 h-4 w-4" />
                                            {service.isFeatured ? "Remove Featured" : "Set Featured"}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => setDeleteConfirmId(service.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {service.features.slice(0, 3).map((feature, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                        {feature}
                                    </Badge>
                                ))}
                                {service.features.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{service.features.length - 3} more
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t">
                                <div>
                                    <p className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        ${service.basePrice}
                                    </p>
                                    <p className="text-xs text-gray-400">{service.totalSales} sales</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium">{service.rating}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{service.reviewCount} reviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No services found</p>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                        <DialogDescription>
                            {editingService
                                ? "Update the service details"
                                : "Create a new service for your catalog"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Service Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., 5KVA Solar System"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter((c) => c !== "All").map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Base Price ($)</Label>
                                <Input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={(e) =>
                                        setFormData({ ...formData, basePrice: Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                                className="w-full p-3 rounded-md border border-gray-200 text-sm resize-none"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the service..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Features</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Add a feature"
                                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                                />
                                <Button type="button" variant="outline" onClick={addFeature}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.features.map((feature, i) => (
                                    <Badge key={i} variant="secondary" className="gap-1">
                                        {feature}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeFeature(i)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isActive: checked as boolean })
                                    }
                                />
                                <Label htmlFor="active">Active</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isFeatured: checked as boolean })
                                    }
                                />
                                <Label htmlFor="featured">Featured</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} style={{ backgroundColor: TROJAN_NAVY }}>
                            {editingService ? "Update" : "Create"} Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Service</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this service? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
