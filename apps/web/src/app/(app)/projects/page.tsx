"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sun, Camera, Zap, Droplets, Wrench, Search, SlidersHorizontal, X, Star, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categories = [
    { id: "all", name: "All Services", icon: null },
    { id: "solar", name: "Solar", icon: Sun, color: "#FFC107" },
    { id: "cctv", name: "CCTV", icon: Camera, color: "#3B82F6" },
    { id: "electrical", name: "Electrical", icon: Zap, color: "#8B5CF6" },
    { id: "water", name: "Water", icon: Droplets, color: "#06B6D4" },
    { id: "welding", name: "Welding", icon: Wrench, color: "#F97316" },
];

const priceRanges = [
    { id: "all", label: "All Prices", min: 0, max: Infinity },
    { id: "under-500", label: "Under $500", min: 0, max: 500 },
    { id: "500-1000", label: "$500 - $1,000", min: 500, max: 1000 },
    { id: "1000-2000", label: "$1,000 - $2,000", min: 1000, max: 2000 },
    { id: "2000-5000", label: "$2,000 - $5,000", min: 2000, max: 5000 },
    { id: "over-5000", label: "Over $5,000", min: 5000, max: Infinity },
];

const sortOptions = [
    { id: "featured", label: "Featured First" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Highest Rated" },
    { id: "name", label: "Name A-Z" },
];

const ratingFilters = [
    { id: "all", label: "All Ratings", minRating: 0 },
    { id: "4-plus", label: "4+ Stars", minRating: 4 },
    { id: "4.5-plus", label: "4.5+ Stars", minRating: 4.5 },
];

// Helper to extract numeric price from string like "US$3,950.00"
const extractPrice = (priceStr: string): number => {
    const match = priceStr.replace(/[,\s]/g, "").match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
};

export default function ServicesPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("all");
    const [selectedSort, setSelectedSort] = useState("featured");
    const [selectedRating, setSelectedRating] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [customMinPrice, setCustomMinPrice] = useState("");
    const [customMaxPrice, setCustomMaxPrice] = useState("");

    // Update category when URL param changes
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedCategory !== "all") count++;
        if (selectedPriceRange !== "all") count++;
        if (selectedRating !== "all") count++;
        if (featuredOnly) count++;
        if (customMinPrice || customMaxPrice) count++;
        return count;
    }, [selectedCategory, selectedPriceRange, selectedRating, featuredOnly, customMinPrice, customMaxPrice]);

    const clearAllFilters = () => {
        setSelectedCategory("all");
        setSelectedPriceRange("all");
        setSelectedRating("all");
        setFeaturedOnly(false);
        setCustomMinPrice("");
        setCustomMaxPrice("");
        setSearchQuery("");
    };

    const filteredServices = useMemo(() => {
        let result = services.filter((service) => {
            // Category filter
            const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;

            // Search filter
            const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.brands.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

            // Price range filter
            const price = extractPrice(service.price);
            let matchesPrice = true;

            if (customMinPrice || customMaxPrice) {
                const min = customMinPrice ? parseFloat(customMinPrice) : 0;
                const max = customMaxPrice ? parseFloat(customMaxPrice) : Infinity;
                matchesPrice = price >= min && price <= max;
            } else if (selectedPriceRange !== "all") {
                const range = priceRanges.find(r => r.id === selectedPriceRange);
                if (range) {
                    matchesPrice = price >= range.min && price <= range.max;
                }
            }

            // Rating filter
            const ratingFilter = ratingFilters.find(r => r.id === selectedRating);
            const matchesRating = ratingFilter ? (service.rating || 0) >= ratingFilter.minRating : true;

            // Featured filter
            const matchesFeatured = !featuredOnly || service.featured;

            return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesFeatured;
        });

        // Sort
        switch (selectedSort) {
            case "price-low":
                result.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
                break;
            case "price-high":
                result.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
                break;
            case "rating":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "name":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "featured":
            default:
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }

        return result;
    }, [selectedCategory, searchQuery, selectedPriceRange, selectedSort, selectedRating, featuredOnly, customMinPrice, customMaxPrice]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-12" style={{ backgroundColor: TROJAN_NAVY }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Our Services
                    </h1>
                    <p className="text-gray-300 mb-6">
                        Professional engineering solutions for every need
                    </p>

                    {/* Search Bar */}
                    <div className="flex gap-2 max-w-2xl">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search services, brands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-6 text-lg rounded-full bg-white border-0 placeholder:text-gray-400"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full bg-white border-0 px-6"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={20} className="mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span
                                    className="ml-2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Filters Panel */}
            {showFilters && (
                <section className="bg-white border-b border-gray-100 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filters</h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                >
                                    <X size={14} />
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Price Range */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Price Range
                                </label>
                                <select
                                    value={selectedPriceRange}
                                    onChange={(e) => {
                                        setSelectedPriceRange(e.target.value);
                                        setCustomMinPrice("");
                                        setCustomMaxPrice("");
                                    }}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                >
                                    {priceRanges.map((range) => (
                                        <option key={range.id} value={range.id}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        type="number"
                                        placeholder="Min $"
                                        value={customMinPrice}
                                        onChange={(e) => {
                                            setCustomMinPrice(e.target.value);
                                            setSelectedPriceRange("all");
                                        }}
                                        className="text-sm"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max $"
                                        value={customMaxPrice}
                                        onChange={(e) => {
                                            setCustomMaxPrice(e.target.value);
                                            setSelectedPriceRange("all");
                                        }}
                                        className="text-sm"
                                    />
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Minimum Rating
                                </label>
                                <select
                                    value={selectedRating}
                                    onChange={(e) => setSelectedRating(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                >
                                    {ratingFilters.map((rating) => (
                                        <option key={rating.id} value={rating.id}>
                                            {rating.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Featured Only */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Other
                                </label>
                                <button
                                    onClick={() => setFeaturedOnly(!featuredOnly)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${featuredOnly
                                        ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    <Star size={16} className={featuredOnly ? "fill-yellow-400" : ""} />
                                    Featured Only
                                    {featuredOnly && <Check size={14} className="ml-auto" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Services Section */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                                        ${isActive
                                            ? "text-white"
                                            : "text-gray-600 bg-white border border-gray-200 hover:border-gray-300"
                                        }
                                    `}
                                    style={isActive ? { backgroundColor: TROJAN_NAVY } : {}}
                                >
                                    {Icon && <Icon size={16} />}
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Results Info */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-500">
                            Showing {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
                        </p>
                        {activeFiltersCount > 0 && (
                            <p className="text-sm text-gray-500">
                                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
                            </p>
                        )}
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredServices.map((service) => (
                            <div key={service.id}>
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredServices.length === 0 && (
                        <div className="text-center py-16">
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: TROJAN_NAVY }}
                            >
                                No services found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search or filter criteria
                            </p>
                            <Button
                                variant="outline"
                                onClick={clearAllFilters}
                                className="rounded-full"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
