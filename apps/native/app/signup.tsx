import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
    StatusBar,
} from "react-native";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sun, Zap, Shield, CheckCircle } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/error-message";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const benefits = [
    "Free quotes on all services",
    "Track project progress",
    "24/7 support access",
];

export default function SignUpScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
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
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <View className="flex-1" style={{ backgroundColor: TROJAN_NAVY }}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Hero Section */}
                    <View
                        style={{
                            paddingTop: insets.top + 32,
                            paddingBottom: 32,
                            paddingHorizontal: 24,
                        }}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 600 }}
                        >
                            {/* Logo */}
                            <View className="flex-row items-center mb-5">
                                <View
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        backgroundColor: TROJAN_GOLD,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Zap size={26} color={TROJAN_NAVY} />
                                </View>
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 22,
                                        fontWeight: "700",
                                        marginLeft: 12,
                                    }}
                                >
                                    Trojan Projects
                                </Text>
                            </View>

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 28,
                                    fontWeight: "700",
                                    lineHeight: 36,
                                }}
                            >
                                Start Your Journey{"\n"}With Us Today
                            </Text>

                            {/* Benefits */}
                            <View style={{ marginTop: 16 }}>
                                {benefits.map((benefit) => (
                                    <View
                                        key={benefit}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: 8,
                                        }}
                                    >
                                        <CheckCircle size={16} color={TROJAN_GOLD} />
                                        <Text
                                            style={{
                                                color: "rgba(255,255,255,0.8)",
                                                fontSize: 14,
                                                marginLeft: 10,
                                            }}
                                        >
                                            {benefit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </MotiView>
                    </View>

                    {/* Form Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 40 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 600, delay: 200 }}
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            paddingHorizontal: 24,
                            paddingTop: 28,
                            paddingBottom: insets.bottom + 24,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: "700",
                                color: TROJAN_NAVY,
                                marginBottom: 6,
                            }}
                        >
                            Create Account
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#6B7280",
                                marginBottom: 20,
                            }}
                        >
                            Sign up to get started
                        </Text>

                        {/* Google Sign Up */}
                        <Button
                            variant="outline"
                            className="w-full h-14 flex-row items-center justify-center gap-2"
                            style={{
                                borderColor: "#E5E7EB",
                                borderRadius: 14,
                            }}
                            onPress={handleGoogleSignUp}
                            disabled={googleLoading}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "#374151" }}>
                                {googleLoading ? "Connecting..." : "Continue with Google"}
                            </Text>
                        </Button>

                        {/* Divider */}
                        <View className="flex-row items-center my-5">
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text
                                style={{
                                    paddingHorizontal: 14,
                                    fontSize: 13,
                                    color: "#9CA3AF",
                                }}
                            >
                                or sign up with email
                            </Text>
                            <View className="flex-1 h-px bg-gray-200" />
                        </View>

                        {/* Error */}
                        <ErrorMessage message={error} />

                        {/* Name Input */}
                        <View className="mb-3">
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: 8,
                                }}
                            >
                                Full Name
                            </Text>
                            <Input
                                placeholder="John Doe"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                editable={!loading}
                                className="h-14"
                                style={{
                                    borderRadius: 14,
                                    fontSize: 16,
                                }}
                            />
                        </View>

                        {/* Email Input */}
                        <View className="mb-3">
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: 8,
                                }}
                            >
                                Email
                            </Text>
                            <Input
                                placeholder="john@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                                className="h-14"
                                style={{
                                    borderRadius: 14,
                                    fontSize: 16,
                                }}
                            />
                        </View>

                        {/* Password Input */}
                        <View className="mb-5">
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: 8,
                                }}
                            >
                                Password
                            </Text>
                            <Input
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                                className="h-14"
                                style={{
                                    borderRadius: 14,
                                    fontSize: 16,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#9CA3AF",
                                    marginTop: 6,
                                }}
                            >
                                Must be at least 8 characters
                            </Text>
                        </View>

                        {/* Sign Up Button */}
                        <Button
                            className="w-full h-14"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: 14,
                            }}
                            onPress={handleEmailSignUp}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </Text>
                        </Button>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center items-center mt-5">
                            <Text style={{ fontSize: 15, color: "#6B7280" }}>
                                Already have an account?{" "}
                            </Text>
                            <Pressable onPress={() => router.push("/login")}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        color: TROJAN_NAVY,
                                    }}
                                >
                                    Sign in
                                </Text>
                            </Pressable>
                        </View>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
