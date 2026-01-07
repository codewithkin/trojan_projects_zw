"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

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
                        className="mx-auto"
                    />
                </div>

                {/* Error Icon */}
                <div className="mb-8">
                    <div
                        className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <AlertTriangle size={48} style={{ color: TROJAN_NAVY }} />
                    </div>
                    <div
                        className="w-32 h-1 mx-auto rounded-full"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    />
                </div>

                {/* Message */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: TROJAN_NAVY }}>
                    Something Went Wrong
                </h1>
                <p className="text-gray-600 mb-2 text-lg">
                    We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                </p>

                {process.env.NODE_ENV === "development" && (
                    <details className="mt-4 text-left bg-red-50 p-4 rounded-xl border border-red-200">
                        <summary className="text-sm font-medium text-red-800 cursor-pointer">
                            Error Details (Development Only)
                        </summary>
                        <pre className="mt-2 text-xs text-red-700 overflow-auto whitespace-pre-wrap">
                            {error.message}
                        </pre>
                    </details>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <Button
                        onClick={reset}
                        size="lg"
                        className="gap-2 rounded-full px-6"
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => window.location.href = "/"}
                        variant="outline"
                        size="lg"
                        className="gap-2 rounded-full px-6"
                        style={{ borderColor: TROJAN_NAVY, color: TROJAN_NAVY }}
                    >
                        <Home size={18} />
                        Go Home
                    </Button>
                </div>

                {/* Help text */}
                <p className="mt-12 text-sm text-gray-400">
                    Still having issues?{" "}
                    <a href="/chat" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                        <MessageCircle size={14} />
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
}
