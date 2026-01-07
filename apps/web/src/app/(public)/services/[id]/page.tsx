"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Star,
    Heart,
    Check,
    ShoppingCart,
    Shield,
    Truck,
    Clock,
    Phone,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Share2,
    Zap,
    AlertCircle,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceDetailSkeleton } from "@/components/skeletons";
import { useService, useServices, useLikeService, useRequestService } from "@/hooks/use-services";
import { useSession } from "@/hooks/use-session";
import { AuthModal } from "@/components/auth-modal";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categoryConfig: Record<string, { label: string; color: string }> = {
    solar: { label: "Solar", color: "#FFC107" },
    cctv: { label: "CCTV", color: "#3B82F6" },
    electrical: { label: "Electrical", color: "#8B5CF6" },
    water: { label: "Water", color: "#06B6D4" },
    welding: { label: "Welding", color: "#F97316" },
};

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.id as string;

    const { data: service, isLoading, isError, error } = useService(slug);
    const { data: allServices } = useServices();
    const likeMutation = useLikeService();
    const requestMutation = useRequestService();
    const { user } = useSession();

    const [selectedImage, setSelectedImage] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Get related services
    const relatedServices = allServices
        ?.filter((s) => s.category === service?.category && s.slug !== slug)
        .slice(0, 4) ?? [];

    // Loading state
    if (isLoading) {
        return <ServiceDetailSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4" style={{ color: TROJAN_NAVY }}>
                        Failed to load service
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error instanceof Error ? error.message : "An error occurred"}
                    </p>
                    <Button onClick={() => router.push("/")} style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                        Browse Services
                    </Button>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: TROJAN_NAVY }}>
                        Service Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        The service you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => router.push("/")} style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                        Browse Services
                    </Button>
                </div>
            </div>
        );
    }

    const category = categoryConfig[service.category];
    // Use optimistic userLiked field
    const isLiked = service.userLiked ?? false;

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % service.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + service.images.length) % service.images.length);
    };

    const handleLike = () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        likeMutation.mutate(slug);
    };

    const handleRequest = () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        // Navigate to quote form with this service pre-selected
        router.push(`/quotes/new?service=${slug}`);
    };

    return (
        <>
            {/* Breadcrumb - Responsive */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-gray-700">
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/services" className="text-gray-500 hover:text-gray-700 hidden sm:inline">
                            Services
                        </Link>
                        <span className="text-gray-400 hidden sm:inline">/</span>
                        <span className="text-gray-500 hidden sm:inline capitalize">{service.category}</span>
                        <span className="text-gray-400 hidden sm:inline">/</span>
                        <span className="font-medium truncate" style={{ color: TROJAN_NAVY }}>
                            {service.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Back Button - Mobile */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 lg:hidden"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Main Content Grid - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden group">
                            <Image
                                src={service.images[selectedImage] || "/placeholder.jpg"}
                                alt={service.name}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Image Navigation - Desktop/Tablet */}
                            {service.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                                {service.featured && (
                                    <span
                                        className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    >
                                        Featured
                                    </span>
                                )}
                                <span
                                    className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white"
                                    style={{ backgroundColor: category.color }}
                                >
                                    {category.label}
                                </span>
                            </div>

                            {/* Wishlist & Share */}
                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2">
                                <button
                                    onClick={handleLike}
                                    disabled={likeMutation.isPending}
                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    <Heart
                                        size={20}
                                        fill={isLiked ? "#EF4444" : "none"}
                                        color={isLiked ? "#EF4444" : "#6B7280"}
                                    />
                                </button>
                                <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                    <Share2 size={20} color="#6B7280" />
                                </button>
                            </div>

                            {/* Image Counter */}
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs sm:text-sm px-3 py-1 rounded-full">
                                {selectedImage + 1} / {service.images.length}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {service.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "ring-2 ring-offset-2 ring-yellow-500" : "opacity-70 hover:opacity-100 border-transparent"
                                        }`}
                                    style={selectedImage === idx ? { borderColor: TROJAN_GOLD } : undefined}
                                >
                                    <Image
                                        src={img}
                                        alt={`${service.name} ${idx + 1}`}
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <h1
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
                                style={{ color: TROJAN_NAVY }}
                            >
                                {service.name}
                            </h1>

                            {service.rating && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                fill={i < Math.floor(service.rating!) ? TROJAN_GOLD : "none"}
                                                color={i < Math.floor(service.rating!) ? TROJAN_GOLD : "#D1D5DB"}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-semibold">{service.rating}</span>
                                    <span className="text-gray-500">({service.reviewCount} reviews)</span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl sm:text-4xl font-bold" style={{ color: TROJAN_NAVY }}>
                                    {service.priceFormatted}
                                </span>
                                <span className="text-gray-500 text-sm sm:text-base">starting price</span>
                            </div>
                            {service.requestsCount > 0 && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                    <Users size={16} />
                                    <span>Served {service.requestsCount} customers</span>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                *Final price depends on brand selection, specifications, and installation requirements
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2" style={{ color: TROJAN_NAVY }}>
                                About This Service
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>

                        {/* Specifications */}
                        {service.specifications && Object.keys(service.specifications).length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3" style={{ color: TROJAN_NAVY }}>
                                    System Specifications
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {(service.specifications as { inverter?: string }).inverter && (
                                        <div className="bg-white border rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Zap size={16} style={{ color: TROJAN_GOLD }} />
                                                <span className="text-sm text-gray-500">Inverter</span>
                                            </div>
                                            <p className="font-medium text-sm" style={{ color: TROJAN_NAVY }}>
                                                {(service.specifications as { inverter?: string }).inverter}
                                            </p>
                                        </div>
                                    )}
                                    {(service.specifications as { battery?: string }).battery && (
                                        <div className="bg-white border rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Zap size={16} style={{ color: TROJAN_GOLD }} />
                                                <span className="text-sm text-gray-500">Battery</span>
                                            </div>
                                            <p className="font-medium text-sm" style={{ color: TROJAN_NAVY }}>
                                                {(service.specifications as { battery?: string }).battery}
                                            </p>
                                        </div>
                                    )}
                                    {(service.specifications as { panels?: string }).panels && (
                                        <div className="bg-white border rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Zap size={16} style={{ color: TROJAN_GOLD }} />
                                                <span className="text-sm text-gray-500">Solar Panels</span>
                                            </div>
                                            <p className="font-medium text-sm" style={{ color: TROJAN_NAVY }}>
                                                {(service.specifications as { panels?: string }).panels}
                                            </p>
                                        </div>
                                    )}
                                    {(service.specifications as { protectionKit?: boolean }).protectionKit && (
                                        <div className="bg-white border rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Shield size={16} style={{ color: "#16A34A" }} />
                                                <span className="text-sm text-gray-500">Protection</span>
                                            </div>
                                            <p className="font-medium text-sm text-green-600">
                                                Full Protection Kit Included
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* What This System Supports */}
                        {service.supports && service.supports.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3" style={{ color: TROJAN_NAVY }}>
                                    This System Supports
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {service.supports.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <Check size={16} className="text-green-500 shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Brands */}
                        {service.brands && service.brands.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-3" style={{ color: TROJAN_NAVY }}>
                                    Available Brands
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {service.brands.map((brand, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-full text-sm font-medium"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            {brand}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                                <Shield size={24} className="mx-auto mb-1 sm:mb-2 text-green-600" />
                                <p className="text-xs sm:text-sm font-medium text-green-700">Warranty</p>
                                <p className="text-xs text-green-600 hidden sm:block">Included</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                                <Truck size={24} className="mx-auto mb-1 sm:mb-2 text-blue-600" />
                                <p className="text-xs sm:text-sm font-medium text-blue-700">Installation</p>
                                <p className="text-xs text-blue-600 hidden sm:block">Included</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
                                <Clock size={24} className="mx-auto mb-1 sm:mb-2 text-purple-600" />
                                <p className="text-xs sm:text-sm font-medium text-purple-700">Fast Setup</p>
                                <p className="text-xs text-purple-600 hidden sm:block">1-2 Days</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3 pt-4">
                            <Button
                                size="lg"
                                className="w-full rounded-full text-base sm:text-lg py-5 sm:py-6"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                onClick={handleRequest}
                                disabled={requestMutation.isPending}
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                Request This Service
                            </Button>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" size="lg" className="rounded-full">
                                    <Phone size={18} className="mr-2" />
                                    <span className="hidden sm:inline">Call Us</span>
                                    <span className="sm:hidden">Call</span>
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-full">
                                    <MessageCircle size={18} className="mr-2" />
                                    <span className="hidden sm:inline">WhatsApp</span>
                                    <span className="sm:hidden">Chat</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <div className="mt-12 sm:mt-16 lg:mt-20">
                        <h2
                            className="text-xl sm:text-2xl font-bold mb-6"
                            style={{ color: TROJAN_NAVY }}
                        >
                            Related Services
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedServices.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/services/${related.slug}`}
                                    className="group bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative aspect-square bg-gray-100">
                                        <Image
                                            src={related.images[0] || "/placeholder.jpg"}
                                            alt={related.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="p-3 sm:p-4">
                                        <h3
                                            className="font-semibold text-sm sm:text-base mb-1 line-clamp-2"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            {related.name}
                                        </h3>
                                        <p className="font-bold text-sm sm:text-base" style={{ color: TROJAN_GOLD }}>
                                            {related.priceFormatted}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Auth Modal */}
            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                message="Sign in to like this service or request a quote"
            />
        </>
    );
}
