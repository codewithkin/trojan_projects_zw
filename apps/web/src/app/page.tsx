"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Camera, Zap, Droplets, Wrench, Search, ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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

const features = [
    { icon: Shield, title: "Quality Guaranteed", description: "Premium brands with warranty" },
    { icon: Clock, title: "Fast Service", description: "Quick turnaround times" },
    { icon: Award, title: "Expert Team", description: "Certified professionals" },
];

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = services.filter((service) => {
        const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden" style={{ backgroundColor: "#F0F9FF" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            >
                                ⚡ Professional Engineering Services
                            </span>
                            <h1 
                                className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                                style={{ color: TROJAN_NAVY }}
                            >
                                Power Your Home<br />
                                With Expert Solutions
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Solar installations, CCTV security, electrical services, and more.
                                Trusted by hundreds of homes and businesses across Zimbabwe.
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-6">
                                {features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={feature.title} className="flex items-center gap-2">
                                            <div 
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${TROJAN_GOLD}30` }}
                                            >
                                                <Icon size={20} style={{ color: TROJAN_NAVY }} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm" style={{ color: TROJAN_NAVY }}>
                                                    {feature.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div 
                                className="w-full h-80 rounded-3xl flex items-center justify-center"
                                style={{ backgroundColor: `${TROJAN_NAVY}10` }}
                            >
                                <span className="text-8xl">⚡🔌🔧</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 
                                className="text-2xl md:text-3xl font-bold mb-2"
                                style={{ color: TROJAN_NAVY }}
                            >
                                Our Services
                            </h2>
                            <p className="text-gray-600">
                                Browse our range of professional services
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-full bg-white"
                            />
                        </div>
                    </div>

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
                        {filteredServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <ServiceCard service={service} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredServices.length === 0 && (
                        <div className="text-center py-16">
                            <span className="text-5xl mb-4 block">🔍</span>
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
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16" style={{ backgroundColor: TROJAN_NAVY }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Need a Custom Solution?
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Contact us for a free consultation and quote. Our experts will assess your needs
                        and provide a tailored solution for your home or business.
                    </p>
                    <Button
                        size="lg"
                        className="rounded-full px-8"
                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                    >
                        Get Free Quote
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
