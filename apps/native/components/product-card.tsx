import { View, Image, Pressable } from "react-native";
import { useState } from "react";
import { Heart, Star } from "lucide-react-native";
import { Text } from "@/components/ui/text";
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
    onPress?: () => void;
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
    onPress,
}: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
        >
            {/* Image Container */}
            <View className="relative aspect-square bg-gray-50">
                <Image
                    source={{ uri: image }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/* Wishlist Button */}
                <Pressable
                    onPress={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white items-center justify-center"
                    style={{ elevation: 3 }}
                >
                    <Heart
                        size={16}
                        color={isWishlisted ? "#EF4444" : "#9CA3AF"}
                        fill={isWishlisted ? "#EF4444" : "transparent"}
                    />
                </Pressable>

                {/* Featured Badge */}
                {isFeatured && (
                    <View
                        className="absolute top-3 left-3 px-2 py-1 rounded-md"
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
                    {name}
                </Text>

                <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
                    {description}
                </Text>

                {/* Brands */}
                {brands.length > 0 && (
                    <View className="flex-row flex-wrap gap-1 mb-2">
                        {brands.slice(0, 2).map((brand) => (
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
                <View className="flex-row items-center gap-1 mb-3">
                    <View className="flex-row">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                color={i < Math.floor(rating) ? "#FBBF24" : "#D1D5DB"}
                                fill={i < Math.floor(rating) ? "#FBBF24" : "transparent"}
                            />
                        ))}
                    </View>
                    <Text className="text-xs text-gray-500">({reviewCount})</Text>
                </View>

                {/* Price & CTA */}
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>
                            {price}
                        </Text>
                        {priceRange && (
                            <Text className="text-xs text-gray-400">{priceRange}</Text>
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
