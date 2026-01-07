"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { env } from "@trojan_projects_zw/env/web";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setError("Invalid or missing reset code");
        }
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, password }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                toast.success("Password reset successfully!");
            } else {
                toast.error(data.error || "Failed to reset password");
                if (data.error?.includes("expired") || data.error?.includes("Invalid")) {
                    setError(data.error);
                }
            }
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Error state - invalid or expired code
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-8 pb-8 text-center">
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ backgroundColor: "#FEE2E2" }}
                        >
                            <XCircle size={32} className="text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                            Invalid Reset Link
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {error}
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Please request a new password reset link.
                        </p>
                        <Link href="/forgot-password" className="block">
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            >
                                Request New Link
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-8 pb-8 text-center">
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ backgroundColor: "#DCFCE7" }}
                        >
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                            Password Reset Successful!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Your password has been reset successfully. You can now log in with your new password.
                        </p>
                        <Link href="/login" className="block">
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            >
                                Go to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Login
                    </Link>
                    <div
                        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                    >
                        <Lock size={28} style={{ color: TROJAN_NAVY }} />
                    </div>
                    <CardTitle className="text-2xl" style={{ color: TROJAN_NAVY }}>
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#FFC107] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
