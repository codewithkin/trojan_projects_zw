"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div
                        className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <AlertTriangle size={48} style={{ color: TROJAN_NAVY }} />
                    </div>
                    <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: TROJAN_GOLD }} />
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold mb-3" style={{ color: TROJAN_NAVY }}>
                    Something Went Wrong
                </h2>
                <p className="text-gray-600 mb-2">
                    We encountered an unexpected error. Don't worry, our team has been notified.
                </p>
                {process.env.NODE_ENV === "development" && (
                    <details className="mt-4 text-left bg-red-50 p-4 rounded-lg">
                        <summary className="text-sm font-medium text-red-800 cursor-pointer">
                            Error Details (Development Only)
                        </summary>
                        <pre className="mt-2 text-xs text-red-700 overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <Button
                        onClick={reset}
                        className="gap-2"
                        style={{ backgroundColor: TROJAN_NAVY }}
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => window.location.href = "/"}
                        variant="outline"
                        className="gap-2"
                        style={{ borderColor: TROJAN_NAVY, color: TROJAN_NAVY }}
                    >
                        <Home size={18} />
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
