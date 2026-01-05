"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const faqs = [
    {
        id: 1,
        question: "How long does a solar installation take?",
        answer: "A typical solar installation takes 1-2 days depending on the system size. Our team will provide a detailed timeline during the initial consultation. We handle everything from permits to installation and testing.",
    },
    {
        id: 2,
        question: "What warranty do you offer on your services?",
        answer: "We offer comprehensive warranties on all our services. Solar systems come with a 25-year warranty on panels and 10 years on inverters. CCTV systems have a 2-year warranty, and all installations include a 1-year workmanship guarantee.",
    },
    {
        id: 3,
        question: "Do you offer maintenance services?",
        answer: "Yes! We provide regular maintenance packages for all our services. This includes system checks, cleaning, performance optimization, and repairs. Our maintenance plans ensure your equipment operates at peak efficiency.",
    },
    {
        id: 4,
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including bank transfers, mobile money (EcoCash, OneMoney), and cash payments. We also offer flexible payment plans for larger projects to make our services more accessible.",
    },
    {
        id: 5,
        question: "How do I request a service?",
        answer: "Simply click the 'Request Service' button on any service card, fill in your details, and our team will contact you within 24 hours. Alternatively, you can call us directly or visit our office for an immediate consultation.",
    },
    {
        id: 6,
        question: "Are your technicians certified?",
        answer: "Absolutely! All our technicians are fully certified and licensed professionals with years of experience. They undergo regular training to stay updated with the latest industry standards and technologies.",
    },
];

interface FAQItemProps {
    faq: typeof faqs[0];
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}

function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold pr-8" style={{ color: TROJAN_NAVY }}>
                    {faq.question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} style={{ color: TROJAN_GOLD }} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQSection() {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleFAQ = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: TROJAN_NAVY }}>
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our services, warranties, and processes.
                        Can't find what you're looking for? Contact our support team.
                    </p>
                </motion.div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openId === faq.id}
                            onToggle={() => toggleFAQ(faq.id)}
                            index={index}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <button
                        className="px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: TROJAN_NAVY, color: "white" }}
                    >
                        Contact Support
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
