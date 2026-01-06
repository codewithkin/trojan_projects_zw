"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Heart, Users } from "lucide-react";
import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { type Service } from "@/types/services";
import { useSession } from "@/hooks/use-session";
import { AuthModal } from "@/components/auth-modal";
import { useLikeService } from "@/hooks/use-services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    const [imageError, setImageError] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { user } = useSession();
    const likeMutation = useLikeService();
    const router = useRouter();

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        likeMutation.mutate(service.slug);
    };

    const categoryColors: Record<string, string> = {
        solar: "#FFC107",
        cctv: "#3B82F6",
        electrical: "#8B5CF6",
        water: "#06B6D4",
        welding: "#F97316",
    };

    return (
        <>
            <Link href={`/services/${service.slug}`} className="block">
                <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {!imageError && service.images[0] ? (
                            <Image
                                src={service.images[0]}
                                alt={service.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-400">T</span>
                                </div>
                            </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlistClick}
                            disabled={likeMutation.isPending}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10 disabled:opacity-50"
                        >
                            <Heart
                                size={18}
                                className={service.likesCount > 0 ? "fill-red-500 text-red-500" : "text-gray-400"}
                            />
                        </button>

                        {/* Featured Badge */}
                        {service.featured && (
                            <div
                                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            >
                                Featured
                            </div>
                        )}

                        {/* Category Badge */}
                        <div
                            className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: categoryColors[service.category] || "#6B7280" }}
                        >
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Rating */}
                        {service.rating && (
                            <div className="flex items-center gap-1 mb-2">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                                <span className="text-sm text-gray-500">({service.reviewCount})</span>
                            </div>
                        )}

                        {/* Title */}
                        <h3
                            className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:underline"
                            style={{ color: TROJAN_NAVY }}
                        >
                            {service.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {service.description}
                        </p>

                        {/* Brands */}
                        {service.brands.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {service.brands.slice(0, 2).map((brand) => (
                                    <span
                                        key={brand}
                                        className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                                    >
                                        {brand}
                                    </span>
                                ))}
                                {service.brands.length > 2 && (
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                        +{service.brands.length - 2}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Price & Request Count */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className="text-lg font-bold"
                                    style={{ color: TROJAN_NAVY }}
                                >
                                    {service.priceFormatted}
                                </p>
                                {service.requestsCount > 0 && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Users size={12} />
                                        {service.requestsCount} served
                                    </p>
                                )}
                            </div>
                            <Button
                                size="sm"
                                className="rounded-full"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            >
                                Request
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>

            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                message="Sign in to save services to your wishlist"
            />
        </>
    );
}

export default memo(ServiceCard);
