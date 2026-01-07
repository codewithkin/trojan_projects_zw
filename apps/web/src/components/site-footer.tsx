"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export function SiteFooter() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="mb-4">
                            <Image src="/trojan-logo.svg" alt="Trojan Projects" width={160} height={48} />
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Professional solar, electrical, and security solutions for homes and businesses in Zimbabwe.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/catalog?category=solar" className="hover:text-gray-900">Solar Power Systems</Link></li>
                            <li><Link href="/catalog?category=cctv" className="hover:text-gray-900">CCTV & Security</Link></li>
                            <li><Link href="/catalog?category=electrical" className="hover:text-gray-900">Electrical Services</Link></li>
                            <li><Link href="/catalog?category=water" className="hover:text-gray-900">Water Solutions</Link></li>
                            <li><Link href="/catalog?category=welding" className="hover:text-gray-900">Welding & Fabrication</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
                            <li><Link href="/catalog" className="hover:text-gray-900">Browse Services</Link></li>
                            <li><Link href="/about" className="hover:text-gray-900">About Us</Link></li>
                            <li><Link href="/chat" className="hover:text-gray-900">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <Phone size={16} style={{ color: TROJAN_GOLD }} />
                                <span>+263 77 123 4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} style={{ color: TROJAN_GOLD }} />
                                <span>info@trojanprojects.co.zw</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: TROJAN_GOLD }} />
                                <span>Mutare, Zimbabwe</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Trojan Projects ZW. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
