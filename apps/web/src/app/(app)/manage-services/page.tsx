"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
    Package,
    Plus,
    Search,
    Star,
    RefreshCw,
    Loader2,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    TrendingUp,
    DollarSign,
    FolderOpen,
    Sparkles,
    Zap,
    Camera,
    Droplets,
    Flame,
    Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Service {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    priceFormatted: string;
    category: "solar" | "cctv" | "electrical" | "water" | "welding";
    featured: boolean;
    images: string[];
    brands: string[];
    supports: string[];
    rating: number;
    reviewCount: number;
    likesCount: number;
    requestsCount: number;
    projectsCount: number;
    quotesCount: number;
    createdAt: string;
}

const categoryIcons: Record<string, React.ElementType> = {
    solar: Zap,
    cctv: Camera,
    electrical: Sparkles,
    water: Droplets,
    welding: Flame,
};

const categoryColors: Record<string, string> = {
    solar: "#F59E0B",
    cctv: "#3B82F6",
    electrical: "#8B5CF6",
    water: "#06B6D4",
    welding: "#EF4444",
};

export default function ServicesPage() {
    const { isAuthorized, isLoading } = useAdminGuard();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; service: Service | null }>({
        open: false,
        service: null,
    });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthorized) {
            fetchServices();
        }
    }, [isLoading, isAuthorized]);

    // Don't render if not authorized
    if (isLoading || !isAuthorized) {
        return null;
    }

    const fetchServices = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setServices(data.services || []);
            } else {
                toast.error("Failed to fetch services");
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to fetch services");
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);
        const avgPrice = services.length > 0 ? totalRevenue / services.length : 0;
        const featuredCount = services.filter((s) => s.featured).length;
        const totalProjects = services.reduce((sum, s) => sum + s.projectsCount, 0);
        const totalQuotes = services.reduce((sum, s) => sum + s.quotesCount, 0);

        const categoryBreakdown = services.reduce((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: services.length,
            featured: featuredCount,
            avgPrice,
            totalProjects,
            totalQuotes,
            categoryBreakdown,
            solar: services.filter((s) => s.category === "solar").length,
            cctv: services.filter((s) => s.category === "cctv").length,
            electrical: services.filter((s) => s.category === "electrical").length,
            water: services.filter((s) => s.category === "water").length,
            welding: services.filter((s) => s.category === "welding").length,
        };
    }, [services]);

    const filteredServices = useMemo(() => {
        let filtered = services;

        // Filter by tab
        if (activeTab !== "all") {
            if (activeTab === "featured") {
                filtered = filtered.filter((s) => s.featured);
            } else {
                filtered = filtered.filter((s) => s.category === activeTab);
            }
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.name.toLowerCase().includes(query) ||
                    s.description.toLowerCase().includes(query) ||
                    s.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [services, activeTab, searchQuery]);

    const handleDelete = async () => {
        if (!deleteDialog.service) return;

        setDeleting(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/services/${deleteDialog.service.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success("Service deleted successfully");
                setDeleteDialog({ open: false, service: null });
                fetchServices();
            } else {
                toast.error(data.error || "Failed to delete service");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Failed to delete service");
        } finally {
            setDeleting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const statsCards = [
        {
            title: "Total Services",
            value: stats.total,
            description: `${stats.featured} featured`,
            icon: Package,
            color: TROJAN_NAVY,
        },
        {
            title: "Avg. Service Price",
            value: formatPrice(stats.avgPrice),
            description: "Per service",
            icon: DollarSign,
            color: "#16A34A",
        },
        {
            title: "Total Projects",
            value: stats.totalProjects,
            description: `${stats.totalQuotes} quotes received`,
            icon: FolderOpen,
            color: "#3B82F6",
        },
        {
            title: "Featured Services",
            value: stats.featured,
            description: "Highlighted for customers",
            icon: Star,
            color: TROJAN_GOLD,
        },
    ];

    const getCategoryIcon = (category: string) => {
        const Icon = categoryIcons[category] || Package;
        return Icon;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Services
                    </h1>
                    <p className="text-gray-500">Manage your products and services catalog</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchServices} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Link href="/manage-services/new">
                        <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Service
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                {stat.value}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Services by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(stats.categoryBreakdown).map(([category, count]) => {
                            const Icon = getCategoryIcon(category);
                            const color = categoryColors[category];
                            return (
                                <div
                                    key={category}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                                    style={{ borderColor: color }}
                                >
                                    <Icon className="h-4 w-4" style={{ color }} />
                                    <span className="font-medium capitalize">{category}</span>
                                    <Badge variant="secondary">{count}</Badge>
                                </div>
                            );
                        })}
                        {Object.keys(stats.categoryBreakdown).length === 0 && (
                            <p className="text-gray-500 text-sm">No services yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex-wrap h-auto gap-1">
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="featured">
                        <Star className="h-3 w-3 mr-1" />
                        Featured ({stats.featured})
                    </TabsTrigger>
                    <TabsTrigger value="solar">
                        <Zap className="h-3 w-3 mr-1" />
                        Solar ({stats.solar})
                    </TabsTrigger>
                    <TabsTrigger value="cctv">
                        <Camera className="h-3 w-3 mr-1" />
                        CCTV ({stats.cctv})
                    </TabsTrigger>
                    <TabsTrigger value="electrical">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Electrical ({stats.electrical})
                    </TabsTrigger>
                    <TabsTrigger value="water">
                        <Droplets className="h-3 w-3 mr-1" />
                        Water ({stats.water})
                    </TabsTrigger>
                    <TabsTrigger value="welding">
                        <Flame className="h-3 w-3 mr-1" />
                        Welding ({stats.welding})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    {loading ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="flex flex-col items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
                                    <p className="text-gray-500">Loading services...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : filteredServices.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">
                                        {searchQuery
                                            ? "No services match your search"
                                            : "No services in this category"}
                                    </p>
                                    <Link href="/manage-services/new">
                                        <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add First Service
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-center">Rating</TableHead>
                                        <TableHead className="text-center">Projects</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredServices.map((service) => {
                                        const CategoryIcon = getCategoryIcon(service.category);
                                        return (
                                            <TableRow key={service.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                            style={{
                                                                backgroundColor: `${categoryColors[service.category]}15`,
                                                            }}
                                                        >
                                                            <CategoryIcon
                                                                className="h-5 w-5"
                                                                style={{ color: categoryColors[service.category] }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium" style={{ color: TROJAN_NAVY }}>
                                                                {service.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 max-w-[200px] truncate">
                                                                {service.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize"
                                                        style={{
                                                            borderColor: categoryColors[service.category],
                                                            color: categoryColors[service.category],
                                                        }}
                                                    >
                                                        {service.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {service.priceFormatted}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Star
                                                            className="h-4 w-4"
                                                            style={{
                                                                color: TROJAN_GOLD,
                                                                fill: service.rating > 0 ? TROJAN_GOLD : "none",
                                                            }}
                                                        />
                                                        <span className="text-sm">
                                                            {service.rating > 0
                                                                ? service.rating.toFixed(1)
                                                                : "-"}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            ({service.reviewCount})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">{service.projectsCount}</span>
                                                        <span className="text-xs text-gray-400">
                                                            {service.quotesCount} quotes
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {service.featured ? (
                                                        <Badge
                                                            style={{
                                                                backgroundColor: `${TROJAN_GOLD}20`,
                                                                color: TROJAN_NAVY,
                                                                border: `1px solid ${TROJAN_GOLD}`,
                                                            }}
                                                        >
                                                            <Star className="h-3 w-3 mr-1" style={{ fill: TROJAN_GOLD, color: TROJAN_GOLD }} />
                                                            Featured
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Standard</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <Link href={`/manage-services/${service.slug}` as string}>
                                                                <DropdownMenuItem>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link href={`/manage-services/${service.slug}/edit` as string}>
                                                                <DropdownMenuItem>
                                                                    <Pencil className="h-4 w-4 mr-2" />
                                                                    Edit Service
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    setDeleteDialog({ open: true, service })
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Service
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, service: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Service</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.service?.name}&quot;? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {deleteDialog.service && (
                        <div className="py-4">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                <p className="font-medium mb-1">Warning</p>
                                <p>
                                    Services with associated projects or quotes cannot be deleted. You may
                                    need to remove them from featured status instead.
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, service: null })}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
