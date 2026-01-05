import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
    ImageBackground,
    StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sun, Zap, Shield } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/error-message";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const features = [
    { icon: Sun, text: "Solar Power" },
    { icon: Shield, text: "CCTV Security" },
    { icon: Zap, text: "Electrical" },
];

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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
                            paddingTop: insets.top + 40,
                            paddingBottom: 40,
                            paddingHorizontal: 24,
                        }}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 600 }}
                        >
                            {/* Logo */}
                            <View className="flex-row items-center mb-6">
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        backgroundColor: TROJAN_GOLD,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Zap size={28} color={TROJAN_NAVY} />
                                </View>
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 24,
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
                                    fontSize: 32,
                                    fontWeight: "700",
                                    lineHeight: 40,
                                }}
                            >
                                Power Your Home{"\n"}With Expert Solutions
                            </Text>

                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: 16,
                                    marginTop: 12,
                                    lineHeight: 24,
                                }}
                            >
                                Professional engineering services for solar, security, and electrical systems.
                            </Text>

                            {/* Features */}
                            <View className="flex-row mt-6" style={{ gap: 12 }}>
                                {features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <View
                                            key={feature.text}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                borderRadius: 20,
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                            }}
                                        >
                                            <Icon size={16} color={TROJAN_GOLD} />
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontSize: 13,
                                                    marginLeft: 6,
                                                }}
                                            >
                                                {feature.text}
                                            </Text>
                                        </View>
                                    );
                                })}
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
                            paddingTop: 32,
                            paddingBottom: insets.bottom + 24,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "700",
                                color: TROJAN_NAVY,
                                marginBottom: 8,
                            }}
                        >
                            Welcome Back
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#6B7280",
                                marginBottom: 24,
                            }}
                        >
                            Sign in to continue to your account
                        </Text>

                        {/* Google Sign In */}
                        <Button
                            variant="outline"
                            className="w-full h-14 flex-row items-center justify-center gap-2"
                            style={{
                                borderColor: "#E5E7EB",
                                borderRadius: 14,
                            }}
                            onPress={handleGoogleSignIn}
                            disabled={googleLoading}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "500", color: "#374151" }}>
                                {googleLoading ? "Connecting..." : "Continue with Google"}
                            </Text>
                        </Button>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text
                                style={{
                                    paddingHorizontal: 16,
                                    fontSize: 13,
                                    color: "#9CA3AF",
                                }}
                            >
                                or sign in with email
                            </Text>
                            <View className="flex-1 h-px bg-gray-200" />
                        </View>

                        {/* Error */}
                        <ErrorMessage message={error} />

                        {/* Email Input */}
                        <View className="mb-4">
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
                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: TROJAN_NAVY,
                                    }}
                                >
                                    Password
                                </Text>
                                <Pressable onPress={() => router.push("/forgot-password")}>
                                    <Text style={{ fontSize: 13, color: TROJAN_NAVY }}>
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
                                className="h-14"
                                style={{
                                    borderRadius: 14,
                                    fontSize: 16,
                                }}
                            />
                        </View>

                        {/* Sign In Button */}
                        <Button
                            className="w-full h-14"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: 14,
                            }}
                            onPress={handleEmailSignIn}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Text>
                        </Button>

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text style={{ fontSize: 15, color: "#6B7280" }}>
                                Don't have an account?{" "}
                            </Text>
                            <Pressable onPress={() => router.push("/signup")}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        color: TROJAN_NAVY,
                                    }}
                                >
                                    Sign up
                                </Text>
                            </Pressable>
                        </View>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
