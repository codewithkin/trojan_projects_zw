import { View, Image, Pressable } from "react-native";
import { useState } from "react";
import { Heart, Star, Users } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import type { Service } from "@/types/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ProductCardProps {
    service: Service;
    onPress?: () => void;
}

export function ProductCard({ service, onPress }: ProductCardProps) {
    const { requireAuth } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    // Use priceFormatted from API if available, otherwise format the numeric price
    const priceDisplay = service.priceFormatted || `US$${service.price.toLocaleString()}`;

    const handleWishlist = async () => {
        const isAuthed = await requireAuth("Sign in to save services to your wishlist");
        if (!isAuthed) return;

        setIsWishlistLoading(true);
        try {
            // TODO: Implement actual wishlist API call
            setIsWishlisted(!isWishlisted);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
        >
            {/* Image Container */}
            <View className="relative aspect-square bg-gray-50">
                <Image
                    source={{ uri: service.images[0] }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/* Wishlist Button */}
                <Pressable
                    onPress={handleWishlist}
                    disabled={isWishlistLoading}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white items-center justify-center"
                    style={{ elevation: 3, opacity: isWishlistLoading ? 0.5 : 1 }}
                >
                    <Heart
                        size={16}
                        color={isWishlisted ? "#DC2626" : "#6B7280"}
                        fill={isWishlisted ? "#DC2626" : "transparent"}
                    />
                </Pressable>

                {/* Featured Badge */}
                {service.featured && (
                    <View
                        className="absolute top-3 left-3 px-3 py-1 rounded-full"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <Text className="text-xs font-semibold" style={{ color: TROJAN_NAVY }}>
                            Featured
                        </Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View className="p-4">
                <Text className="font-semibold text-gray-900 mb-1" numberOfLines={1}>
                    {service.name}
                </Text>

                <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
                    {service.description}
                </Text>

                {/* Brands */}
                {service.brands.length > 0 && (
                    <View className="flex-row flex-wrap gap-1 mb-2">
                        {service.brands.slice(0, 2).map((brand) => (
                            <View
                                key={brand}
                                className="px-2 py-0.5 bg-gray-100 rounded-full"
                            >
                                <Text className="text-xs text-gray-600">{brand}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Rating */}
                {service.rating && (
                    <View className="flex-row items-center gap-1 mb-3">
                        <View className="flex-row">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    color={i < Math.floor(service.rating || 0) ? "#FBBF24" : "#D1D5DB"}
                                    fill={i < Math.floor(service.rating || 0) ? "#FBBF24" : "transparent"}
                                />
                            ))}
                        </View>
                        <Text className="text-xs text-gray-500">({service.reviewCount})</Text>
                    </View>
                )}

                {/* Price & CTA */}
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>
                            {priceDisplay}
                        </Text>
                        {service.requestsCount > 0 && (
                            <View className="flex-row items-center gap-1">
                                <Users size={10} color="#6B7280" />
                                <Text className="text-xs text-gray-400">{service.requestsCount} served</Text>
                            </View>
                        )}
                    </View>
                    <Button
                        size="sm"
                        className="rounded-full px-4"
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        <Text className="text-white text-xs font-medium">View</Text>
                    </Button>
                </View>
            </View>
        </Pressable>
    );
}
