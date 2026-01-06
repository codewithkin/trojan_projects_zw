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
import { signUp } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-session";

export default function SignUpPage() {
    const router = useRouter();
    const { user, isPending } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Log session on mount and when it changes
    useEffect(() => {
        console.log("📝 Sign Up Page - User Session:", user);
    }, [user]);

    // Redirect if already logged in
    useEffect(() => {
        if (!isPending && user) {
            router.push("/");
        }
    }, [user, isPending, router]);

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await signUp({ name, email, password });

            if (response.success) {
                toast.success("Account created successfully!");
                router.push("/user-onboarding");
            } else {
                setError(response.error || "Sign up failed");
                toast.error(response.error || "Sign up failed");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Sign up failed";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
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
