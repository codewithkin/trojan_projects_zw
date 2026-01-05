"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sun, Camera, Zap, Droplets, Wrench, Phone, MapPin, Star, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categories = [
  { name: "Solar Power", icon: Sun, count: 3, color: "#FFC107" },
  { name: "CCTV Security", icon: Camera, count: 1, color: "#3B82F6" },
  { name: "Electrical", icon: Zap, count: 5, color: "#8B5CF6" },
  { name: "Water Systems", icon: Droplets, count: 4, color: "#06B6D4" },
  { name: "Welding", icon: Wrench, count: 2, color: "#F97316" },
];

const features = [
  { icon: Shield, title: "Quality Guaranteed", description: "Premium brands with warranty" },
  { icon: Clock, title: "Fast Installation", description: "Professional same-day service" },
  { icon: Award, title: "Expert Team", description: "Certified engineers" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="text-white text-center py-2 text-sm" style={{ backgroundColor: TROJAN_NAVY }}>
        <span className="mr-2">🔥</span>
        Get 20% Off on Solar Installations This Month
        <Link href="/services" className="ml-2 underline font-medium">
          Shop Now
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                ⚡ Trojan Projects
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/services" className="text-gray-600 hover:text-gray-900 font-medium">
                  Services
                </Link>
                <Link href="/services?category=solar" className="text-gray-600 hover:text-gray-900 font-medium">
                  Solar
                </Link>
                <Link href="/services?category=cctv" className="text-gray-600 hover:text-gray-900 font-medium">
                  CCTV
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full" style={{ backgroundColor: TROJAN_NAVY }}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#E8F5E9" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
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
                ⚡ Up to 30% Savings on Energy Bills
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: TROJAN_NAVY }}>
                Power Your Future with Solar Energy
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Professional solar installations, CCTV security, and electrical solutions.
                Trusted by hundreds of homes and businesses in Zimbabwe.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services">
                  <Button size="lg" className="rounded-full px-8" style={{ backgroundColor: TROJAN_NAVY }}>
                    Browse Services
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src={projects[0].images[0]}
                  alt="Solar Installation"
                  fill
                  className="object-cover rounded-2xl"
                />
                {/* Price Tag */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>US$750</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: TROJAN_NAVY }}>
              Popular Categories
            </h2>
            <p className="text-gray-600">Browse our comprehensive range of services</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/services?category=${category.name.toLowerCase().split(" ")[0]}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <category.icon size={32} style={{ color: category.color }} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} Services</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>Featured Services</h2>
              <p className="text-gray-600 mt-1">Our most popular solutions</p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="rounded-full">
                View All
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {index === 0 && (
                      <span
                        className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold"
                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                      >
                        Best Seller
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(121)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>{product.price}</span>
                        {product.priceRange && (
                          <p className="text-xs text-gray-400">{product.priceRange}</p>
                        )}
                      </div>
                      <Button size="sm" className="rounded-full" style={{ backgroundColor: TROJAN_NAVY }}>
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${TROJAN_GOLD}30` }}
                >
                  <feature.icon size={32} style={{ color: TROJAN_NAVY }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: TROJAN_NAVY }}>{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: TROJAN_NAVY }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers. Get a free quote for your project today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8" style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                Create Account
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <a href="tel:+263773412648">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-white border-white hover:bg-white/10">
                <Phone size={18} className="mr-2" />
                Call Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">⚡ Trojan Projects</h3>
              <p className="text-gray-400 text-sm">
                Your trusted partner for solar, electrical, and security solutions in Zimbabwe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/services" className="hover:text-white">Solar Systems</Link></li>
                <li><Link href="/services" className="hover:text-white">CCTV Installation</Link></li>
                <li><Link href="/services" className="hover:text-white">Electrical Work</Link></li>
                <li><Link href="/services" className="hover:text-white">Water Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/projects" className="hover:text-white">Our Projects</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone size={14} />
                  +263 77 341 2648
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} />
                  Mutare, Zimbabwe
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 Trojan Projects ZW. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
