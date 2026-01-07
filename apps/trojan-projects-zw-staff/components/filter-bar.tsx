import { View, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react-native";
import { Text } from "@/components/ui/text";

const TROJAN_NAVY = "#0F1B4D";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    categories?: FilterOption[];
    onCategoryChange?: (value: string) => void;
    selectedCategory?: string;
}

const defaultCategories: FilterOption[] = [
    { label: "All", value: "all" },
    { label: "Solar", value: "solar" },
    { label: "CCTV", value: "cctv" },
    { label: "Electrical", value: "electrical" },
    { label: "Water", value: "water" },
];

export function FilterBar({
    categories = defaultCategories,
    onCategoryChange,
    selectedCategory = "all",
}: FilterBarProps) {
    return (
        <View className="bg-white border-b border-gray-100 py-3">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
                {categories.map((category) => (
                    <Pressable
                        key={category.value}
                        onPress={() => onCategoryChange?.(category.value)}
                        className={`px-4 py-2 rounded-full ${selectedCategory === category.value
                                ? ""
                                : "bg-gray-100"
                            }`}
                        style={
                            selectedCategory === category.value
                                ? { backgroundColor: TROJAN_NAVY }
                                : {}
                        }
                    >
                        <Text
                            className={`text-sm font-medium ${selectedCategory === category.value
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                        >
                            {category.label}
                        </Text>
                    </Pressable>
                ))}

                {/* Filters Button */}
                <Pressable className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                    <SlidersHorizontal size={16} color="#374151" />
                    <Text className="text-sm font-medium text-gray-700">Filters</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
