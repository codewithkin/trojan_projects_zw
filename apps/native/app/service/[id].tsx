import { useState, useMemo, useCallback, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Linking,
    Platform,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { services, categoryConfig } from "@/data/services";
import { useLikeService, useServiceLikeStore } from "@/hooks/use-services";
import { useAuth } from "@/contexts/auth-context";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Responsive breakpoints
const isTablet = SCREEN_WIDTH >= 768;
const isLargeTablet = SCREEN_WIDTH >= 1024;

export default function ServiceDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const { requireAuth, session } = useAuth();
    const likeMutation = useLikeService();
    const { isLiked, getLikeCount, initFromServer } = useServiceLikeStore();

    const service = useMemo(() => {
        return services.find((s) => s.id === params.id);
    }, [params.id]);

    // Initialize like state from service data
    useEffect(() => {
        if (service && session?.user) {
            const userLiked = service.likedBy?.includes(session.user.id) || false;
            initFromServer(service.slug || service.id, userLiked, service.likesCount || 0);
        }
    }, [service?.id, session?.user?.id]);

    const isWishlisted = service ? isLiked(service.slug || service.id) : false;

    const handleWishlist = useCallback(async () => {
        if (!service) return;
        const isAuthed = await requireAuth("Sign in to save services to your wishlist");
        if (!isAuthed) return;

        likeMutation.mutate(service.slug || service.id);
    }, [service, requireAuth, likeMutation]);

    const handleCall = useCallback(() => {
        Linking.openURL("tel:+263771234567");
    }, []);

    const handleWhatsApp = useCallback(() => {
        Linking.openURL("https://wa.me/263771234567");
    }, []);

    const nextImage = useCallback(() => {
        if (service) {
            setSelectedImage((prev) => (prev + 1) % service.images.length);
        }
    }, [service]);

    const prevImage = useCallback(() => {
        if (service) {
            setSelectedImage((prev) => (prev - 1 + service.images.length) % service.images.length);
        }
    }, [service]);

    if (!service) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.notFoundContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
                    <Text style={styles.notFoundTitle}>Service Not Found</Text>
                    <Text style={styles.notFoundText}>
                        The service you're looking for doesn't exist or has been removed.
                    </Text>
                    <TouchableOpacity
                        style={styles.notFoundButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.notFoundButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const category = categoryConfig[service.category];
    const imageWidth = isLargeTablet ? SCREEN_WIDTH * 0.5 : SCREEN_WIDTH;
    const contentPadding = isTablet ? 24 : 16;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={TROJAN_NAVY} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={handleWishlist}
                        style={styles.headerIcon}
                        disabled={likeMutation.isPending}
                    >
                        <Ionicons
                            name={isWishlisted ? "heart" : "heart-outline"}
                            size={24}
                            color={isWishlisted ? "#EF4444" : TROJAN_NAVY}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Ionicons name="share-outline" size={24} color={TROJAN_NAVY} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={isLargeTablet && styles.tabletLayout}
            >
                {/* Image Section */}
                <View style={isLargeTablet && styles.tabletImageContainer}>
                    {/* Main Image */}
                    <View style={[styles.mainImageContainer, { width: imageWidth }]}>
                        <Image
                            source={{ uri: service.images[selectedImage] }}
                            style={styles.mainImage}
                            resizeMode="cover"
                        />

                        {/* Image Navigation Arrows */}
                        {service.images.length > 1 && (
                            <>
                                <TouchableOpacity
                                    style={[styles.imageNav, styles.imageNavLeft]}
                                    onPress={prevImage}
                                >
                                    <Ionicons name="chevron-back" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.imageNav, styles.imageNavRight]}
                                    onPress={nextImage}
                                >
                                    <Ionicons name="chevron-forward" size={24} color="white" />
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Badges */}
                        <View style={styles.badgeContainer}>
                            {service.featured && (
                                <View style={styles.featuredBadge}>
                                    <Text style={styles.featuredBadgeText}>Featured</Text>
                                </View>
                            )}
                            <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                                <Text style={styles.categoryBadgeText}>{category.label}</Text>
                            </View>
                        </View>

                        {/* Image Counter */}
                        <View style={styles.imageCounter}>
                            <Text style={styles.imageCounterText}>
                                {selectedImage + 1} / {service.images.length}
                            </Text>
                        </View>
                    </View>

                    {/* Thumbnail Strip */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={[styles.thumbnailStrip, { paddingHorizontal: contentPadding }]}
                    >
                        {service.images.map((img, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setSelectedImage(idx)}
                                style={[
                                    styles.thumbnail,
                                    selectedImage === idx && styles.thumbnailActive,
                                    isTablet && styles.thumbnailTablet,
                                ]}
                            >
                                <Image
                                    source={{ uri: img }}
                                    style={styles.thumbnailImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content Section */}
                <View style={[
                    styles.contentContainer,
                    { paddingHorizontal: contentPadding },
                    isLargeTablet && styles.tabletContentContainer
                ]}>
                    {/* Title & Rating */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.title, isTablet && styles.titleTablet]}>
                            {service.name}
                        </Text>
                        {service.rating && (
                            <View style={styles.ratingRow}>
                                <View style={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <Ionicons
                                            key={i}
                                            name={i < Math.floor(service.rating!) ? "star" : "star-outline"}
                                            size={isTablet ? 20 : 16}
                                            color={i < Math.floor(service.rating!) ? TROJAN_GOLD : "#D1D5DB"}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.ratingText}>{service.rating}</Text>
                                <Text style={styles.reviewCount}>({service.reviewCount} reviews)</Text>
                            </View>
                        )}
                    </View>

                    {/* Price Card */}
                    <View style={[styles.priceCard, isTablet && styles.priceCardTablet]}>
                        <View style={styles.priceRow}>
                            <Text style={[styles.price, isTablet && styles.priceTablet]}>
                                {service.price}
                            </Text>
                            <Text style={styles.priceLabel}>starting price</Text>
                        </View>
                        <Text style={styles.priceRange}>Price range: {service.priceRange}</Text>
                        <Text style={styles.priceNote}>
                            *Final price depends on brand selection, specifications, and installation
                        </Text>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About This Service</Text>
                        <Text style={styles.description}>{service.description}</Text>
                    </View>

                    {/* Specifications */}
                    {service.specifications && Object.keys(service.specifications).length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>System Specifications</Text>
                            <View style={[styles.specsGrid, isTablet && styles.specsGridTablet]}>
                                {service.specifications.inverter && (
                                    <View style={[styles.specCard, isTablet && styles.specCardTablet]}>
                                        <View style={styles.specIconRow}>
                                            <Ionicons name="flash" size={16} color={TROJAN_GOLD} />
                                            <Text style={styles.specLabel}>Inverter</Text>
                                        </View>
                                        <Text style={styles.specValue}>{service.specifications.inverter}</Text>
                                    </View>
                                )}
                                {service.specifications.battery && (
                                    <View style={[styles.specCard, isTablet && styles.specCardTablet]}>
                                        <View style={styles.specIconRow}>
                                            <Ionicons name="battery-charging" size={16} color={TROJAN_GOLD} />
                                            <Text style={styles.specLabel}>Battery</Text>
                                        </View>
                                        <Text style={styles.specValue}>{service.specifications.battery}</Text>
                                    </View>
                                )}
                                {service.specifications.panels && (
                                    <View style={[styles.specCard, isTablet && styles.specCardTablet]}>
                                        <View style={styles.specIconRow}>
                                            <Ionicons name="sunny" size={16} color={TROJAN_GOLD} />
                                            <Text style={styles.specLabel}>Solar Panels</Text>
                                        </View>
                                        <Text style={styles.specValue}>{service.specifications.panels}</Text>
                                    </View>
                                )}
                                {service.specifications.protectionKit && (
                                    <View style={[styles.specCard, styles.specCardGreen, isTablet && styles.specCardTablet]}>
                                        <View style={styles.specIconRow}>
                                            <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
                                            <Text style={styles.specLabel}>Protection</Text>
                                        </View>
                                        <Text style={[styles.specValue, { color: "#16A34A" }]}>
                                            Full Protection Kit Included
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Supports */}
                    {service.supports && service.supports.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>This System Supports</Text>
                            <View style={[styles.supportGrid, isTablet && styles.supportGridTablet]}>
                                {service.supports.map((item, idx) => (
                                    <View key={idx} style={[styles.supportItem, isTablet && styles.supportItemTablet]}>
                                        <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                                        <Text style={styles.supportText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Brands */}
                    {service.brands && service.brands.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Available Brands</Text>
                            <View style={styles.brandsRow}>
                                {service.brands.map((brand, idx) => (
                                    <View key={idx} style={[styles.brandPill, isTablet && styles.brandPillTablet]}>
                                        <Text style={styles.brandText}>{brand}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Trust Badges */}
                    <View style={[styles.trustBadges, isTablet && styles.trustBadgesTablet]}>
                        <View style={[styles.trustBadge, { backgroundColor: "#DCFCE7" }]}>
                            <Ionicons name="shield-checkmark" size={isTablet ? 28 : 24} color="#16A34A" />
                            <Text style={[styles.trustBadgeTitle, { color: "#15803D" }]}>Warranty</Text>
                            <Text style={[styles.trustBadgeSubtitle, { color: "#16A34A" }]}>Included</Text>
                        </View>
                        <View style={[styles.trustBadge, { backgroundColor: "#DBEAFE" }]}>
                            <Ionicons name="construct" size={isTablet ? 28 : 24} color="#2563EB" />
                            <Text style={[styles.trustBadgeTitle, { color: "#1D4ED8" }]}>Installation</Text>
                            <Text style={[styles.trustBadgeSubtitle, { color: "#2563EB" }]}>Included</Text>
                        </View>
                        <View style={[styles.trustBadge, { backgroundColor: "#F3E8FF" }]}>
                            <Ionicons name="time" size={isTablet ? 28 : 24} color="#7C3AED" />
                            <Text style={[styles.trustBadgeTitle, { color: "#6D28D9" }]}>Fast Setup</Text>
                            <Text style={[styles.trustBadgeSubtitle, { color: "#7C3AED" }]}>1-2 Days</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Bottom CTA */}
            <View style={[styles.bottomCta, { paddingHorizontal: contentPadding }]}>
                <View style={[styles.ctaContainer, isTablet && styles.ctaContainerTablet]}>
                    <TouchableOpacity
                        style={[styles.ctaButton, isTablet && styles.ctaButtonTablet]}
                        onPress={() => router.push("/quotes")}
                    >
                        <Ionicons name="cart" size={20} color={TROJAN_NAVY} />
                        <Text style={styles.ctaButtonText}>Request This Service</Text>
                    </TouchableOpacity>
                    <View style={styles.ctaSecondary}>
                        <TouchableOpacity style={styles.ctaSecondaryButton} onPress={handleCall}>
                            <Ionicons name="call" size={20} color={TROJAN_NAVY} />
                            {isTablet && <Text style={styles.ctaSecondaryText}>Call</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ctaSecondaryButton} onPress={handleWhatsApp}>
                            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                            {isTablet && <Text style={styles.ctaSecondaryText}>WhatsApp</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        flex: 1,
    },
    tabletLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    tabletImageContainer: {
        width: "50%",
    },
    tabletContentContainer: {
        width: "50%",
        paddingTop: 0,
    },
    mainImageContainer: {
        height: 350,
        backgroundColor: "#F3F4F6",
        position: "relative",
    },
    mainImage: {
        width: "100%",
        height: "100%",
    },
    imageNav: {
        position: "absolute",
        top: "50%",
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    imageNavLeft: {
        left: 12,
    },
    imageNavRight: {
        right: 12,
    },
    badgeContainer: {
        position: "absolute",
        top: 12,
        left: 12,
        gap: 8,
    },
    featuredBadge: {
        backgroundColor: TROJAN_GOLD,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    featuredBadgeText: {
        color: TROJAN_NAVY,
        fontSize: 12,
        fontWeight: "600",
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    imageCounter: {
        position: "absolute",
        bottom: 12,
        left: "50%",
        marginLeft: -30,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageCounterText: {
        color: "white",
        fontSize: 12,
    },
    thumbnailStrip: {
        marginTop: 12,
        marginBottom: 16,
    },
    thumbnail: {
        width: 64,
        height: 64,
        borderRadius: 8,
        marginRight: 8,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "transparent",
    },
    thumbnailTablet: {
        width: 80,
        height: 80,
    },
    thumbnailActive: {
        borderColor: TROJAN_GOLD,
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
    },
    contentContainer: {
        paddingTop: 8,
        paddingBottom: 120,
    },
    titleSection: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: TROJAN_NAVY,
        marginBottom: 8,
    },
    titleTablet: {
        fontSize: 32,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stars: {
        flexDirection: "row",
        gap: 2,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: TROJAN_NAVY,
    },
    reviewCount: {
        fontSize: 14,
        color: "#6B7280",
    },
    priceCard: {
        backgroundColor: "#F3F4F6",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    priceCardTablet: {
        padding: 24,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 4,
    },
    price: {
        fontSize: 28,
        fontWeight: "bold",
        color: TROJAN_NAVY,
    },
    priceTablet: {
        fontSize: 36,
    },
    priceLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    priceRange: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 8,
    },
    priceNote: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: TROJAN_NAVY,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 24,
    },
    specsGrid: {
        gap: 12,
    },
    specsGridTablet: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    specCard: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
    },
    specCardTablet: {
        width: "48%",
        marginRight: "2%",
    },
    specCardGreen: {
        borderColor: "#DCFCE7",
        backgroundColor: "#F0FDF4",
    },
    specIconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    specLabel: {
        fontSize: 12,
        color: "#6B7280",
    },
    specValue: {
        fontSize: 14,
        fontWeight: "500",
        color: TROJAN_NAVY,
    },
    supportGrid: {
        gap: 8,
    },
    supportGridTablet: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    supportItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    supportItemTablet: {
        width: "50%",
        marginBottom: 8,
    },
    supportText: {
        fontSize: 14,
        color: "#374151",
    },
    brandsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    brandPill: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    brandPillTablet: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    brandText: {
        fontSize: 14,
        fontWeight: "500",
        color: TROJAN_NAVY,
    },
    trustBadges: {
        flexDirection: "row",
        gap: 8,
        marginTop: 8,
    },
    trustBadgesTablet: {
        gap: 16,
    },
    trustBadge: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 16,
        borderRadius: 12,
    },
    trustBadgeTitle: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
    },
    trustBadgeSubtitle: {
        fontSize: 11,
    },
    bottomCta: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingVertical: 16,
        paddingBottom: Platform.OS === "ios" ? 32 : 16,
    },
    ctaContainer: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
    },
    ctaContainerTablet: {
        maxWidth: 600,
        alignSelf: "center",
        width: "100%",
    },
    ctaButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: TROJAN_GOLD,
        paddingVertical: 16,
        borderRadius: 25,
    },
    ctaButtonTablet: {
        paddingVertical: 18,
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: TROJAN_NAVY,
    },
    ctaSecondary: {
        flexDirection: "row",
        gap: 8,
    },
    ctaSecondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "white",
    },
    ctaSecondaryText: {
        fontSize: 14,
        fontWeight: "500",
        color: TROJAN_NAVY,
    },
    notFoundContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    notFoundTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: TROJAN_NAVY,
        marginTop: 16,
        marginBottom: 8,
    },
    notFoundText: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 24,
    },
    notFoundButton: {
        backgroundColor: TROJAN_GOLD,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    notFoundButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: TROJAN_NAVY,
    },
});
