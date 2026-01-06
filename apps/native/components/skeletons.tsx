import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get("window");

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: object;
}

export function Skeleton({
    width: customWidth = "100%",
    height = 20,
    borderRadius = 4,
    style
}: SkeletonProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width: customWidth,
                    height,
                    borderRadius,
                    backgroundColor: "#E5E7EB",
                    opacity,
                },
                style,
            ]}
        />
    );
}

export function ServiceCardSkeleton() {
    return (
        <View style={styles.card}>
            {/* Image */}
            <Skeleton height={160} borderRadius={12} />

            {/* Content */}
            <View style={styles.content}>
                {/* Category badge */}
                <Skeleton width={60} height={20} borderRadius={10} />

                {/* Title */}
                <View style={styles.titleRow}>
                    <Skeleton width="70%" height={18} style={{ marginTop: 8 }} />
                </View>

                {/* Rating */}
                <View style={styles.ratingRow}>
                    <Skeleton width={80} height={14} style={{ marginTop: 6 }} />
                </View>

                {/* Price and button */}
                <View style={styles.priceRow}>
                    <Skeleton width={80} height={24} />
                    <Skeleton width={70} height={32} borderRadius={16} />
                </View>
            </View>
        </View>
    );
}

export function ServicesGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <View style={styles.grid}>
            {Array.from({ length: count }).map((_, i) => (
                <View key={i} style={styles.gridItem}>
                    <ServiceCardSkeleton />
                </View>
            ))}
        </View>
    );
}

export function ServiceDetailSkeleton() {
    return (
        <View style={styles.detailContainer}>
            {/* Image */}
            <Skeleton height={300} borderRadius={0} />

            {/* Content */}
            <View style={styles.detailContent}>
                {/* Title */}
                <Skeleton width="80%" height={28} style={{ marginBottom: 12 }} />

                {/* Rating */}
                <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />

                {/* Price */}
                <Skeleton width={100} height={32} style={{ marginBottom: 8 }} />
                <Skeleton width={150} height={16} style={{ marginBottom: 20 }} />

                {/* Description */}
                <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="60%" height={16} style={{ marginBottom: 20 }} />

                {/* Specs */}
                <View style={styles.specsRow}>
                    <Skeleton width="48%" height={80} borderRadius={12} />
                    <Skeleton width="48%" height={80} borderRadius={12} />
                </View>

                {/* Button */}
                <Skeleton height={48} borderRadius={24} style={{ marginTop: 20 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    content: {
        padding: 12,
    },
    titleRow: {
        marginBottom: 4,
    },
    ratingRow: {
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 8,
    },
    gridItem: {
        width: (width - 48) / 2,
        marginHorizontal: 8,
        marginBottom: 16,
    },
    detailContainer: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    detailContent: {
        padding: 16,
    },
    specsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
