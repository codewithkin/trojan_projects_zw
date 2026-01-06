"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { FilterBar } from "@/components/filter-bar";
import { HeroBanner } from "@/components/hero-banner";

const TROJAN_NAVY = "#0F1B4D";

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");

    // Mock products for display
    const projects = [];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...projects];

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter((product) => {
                const name = product.name.toLowerCase();
                if (selectedCategory === "solar") return name.includes("kva") || name.includes("solar");
                if (selectedCategory === "cctv") return name.includes("cctv");
                return true;
            });
        }

        // Sort
        if (sortBy === "price-asc") {
            filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, "")));
        } else if (sortBy === "price-desc") {
            filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, "")));
        }

        return filtered;
    }, [selectedCategory, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Banner */}
                <HeroBanner
                    title="Professional Solar & Security Solutions"
                    subtitle="Quality installations from trusted brands. Power your home or secure your property with our expert engineering services."
                    highlight="Up to 30% Savings"
                    ctaText="Get a Quote"
                    ctaLink="/quotes"
                    productImage="https://picsum.photos/seed/solar1/400/400"
                />

                {/* Filter Bar */}
                <div className="mt-8">
                    <FilterBar
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        onSortChange={setSortBy}
                    />
                </div>

                {/* Section Title */}
                <div className="mt-8 mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        {selectedCategory === "all" ? "All Services" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Solutions`}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "service" : "services"} available
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            priceRange={product.priceRange}
                            description={product.description}
                            image={product.images[0]}
                            brands={product.brands}
                            isFeatured={index === 0}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No services found in this category.</p>
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className="mt-4 text-sm font-medium"
                            style={{ color: TROJAN_NAVY }}
                        >
                            View all services
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
