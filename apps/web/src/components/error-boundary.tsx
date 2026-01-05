"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-lg">
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                            style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                        >
                            <AlertTriangle size={32} style={{ color: TROJAN_GOLD }} />
                        </div>
                        <h2
                            className="text-2xl font-bold mb-2"
                            style={{ color: TROJAN_NAVY }}
                        >
                            Oops! Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        {this.state.error && (
                            <details className="text-left mb-6">
                                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                                    Error details
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-auto">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-full"
                                onClick={() => window.location.href = "/"}
                            >
                                Go Home
                            </Button>
                            <Button
                                className="flex-1 rounded-full font-semibold"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
