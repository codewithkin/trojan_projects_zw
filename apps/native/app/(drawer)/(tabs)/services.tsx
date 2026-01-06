import { useState, useMemo } from "react";
import { ScrollView, View, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { ProductCard } from "@/components/product-card";
import { ServicesGridSkeleton, ServicesListSkeleton } from "@/components/skeletons";
import { useServices } from "@/hooks/use-services";
import { Ionicons } from "@expo/vector-icons";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categories = [
    { id: "all", label: "All" },
    { id: "solar", label: "Solar" },
    { id: "cctv", label: "CCTV" },
    { id: "electrical", label: "Electrical" },
    { id: "water", label: "Water" },
    { id: "welding", label: "Welding" },
];

const priceRanges = [
    { id: "all", label: "All Prices", min: 0, max: Infinity },
    { id: "under-500", label: "Under $500", min: 0, max: 500 },
    { id: "500-1000", label: "$500-$1,000", min: 500, max: 1000 },
    { id: "1000-2000", label: "$1,000-$2,000", min: 1000, max: 2000 },
    { id: "2000-5000", label: "$2,000-$5,000", min: 2000, max: 5000 },
    { id: "over-5000", label: "Over $5,000", min: 5000, max: Infinity },
];

const sortOptions = [
    { id: "featured", label: "Featured First" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Highest Rated" },
];

export default function Services() {
    // Fetch services from API
    const { data: services, isLoading, isError, error, refetch } = useServices();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("all");
    const [selectedSort, setSelectedSort] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);

    const filteredServices = useMemo(() => {
        if (!services) return [];
        let result = services.filter((service) => {
            // Category filter
            const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;

            // Search filter
            const matchesSearch = !searchQuery ||
                service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.brands.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

            // Price range filter
            let matchesPrice = true;
            if (selectedPriceRange !== "all") {
                const range = priceRanges.find(r => r.id === selectedPriceRange);
                if (range) {
                    matchesPrice = service.price >= range.min && service.price <= range.max;
                }
            }

            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Sort
        switch (selectedSort) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "featured":
            default:
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }

        return result;
    }, [services, selectedCategory, searchQuery, selectedPriceRange, selectedSort]);

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
            {/* Hero Section */}
            <View
                className="px-4 py-6"
                style={{ backgroundColor: TROJAN_NAVY }}
            >
                <Text className="text-2xl font-bold text-white">
                    Our Services
                </Text>
                <Text className="text-gray-300 mt-1">
                    Professional engineering solutions for every need
                </Text>

                {/* Search Bar */}
                <View className="bg-white rounded-full px-4 mt-4 flex-row items-center" style={{ height: 44 }}>
                    <Ionicons name="search" size={18} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search services, brands..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-2"
                        placeholderTextColor="#9CA3AF"
                        style={{ fontSize: 14 }}
                    />
                </View>
            </View>

            {/* Category Pills */}
            <View className="px-4 pt-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setSelectedCategory(cat.id)}
                            className="mr-2"
                        >
                            <View
                                className="px-4 py-2 rounded-full"
                                style={{
                                    backgroundColor: selectedCategory === cat.id ? TROJAN_NAVY : "white",
                                    borderWidth: selectedCategory === cat.id ? 0 : 1,
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                <Text
                                    className="text-sm font-medium"
                                    style={{
                                        color: selectedCategory === cat.id ? "white" : "#6B7280",
                                    }}
                                >
                                    {cat.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Filter Toggle */}
            <View className="px-4 pt-3 flex-row items-center justify-between">
                {!isLoading && !isError && (
                    <Text className="text-sm text-gray-500">
                        {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
                    </Text>
                )}
                {isLoading && <Text className="text-sm text-gray-500">Loading...</Text>}
                {isError && <Text className="text-sm text-red-500">Error loading services</Text>}
                <TouchableOpacity
                    onPress={() => setShowFilters(!showFilters)}
                    className="flex-row items-center"
                >
                    <Ionicons name="options-outline" size={18} color={TROJAN_NAVY} />
                    <Text className="ml-1 text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                        Filters
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <View className="px-4 pt-3 pb-2">
                    <View className="bg-white rounded-2xl p-4 border border-gray-100">
                        {/* Price Range */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-900 mb-2">
                                Price Range
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {priceRanges.map((range) => (
                                    <TouchableOpacity
                                        key={range.id}
                                        onPress={() => setSelectedPriceRange(range.id)}
                                        className="mr-2"
                                    >
                                        <View
                                            className="px-3 py-2 rounded-lg"
                                            style={{
                                                backgroundColor: selectedPriceRange === range.id ? `${TROJAN_GOLD}20` : "#F3F4F6",
                                                borderWidth: selectedPriceRange === range.id ? 1 : 0,
                                                borderColor: TROJAN_GOLD,
                                            }}
                                        >
                                            <Text
                                                className="text-xs font-medium"
                                                style={{
                                                    color: selectedPriceRange === range.id ? TROJAN_NAVY : "#6B7280",
                                                }}
                                            >
                                                {range.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Sort */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-900 mb-2">
                                Sort By
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => setSelectedSort(option.id)}
                                        className="mr-2"
                                    >
                                        <View
                                            className="px-3 py-2 rounded-lg"
                                            style={{
                                                backgroundColor: selectedSort === option.id ? `${TROJAN_GOLD}20` : "#F3F4F6",
                                                borderWidth: selectedSort === option.id ? 1 : 0,
                                                borderColor: TROJAN_GOLD,
                                            }}
                                        >
                                            <Text
                                                className="text-xs font-medium"
                                                style={{
                                                    color: selectedSort === option.id ? TROJAN_NAVY : "#6B7280",
                                                }}
                                            >
                                                {option.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            )}

            {/* Product Grid */}
            <View className="px-4 pt-2 pb-8">
                {/* Loading State */}
                {isLoading && (
                    isTablet ? (
                        <ServicesGridSkeleton count={6} />
                    ) : (
                        <ServicesListSkeleton count={4} />
                    )
                )}

                {/* Error State */}
                {isError && (
                    <View className="items-center justify-center py-12">
                        <Text className="text-5xl mb-3">⚠️</Text>
                        <Text className="text-lg font-medium text-gray-900">Failed to load services</Text>
                        <Text className="text-gray-500 mt-1 text-center px-4">
                            {error?.message || "An error occurred while fetching services"}
                        </Text>
                        <TouchableOpacity
                            onPress={refetch}
                            className="mt-4 px-6 py-3 rounded-full"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Services Grid */}
                {!isLoading && !isError && (
                    isTablet ? (
                        // Tablet: 2-column grid
                        <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
                            {filteredServices.map((service) => (
                                <View key={service.id} style={{ width: "50%", paddingHorizontal: 6, marginBottom: 12 }}>
                                    <ProductCard
                                        service={service}
                                        onPress={() => console.log("View service", service.slug)}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        // Mobile: Full-width list
                        <View style={{ gap: 12 }}>
                            {filteredServices.map((service) => (
                                <ProductCard
                                    key={service.id}
                                    service={service}
                                    onPress={() => console.log("View service", service.slug)}
                                />
                            ))}
                        </View>
                    )
                )}
            </View>

            {/* Empty State */}
            {!isLoading && !isError && filteredServices.length === 0 && (
                <View className="items-center justify-center py-12">
                    <Text className="text-5xl mb-3">🔍</Text>
                    <Text className="text-lg font-medium text-gray-900">No services found</Text>
                    <Text className="text-gray-500 mt-1">Try adjusting your filters</Text>
                </View>
            )}
        </ScrollView>
    );
}
