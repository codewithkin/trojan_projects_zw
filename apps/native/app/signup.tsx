import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
} from "react-native";
import { MotiView } from "moti";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/error-message";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSignUp = async () => {
        setError(null);
        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            await authClient.signUp.email(
                { name, email, password },
                {
                    onSuccess: () => {
                        router.push("/user-onboarding");
                    },
                    onError: (error) => {
                        setError(error.error.message || "Sign up failed");
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        setError(null);
        // Social sign-in redirects, so we don't catch errors here
        await authClient.signIn.social({
            provider: "google",
        });
        // Loading state will persist during redirect
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
                        <Card>
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
                                        Create Account
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-center">
                                        Join Trojan Projects ZW today
                                    </CardDescription>
                                </MotiView>
                            </CardHeader>

                            <CardContent className="gap-4">
                                {/* Google Sign Up Button */}
                                <MotiView
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: "timing", delay: 300 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 flex-row items-center justify-center gap-2 active:bg-gray-300"
                                        style={{
                                            backgroundColor: "transparent",
                                        }}
                                        android_ripple={{ color: "#AAAAAA" }}
                                        onPress={handleGoogleSignUp}
                                        disabled={googleLoading}
                                    >
                                        <Text className="font-medium">{googleLoading ? "Connecting..." : "Continue with Google"}</Text>
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
                                <ErrorMessage message={error} />

                                {/* Email Form */}
                                <MotiView
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: "timing", delay: 400 }}
                                    className="gap-4"
                                >
                                    <View className="gap-2">
                                        <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>Full Name</Text>
                                        <Input
                                            placeholder="John Doe"
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                            editable={!loading}
                                            className="h-10"
                                        />
                                    </View>

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
                                        <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>Password</Text>
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
                                        onPress={handleEmailSignUp}
                                        disabled={loading}
                                    >
                                        <Text
                                            className="font-semibold"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            {loading ? "Creating account..." : "Create Account"}
                                        </Text>
                                    </Button>
                                </MotiView>

                                {/* Sign In Link */}
                                <MotiView
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: "timing", delay: 500 }}
                                    className="flex-row justify-center items-center"
                                >
                                    <Text className="text-sm text-muted-foreground">
                                        Already have an account?{" "}
                                    </Text>
                                    <Pressable onPress={() => router.push("/login")}>
                                        <Text
                                            className="text-sm font-semibold"
                                            style={{ color: TROJAN_NAVY }}
                                        >
                                            Sign in
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
