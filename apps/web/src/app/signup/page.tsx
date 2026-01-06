"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/error-message";
import { authClient, useSession } from "@/lib/auth-client";

export default function SignUpPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Log session on mount and when it changes
    useEffect(() => {
      console.log("📝 Sign Up Page - User Session:", session);
    }, [session]);

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        await authClient.signUp.email(
            { name, email, password },
            {
                onSuccess: () => {
                    toast.success("Account created! Please check your email to verify.");
                    router.push("/user-onboarding");
                },
                onError: (error) => {
                    setError(error.error.message || "Sign up failed");
                    toast.error(error.error.message || "Sign up failed");
                },
            }
        );
        setLoading(false);
    };

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        setError(null);
        // Social sign-in redirects, so we don't catch errors here
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/user-onboarding",
        });
        // Loading state will persist during redirect
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-0">
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <CardTitle className="text-2xl font-bold" style={{ color: "#0F1B4D" }}>
                                Create Account
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Join Trojan Projects ZW today
                            </CardDescription>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-10 gap-2"
                                onClick={handleGoogleSignUp}
                                disabled={googleLoading}
                            >
                                <svg className="size-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {googleLoading ? "Connecting..." : "Continue with Google"}
                            </Button>
                        </motion.div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <ErrorMessage message={error} />

                        <motion.form
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            onSubmit={handleEmailSignUp}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="h-10"
                                />
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    className="w-full h-10 text-white"
                                    style={{ backgroundColor: "#FFC107", color: "#0F1B4D" }}
                                    disabled={loading}
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                            </motion.div>
                        </motion.form>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center text-sm text-muted-foreground"
                        >
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold hover:underline"
                                style={{ color: "#0F1B4D" }}
                            >
                                Sign in
                            </Link>
                        </motion.p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
