import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                {/* Logo/Brand */}
                <div className="mb-8">
                    <h1 className="text-6xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                        404
                    </h1>
                    <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: TROJAN_GOLD }} />
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold mb-3" style={{ color: TROJAN_NAVY }}>
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        asChild
                        className="gap-2"
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
                        className="gap-2"
                        style={{ borderColor: TROJAN_NAVY, color: TROJAN_NAVY }}
                    >
                        <Link href="/services">
                            <Search size={18} />
                            Browse Services
                        </Link>
                    </Button>
                </div>

                {/* Illustration */}
                <div className="mt-12">
                    <div
                        className="w-48 h-48 mx-auto rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <span className="text-7xl">🔍</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
