"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface HeroBannerProps {
    title: string;
    subtitle: string;
    highlight?: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: string;
    productImage?: string;
}

export function HeroBanner({
    title,
    subtitle,
    highlight,
    ctaText,
    ctaLink,
    backgroundImage,
    productImage,
}: HeroBannerProps) {
    return (
        <div
            className="relative rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#E8F5E9" }}
        >
            <div className="flex flex-col md:flex-row items-center">
                {/* Content */}
                <div className="flex-1 p-8 md:p-12 z-10">
                    {highlight && (
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                        >
                            {highlight}
                        </motion.span>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                        style={{ color: TROJAN_NAVY }}
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 mb-6 max-w-md"
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href={ctaLink}>
                            <Button
                                size="lg"
                                className="rounded-full px-8"
                                style={{ backgroundColor: TROJAN_NAVY }}
                            >
                                {ctaText}
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Product Image */}
                {productImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 relative h-64 md:h-80 w-full"
                    >
                        <Image
                            src={productImage}
                            alt="Featured product"
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
