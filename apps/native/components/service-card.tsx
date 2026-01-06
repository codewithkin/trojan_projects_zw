import { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Service } from "@/types/services";
import { categoryConfig } from "@/data/services";
import { useAuth } from "@/contexts/auth-context";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ServiceCardProps {
    service: Service;
    onPress?: () => void;
    onWishlist?: () => void;
}

export function ServiceCard({ service, onPress, onWishlist }: ServiceCardProps) {
    const { requireAuth } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const category = categoryConfig[service.category];

    const handleWishlist = async () => {
        const isAuthed = await requireAuth("Sign in to save services to your wishlist");
        if (!isAuthed) return;

        setIsWishlisted(!isWishlisted);
        onWishlist?.();
    };

    const renderStars = () => {
        const stars = [];
        const rating = service.rating || 0;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= Math.floor(rating) ? "star" : i - 0.5 <= rating ? "star-half" : "star-outline"}
                    size={12}
                    color={TROJAN_GOLD}
                />
            );
        }
        return stars;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: service.images[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Wishlist Button */}
                <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={handleWishlist}
                >
                    <Ionicons 
                        name={isWishlisted ? "heart" : "heart-outline"} 
                        size={18} 
                        color={isWishlisted ? "#DC2626" : "#666"} 
                    />
                </TouchableOpacity>

                {/* Featured Badge */}
                {service.featured && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}

                {/* Category Badge */}
                <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon as any} size={10} color="white" />
                    <Text style={styles.categoryText}>{category.label}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Rating */}
                {service.rating && (
                    <View style={styles.ratingRow}>
                        <View style={styles.stars}>{renderStars()}</View>
                        <Text style={styles.ratingText}>
                            {service.rating} ({service.reviewCount})
                        </Text>
                    </View>
                )}

                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {service.name}
                </Text>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                    {service.description}
                </Text>

                {/* Brands */}
                {service.brands.length > 0 && (
                    <View style={styles.brandsRow}>
                        {service.brands.slice(0, 2).map((brand, index) => (
                            <View key={index} style={styles.brandPill}>
                                <Text style={styles.brandText}>{brand}</Text>
                            </View>
                        ))}
                        {service.brands.length > 2 && (
                            <Text style={styles.moreBrands}>+{service.brands.length - 2}</Text>
                        )}
                    </View>
                )}

                {/* Price & Action */}
                <View style={styles.priceRow}>
                    <View>
                        <Text style={styles.price}>
                            {service.priceFormatted || `US$${service.price.toLocaleString()}`}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.requestButton}
                        onPress={onPress}
                    >
                        <Text style={styles.requestButtonText}>Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    imageContainer: {
        height: 160,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    wishlistButton: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "white",
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    featuredBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: TROJAN_GOLD,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    featuredText: {
        color: TROJAN_NAVY,
        fontSize: 11,
        fontWeight: "600",
    },
    categoryBadge: {
        position: "absolute",
        bottom: 12,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
    },
    categoryText: {
        color: "white",
        fontSize: 10,
        fontWeight: "600",
    },
    content: {
        padding: 16,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    stars: {
        flexDirection: "row",
        gap: 2,
    },
    ratingText: {
        marginLeft: 6,
        fontSize: 12,
        color: "#666",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: TROJAN_NAVY,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
        marginBottom: 12,
    },
    brandsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 6,
    },
    brandPill: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    brandText: {
        fontSize: 11,
        color: "#666",
        fontWeight: "500",
    },
    moreBrands: {
        fontSize: 11,
        color: "#999",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    price: {
        fontSize: 18,
        fontWeight: "700",
        color: TROJAN_NAVY,
    },
    requestButton: {
        backgroundColor: TROJAN_GOLD,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    requestButtonText: {
        color: TROJAN_NAVY,
        fontWeight: "600",
        fontSize: 14,
    },
});
