"use client";

import { useState, useMemo } from "react";
import { Sun, Camera, Zap, Droplets, Wrench, Search, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceCard } from "@/components/service-card";
import { StatsSection } from "@/components/stats-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { FAQSection } from "@/components/faq-section";
import { services } from "@/data/services";
import Link from "next/link";

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

export default function HomePage() {
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
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24" style={{ backgroundColor: "#F0F9FF" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight mb-4"
              style={{ color: TROJAN_NAVY }}
            >
              Find Professional Services
              <br />
              <span style={{ color: TROJAN_GOLD }}>You Can Trust</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our range of expert solar, electrical, security, and more services for your home and business.
            </p>
          </div>

          {/* Search Section */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search services or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full bg-white border-0 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-gray-400 shadow-md"
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

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* FAQ Section */}
      <FAQSection />

      <SiteFooter />

      {/* Floating Action Button for New Project Request */}
      <Link
        href="/projects/new"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
      >
        <Plus size={20} />
        <span className="font-semibold hidden sm:inline">New Project</span>
      </Link>
    </div>
  );
}
