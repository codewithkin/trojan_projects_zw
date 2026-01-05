"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ProductCardProps {
    id: string;
    name: string;
    price: string;
    priceRange?: string;
    description: string;
    image: string;
    rating?: number;
    reviewCount?: number;
    brands?: string[];
    isFeatured?: boolean;
}

export function ProductCard({
    id,
    name,
    price,
    priceRange,
    description,
    image,
    rating = 4.5,
    reviewCount = 121,
    brands = [],
    isFeatured = false,
}: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Link href={`/services/${id}`}>
                    <div className="relative w-full h-full">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"
                                }`}
                        />
                    </div>
                </Link>

                {/* Wishlist Button */}
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
                >
                    <Heart
                        size={16}
                        className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                </button>

                {/* Featured Badge */}
                {isFeatured && (
                    <div
                        className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold"
                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                    >
                        Featured
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <Link href={`/services/${id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-gray-700 transition-colors">
                        {name}
                    </h3>
                </Link>

                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>

                {/* Brands */}
                {brands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {brands.slice(0, 3).map((brand) => (
                            <span
                                key={brand}
                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={
                                    i < Math.floor(rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({reviewCount})</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>
                            {price}
                        </span>
                        {priceRange && (
                            <p className="text-xs text-gray-400">{priceRange}</p>
                        )}
                    </div>
                    <Button
                        size="sm"
                        className="rounded-full text-xs px-4"
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        <ShoppingCart size={14} className="mr-1" />
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
