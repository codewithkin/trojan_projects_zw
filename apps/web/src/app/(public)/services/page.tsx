"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { FilterBar } from "@/components/filter-bar";
import { HeroBanner } from "@/components/hero-banner";
import { useServices } from "@/hooks/use-services";
import { ServicesGridSkeleton } from "@/components/skeletons";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const TROJAN_NAVY = "#0F1B4D";

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch services from API with pagination
    const { data: services, isLoading, isError } = useServices({
        category: selectedCategory,
        page: currentPage,
        limit: itemsPerPage
    });

    // Filter and sort services
    const filteredProducts = useMemo(() => {
        if (!services) return [];
        let filtered = [...services];

        // Sort
        if (sortBy === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        return filtered;
    }, [services, sortBy]);

    // Calculate total pages (assuming API returns total count)
    const totalPages = Math.ceil((services?.length || 0) / itemsPerPage);

    // Handle category change - reset to page 1
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Banner */}
            <HeroBanner
                title="Professional Solar & Security Solutions"
                subtitle="Quality installations from trusted brands. Power your home or secure your property with our expert engineering services."
                highlight="Up to 30% Savings"
                ctaText="Get a Quote"
                ctaLink="/quotes/new"
                productImage="https://picsum.photos/seed/solar1/400/400"
            />

            {/* Filter Bar */}
            <div className="mt-8">
                <FilterBar
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={setSortBy}
                />
            </div>

            {/* Section Title */}
            <div className="mt-8 mb-6">
                <h2 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                    {selectedCategory === "all" ? "All Services" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Solutions`}
                </h2>
                <p className="text-gray-500 mt-1">
                    {isLoading ? "Loading..." : `${filteredProducts.length} ${filteredProducts.length === 1 ? "service" : "services"} available`}
                </p>
            </div>

            {/* Loading State */}
            {isLoading && <ServicesGridSkeleton />}

            {/* Error State */}
            {isError && (
                <div className="text-center py-16">
                    <p className="text-red-500 text-lg">Failed to load services</p>
                </div>
            )}

            {/* Products Grid */}
            {!isLoading && !isError && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.priceFormatted}
                                description={product.description}
                                image={product.images[0]}
                                brands={product.brands}
                                isFeatured={product.featured}
                                rating={product.rating}
                                reviewCount={product.reviewCount}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(page)}
                                                isActive={currentPage === page}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No services found in this category.</p>
                    <button
                        onClick={() => handleCategoryChange("all")}
                        className="mt-4 text-sm font-medium"
                        style={{ color: TROJAN_NAVY }}
                    >
                        View all services
                    </button>
                </div>
            )}
        </div>
    );
}
