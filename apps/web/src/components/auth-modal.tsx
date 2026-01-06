"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import { toast } from "sonner";

interface AuthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    message?: string;
}

export function AuthModal({ open, onOpenChange, onSuccess, message }: AuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setName("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const response = await signUp({
                    email,
                    password,
                    name,
                });

                if (!response.success) {
                    toast.error(response.error || "Sign up failed");
                } else {
                    toast.success("Account created successfully!");
                    setIsSignUp(false);
                    resetForm();
                    onOpenChange(false);
                    onSuccess?.();
                    router.refresh();
                }
            } else {
                const response = await signIn({
                    email,
                    password,
                });

                if (!response.success) {
                    toast.error(response.error || "Sign in failed");
                } else {
                    toast.success("Signed in successfully!");
                    resetForm();
                    onOpenChange(false);
                    onSuccess?.();
                    router.refresh();
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isSignUp ? "Create an Account" : "Sign In"}</DialogTitle>
                    <DialogDescription>
                        {message || (isSignUp
                            ? "Create an account to save favorites and access exclusive features"
                            : "Sign in to your account to continue")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {isSignUp && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-4">
                    {isSignUp ? (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignUp(false)}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign in
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignUp(true)}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
