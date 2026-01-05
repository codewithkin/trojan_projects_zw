"use client";

import { useState, useMemo } from "react";
import { Sun, Camera, Zap, Droplets, Wrench, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
            const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

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
                    <div className="relative max-w-2xl">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-6 text-lg rounded-full bg-white border-0 placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mb-8">
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

                    {/* Results Count */}
                    <p className="text-sm text-gray-500 mb-6">
                        Showing {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
                    </p>

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
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
