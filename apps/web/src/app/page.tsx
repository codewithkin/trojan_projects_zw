"use client";

import { useState, useMemo, useEffect } from "react";
import { Sun, Camera, Zap, Droplets, Wrench, Search, ArrowRight, Plus, AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceCard } from "@/components/service-card";
import { StatsSection } from "@/components/stats-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { FAQSection } from "@/components/faq-section";
import { ServicesGridSkeleton } from "@/components/skeletons";
import { useServices } from "@/hooks/use-services";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";

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
  const { data: session } = useSession();

  // Log session on mount and when it changes
  useEffect(() => {
    console.log("🏠 Home Page - User Session:", session);
  }, [session]);

  // Fetch only 10 latest services for home page
  const { data: services, isLoading, isError, error, refetch } = useServices({ limit: 10 });

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((service) => {
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Hero Section - Bento Grid Style */}
      <section className="relative overflow-hidden py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              {/* Version Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 mb-6">
                <Settings size={14} className="text-gray-400" />
                <span>Professional Services</span>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ color: TROJAN_NAVY }}
              >
                Welcome to
                <br />
                <span className="italic" style={{ color: TROJAN_GOLD }}>quality</span> solutions
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Step into our world of professional engineering services, where expertise meets innovation, and every project brings lasting results.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="rounded-full px-6"
                    style={{ backgroundColor: TROJAN_NAVY, color: "white" }}
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-6 border-gray-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Bento Grid */}
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Main Image Card */}
                <div className="col-span-1 row-span-2">
                  <div className="relative h-full min-h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                    <Image
                      src="https://picsum.photos/seed/trojanmobile/400/600"
                      alt="Mobile app preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Stats Card 1 */}
                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex flex-col justify-center">
                  <span className="text-3xl sm:text-4xl font-bold" style={{ color: TROJAN_NAVY }}>500+</span>
                  <span className="text-sm text-gray-500 mt-1">Projects Completed</span>
                </div>

                {/* Stats Card 2 with Avatars */}
                <div className="bg-gray-50 rounded-2xl p-5 sm:p-6">
                  <span className="text-3xl sm:text-4xl font-bold" style={{ color: TROJAN_NAVY }}>2k+</span>
                  <span className="text-sm text-gray-500 mt-1 block">Happy Customers</span>
                  {/* Avatar Stack */}
                  <div className="flex -space-x-2 mt-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <Image
                          src={`https://picsum.photos/seed/user${i}/100/100`}
                          alt={`Customer ${i}`}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Card 3 */}
                <div className="col-span-2 bg-gray-50 rounded-2xl p-5 sm:p-6 flex items-center justify-between">
                  <div>
                    <span className="text-3xl sm:text-4xl font-bold" style={{ color: TROJAN_NAVY }}>10+</span>
                    <span className="text-sm text-gray-500 mt-1 block">Years Experience</span>
                  </div>
                  <div className="flex gap-2">
                    {["Solar", "CCTV", "Electrical"].map((service) => (
                      <span key={service} className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
              {["SunPower", "Hikvision", "Dahua", "JA Solar", "Growatt"].map((brand) => (
                <span key={brand} className="text-lg font-semibold text-gray-400">{brand}</span>
              ))}
            </div>
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

          {/* Search Section */}
          <div className="relative max-w-xl mb-6">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-gray-400"
            />
          </div>

          {/* Results Count */}
          {!isLoading && !isError && (
            <p className="text-sm text-gray-500 mb-6">
              Showing {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}
            </p>
          )}

          {/* Loading State */}
          {isLoading && (
            <ServicesGridSkeleton count={8} />
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <AlertCircle size={48} className="text-red-500" />
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: TROJAN_NAVY }}
              >
                Failed to load services
              </h3>
              <p className="text-gray-500 mb-4">
                {error instanceof Error ? error.message : "An error occurred while fetching services"}
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredServices.length === 0 && (
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
          <Link href="/chat">
            <Button
              size="lg"
              className="rounded-full px-8"
              style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
            >
              Get Free Quote
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
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
