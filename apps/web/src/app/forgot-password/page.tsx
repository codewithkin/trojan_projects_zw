"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { env } from "@trojan_projects_zw/env/web";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setSent(true);
                toast.success("Password reset instructions sent!");
            } else {
                toast.error(data.error || "Failed to send reset email");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
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
                            Check Your Email
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We&apos;ve sent password reset instructions to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Didn&apos;t receive the email? Check your spam folder or try again.
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => setSent(false)}
                                variant="outline"
                                className="w-full"
                            >
                                Try Another Email
                            </Button>
                            <Link href="/login" className="block">
                                <Button
                                    className="w-full"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
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
                        <Mail size={28} style={{ color: TROJAN_NAVY }} />
                    </div>
                    <CardTitle className="text-2xl" style={{ color: TROJAN_NAVY }}>
                        Forgot Password?
                    </CardTitle>
                    <CardDescription>
                        No worries! Enter your email and we&apos;ll send you reset instructions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Instructions"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
