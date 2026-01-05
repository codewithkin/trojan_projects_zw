"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Service, categoryConfig } from "@/data/services";
import Image from "next/image";
import { X, Star, Check, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ServiceDetailModalProps {
    service: Service | null;
    open: boolean;
    onClose: () => void;
}

export function ServiceDetailModal({ service, open, onClose }: ServiceDetailModalProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!service) return null;

    const category = categoryConfig[service.category];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <div className="relative">
                    {/* Header */}
                    <DialogHeader className="sticky top-0 z-10 bg-white border-b p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                                    {service.name}
                                </DialogTitle>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        style={{ backgroundColor: category.color }}
                                        className="text-white"
                                    >
                                        {category.label}
                                    </Badge>
                                    {service.featured && (
                                        <Badge style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="p-6">
                        {/* Image Gallery */}
                        <div className="mb-6">
                            <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                                <Image
                                    src={service.images[selectedImage]}
                                    alt={service.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {service.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? "border-current" : "border-gray-200"
                                            }`}
                                        style={selectedImage === idx ? { borderColor: TROJAN_GOLD } : {}}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${service.name} ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rating & Reviews */}
                        {service.rating && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
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

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                                    US${service.price.toLocaleString()}
                                </span>
                                <span className="text-gray-500">starting price</span>
                            </div>
                            <p className="text-sm text-gray-500">Price range: {service.priceRange}</p>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: TROJAN_NAVY }}>
                                Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </div>

                        {/* Specifications */}
                        {service.specifications && Object.keys(service.specifications).length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3" style={{ color: TROJAN_NAVY }}>
                                    Specifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {service.specifications.inverter && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <span className="text-sm text-gray-500">Inverter</span>
                                            <p className="font-medium">{service.specifications.inverter}</p>
                                        </div>
                                    )}
                                    {service.specifications.battery && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <span className="text-sm text-gray-500">Battery</span>
                                            <p className="font-medium">{service.specifications.battery}</p>
                                        </div>
                                    )}
                                    {service.specifications.panels && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <span className="text-sm text-gray-500">Panels</span>
                                            <p className="font-medium">{service.specifications.panels}</p>
                                        </div>
                                    )}
                                    {service.specifications.protectionKit && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <span className="text-sm text-gray-500">Protection Kit</span>
                                            <p className="font-medium">Included</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* What's Supported */}
                        {service.supports.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3" style={{ color: TROJAN_NAVY }}>
                                    What's Supported
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {service.supports.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Check size={16} style={{ color: "#16A34A" }} />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brands */}
                        {service.brands.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3" style={{ color: TROJAN_NAVY }}>
                                    Available Brands
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {service.brands.map((brand, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {brand}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full"
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart
                                    size={20}
                                    fill={isWishlisted ? "#DC2626" : "none"}
                                    color={isWishlisted ? "#DC2626" : "currentColor"}
                                />
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1 rounded-full font-semibold"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                Request Service
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
