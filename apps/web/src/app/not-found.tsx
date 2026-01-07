import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
            <div className="max-w-lg w-full text-center">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/trojan-logo.svg"
                        alt="Trojan Projects"
                        width={180}
                        height={45}
                        className="mx-auto mb-8"
                    />
                </div>

                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div
                        className="text-[140px] sm:text-[180px] font-bold leading-none select-none"
                        style={{
                            color: TROJAN_NAVY,
                            textShadow: `4px 4px 0 ${TROJAN_GOLD}`,
                        }}
                    >
                        404
                    </div>
                    <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    />
                </div>

                {/* Message */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: TROJAN_NAVY }}>
                    Page Not Found
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="gap-2 rounded-full px-6"
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        <Link href="/">
                            <Home size={18} />
                            Go Home
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="gap-2 rounded-full px-6"
                        style={{ borderColor: TROJAN_NAVY, color: TROJAN_NAVY }}
                    >
                        <Link href="/projects">
                            <Search size={18} />
                            Browse Services
                        </Link>
                    </Button>
                </div>

                {/* Help text */}
                <p className="mt-12 text-sm text-gray-400">
                    Need help? <Link href="/chat" className="text-blue-600 hover:underline">Contact support</Link>
                </p>
            </div>
        </div>
    );
}
