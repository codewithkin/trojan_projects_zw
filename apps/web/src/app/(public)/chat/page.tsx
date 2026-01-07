"use client";

import { MessageCircle, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ChatPage() {
    const handleDownload = () => {
        // For now, just alert. You can update this to link to actual app stores
        alert("App download links coming soon! Check back later.");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <Card className="max-w-2xl w-full">
                <CardContent className="p-8 sm:p-12 text-center">
                    {/* Icon */}
                    <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <MessageCircle size={48} style={{ color: TROJAN_NAVY }} />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: TROJAN_NAVY }}>
                        Chat Support
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        Download our mobile app to chat with our support team in real-time
                    </p>

                    {/* Features */}
                    <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
                        <div className="flex flex-col items-center sm:items-start">
                            <div
                                className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center"
                                style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                            >
                                <MessageCircle size={24} style={{ color: TROJAN_NAVY }} />
                            </div>
                            <h3 className="font-semibold mb-1" style={{ color: TROJAN_NAVY }}>
                                Real-time Chat
                            </h3>
                            <p className="text-sm text-gray-500 text-center sm:text-left">
                                Instant messaging with our team
                            </p>
                        </div>

                        <div className="flex flex-col items-center sm:items-start">
                            <div
                                className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center"
                                style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                            >
                                <Smartphone size={24} style={{ color: TROJAN_NAVY }} />
                            </div>
                            <h3 className="font-semibold mb-1" style={{ color: TROJAN_NAVY }}>
                                Mobile First
                            </h3>
                            <p className="text-sm text-gray-500 text-center sm:text-left">
                                Optimized for on-the-go support
                            </p>
                        </div>

                        <div className="flex flex-col items-center sm:items-start">
                            <div
                                className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center"
                                style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                            >
                                <Download size={24} style={{ color: TROJAN_NAVY }} />
                            </div>
                            <h3 className="font-semibold mb-1" style={{ color: TROJAN_NAVY }}>
                                Free Download
                            </h3>
                            <p className="text-sm text-gray-500 text-center sm:text-left">
                                Available on iOS and Android
                            </p>
                        </div>
                    </div>

                    {/* Download Button */}
                    <Button
                        size="lg"
                        onClick={handleDownload}
                        className="px-8 py-6 text-lg font-semibold"
                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                    >
                        <Download size={24} className="mr-3" />
                        Download Mobile App
                    </Button>

                    {/* Alternative Contact */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="tel:+263123456789" className="text-sm font-medium hover:underline" style={{ color: TROJAN_NAVY }}>
                                Call: +263 123 456 789
                            </a>
                            <span className="hidden sm:inline text-gray-300">|</span>
                            <a href="mailto:support@trojanprojects.co.zw" className="text-sm font-medium hover:underline" style={{ color: TROJAN_NAVY }}>
                                Email: support@trojanprojects.co.zw
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
