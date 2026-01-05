"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    categories?: FilterOption[];
    onCategoryChange?: (value: string) => void;
    onSortChange?: (value: string) => void;
    selectedCategory?: string;
}

const sortOptions: FilterOption[] = [
    { label: "Popular", value: "popular" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest", value: "newest" },
];

const defaultCategories: FilterOption[] = [
    { label: "All", value: "all" },
    { label: "Solar", value: "solar" },
    { label: "CCTV", value: "cctv" },
    { label: "Electrical", value: "electrical" },
    { label: "Water", value: "water" },
    { label: "Welding", value: "welding" },
];

export function FilterBar({
    categories = defaultCategories,
    onCategoryChange,
    onSortChange,
    selectedCategory = "all",
}: FilterBarProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("popular");

    return (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => onCategoryChange?.(category.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.value
                                    ? "text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            style={
                                selectedCategory === category.value
                                    ? { backgroundColor: TROJAN_NAVY }
                                    : {}
                            }
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* All Filters Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="rounded-full"
                    >
                        <SlidersHorizontal size={16} className="mr-2" />
                        All Filters
                    </Button>

                    {/* Sort Dropdown */}
                    <div className="relative group">
                        <Button variant="outline" size="sm" className="rounded-full">
                            Sort by
                            <ChevronDown size={16} className="ml-2" />
                        </Button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        onSortChange?.(option.value);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${sortBy === option.value ? "font-semibold" : ""
                                        }`}
                                    style={sortBy === option.value ? { color: TROJAN_NAVY } : {}}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
