import { useState } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { ProductCard } from "@/components/product-card";
import { FilterBar } from "@/components/filter-bar";
import { projects } from "@/data/projects";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const categories = ["All", "Solar", "CCTV", "Electrical", "Water", "Welding"];

export default function Services() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredProducts = projects.filter((product) => {
        if (selectedCategory === "All") return true;
        return product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    });

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
                <View className="flex-row items-center mt-3">
                    <View className="bg-white/20 rounded-full px-3 py-1 mr-2">
                        <Text className="text-white text-sm">🔥 {projects.length}+ Solutions</Text>
                    </View>
                    <View className="bg-white/20 rounded-full px-3 py-1">
                        <Text className="text-white text-sm">⚡ Free Quotes</Text>
                    </View>
                </View>
            </View>

            {/* Filter Bar */}
            <FilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Results Count */}
            <View className="px-4 pt-2 pb-2">
                <Text className="text-sm text-gray-500">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? "service" : "services"}
                </Text>
            </View>

            {/* Product Grid */}
            <View className="px-4 pb-8">
                <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
                    {filteredProducts.map((product) => (
                        <View key={product.id} style={{ width: CARD_WIDTH, paddingHorizontal: 6, marginBottom: 12 }}>
                            <ProductCard
                                product={product}
                                onPress={() => console.log("View product", product.id)}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <View className="items-center justify-center py-12">
                    <Text className="text-5xl mb-3">🔍</Text>
                    <Text className="text-lg font-medium text-gray-900">No services found</Text>
                    <Text className="text-gray-500 mt-1">Try a different category</Text>
                </View>
            )}
        </ScrollView>
    );
}
