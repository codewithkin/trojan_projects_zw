import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
} from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSignIn = async () => {
        setError(null);
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);
        try {
            await authClient.signIn.email(
                { email, password },
                {
                    onSuccess: () => {
                        router.replace("/(drawer)/(tabs)");
                    },
                    onError: (error) => {
                        if (error.error.status === 403) {
                            setError("Please verify your email address first");
                        } else {
                            setError(error.error.message || "Sign in failed");
                        }
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch (err) {
            setError("Google sign in failed");
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#ffffff" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 500 }}
                    >
                        <Card className="shadow-2xl">
                            <CardHeader className="items-center pb-2">
                                <MotiView
                                    from={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 200 }}
                                >
                                    <CardTitle
                                        className="text-2xl font-bold"
                                        style={{ color: TROJAN_NAVY }}
                                    >
                                        Welcome Back
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-center">
                                        Sign in to your Trojan Projects account
                                    </CardDescription>
                                </MotiView>
                            </CardHeader>

                            <CardContent className="gap-4">
                                {/* Google Sign In Button */}
                                <MotiView
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: "timing", delay: 300 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 flex-row items-center justify-center gap-2"
                                        onPress={handleGoogleSignIn}
                                    >
                                        <Text className="font-medium">Continue with Google</Text>
                                    </Button>
                                </MotiView>

                                {/* Divider */}
                                <View className="flex-row items-center my-2">
                                    <View className="flex-1 h-px bg-border" />
                                    <Text className="px-4 text-xs text-muted-foreground uppercase">
                                        Or continue with
                                    </Text>
                                    <View className="flex-1 h-px bg-border" />
                                </View>

                                {/* Error Message */}
                                {error && (
                                    <Text className="text-red-500 text-sm text-center">{error}</Text>
                                )}

                                {/* Email Form */}
                                <MotiView
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: "timing", delay: 400 }}
                                    className="gap-4"
                                >
                                    <View className="gap-2">
                                        <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>Email</Text>
                                        <Input
                                            placeholder="john@example.com"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            editable={!loading}
                                            className="h-10"
                                        />
                                    </View>

                                    <View className="gap-2">
                                        <View className="flex-row justify-between items-center mb-2">
                                            <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>Password</Text>
                                            <Pressable onPress={() => router.push("/forgot-password")}>
                                                <Text
                                                    className="text-xs"
                                                    style={{ color: TROJAN_NAVY }}
                                                >
                                                    Forgot password?
                                                </Text>
                                            </Pressable>
                                        </View>
                                        <Input
                                            placeholder="••••••••"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                            editable={!loading}
                                            className="h-10"
                                        />
                                    </View>

                                    <Button
                                        className="w-full h-10 font-semibold"
                                        style={{ backgroundColor: TROJAN_GOLD }}
                                        onPress={handleEmailSignIn}
                                        disabled={loading}
                                    >
                                        <Text
                                            className="font-semibold"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            {loading ? "Signing in..." : "Sign In"}
                                        </Text>
                                    </Button>
                                </MotiView>

                                {/* Sign Up Link */}
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: "timing", delay: 500 }}
                                    className="flex-row justify-center items-center"
                                >
                                    <Text className="text-sm text-muted-foreground">
                                        Don't have an account?{" "}
                                    </Text>
                                    <Pressable onPress={() => router.push("/signup")}>
                                        <Text
                                            className="text-sm font-semibold"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            Sign up
                                        </Text>
                                    </Pressable>
                                </MotiView>
                            </CardContent>
                        </Card>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
