import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
    Image,
    StatusBar,
    useWindowDimensions,
} from "react-native";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle } from "lucide-react-native";

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
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= 768;
    const isLargeTablet = screenWidth >= 1024;

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
                            paddingTop: insets.top + (isTablet ? 48 : 32),
                            paddingBottom: isTablet ? 48 : 32,
                            paddingHorizontal: isTablet ? 48 : 24,
                            maxWidth: isLargeTablet ? 800 : undefined,
                            alignSelf: "center",
                            width: "100%",
                        }}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 600 }}
                        >
                            {/* Logo */}
                            <View className="flex-row items-center mb-5">
                                <Image
                                    source={require("@/assets/images/logo.png")}
                                    style={{
                                        width: isTablet ? 52 : 44,
                                        height: isTablet ? 52 : 44,
                                        borderRadius: isTablet ? 14 : 12,
                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: isTablet ? 26 : 22,
                                        fontWeight: "700",
                                        marginLeft: isTablet ? 16 : 12,
                                    }}
                                >
                                    Trojan Projects
                                </Text>
                            </View>

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: isTablet ? 36 : 28,
                                    fontWeight: "700",
                                    lineHeight: isTablet ? 46 : 36,
                                }}
                            >
                                Start Your Journey{"\n"}With Us Today
                            </Text>

                            {/* Benefits */}
                            <View style={{ marginTop: isTablet ? 24 : 16 }}>
                                {benefits.map((benefit) => (
                                    <View
                                        key={benefit}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginTop: isTablet ? 12 : 8,
                                        }}
                                    >
                                        <CheckCircle size={isTablet ? 20 : 16} color={TROJAN_GOLD} />
                                        <Text
                                            style={{
                                                color: "rgba(255,255,255,0.8)",
                                                fontSize: isTablet ? 16 : 14,
                                                marginLeft: isTablet ? 12 : 10,
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
                            borderTopLeftRadius: isTablet ? 40 : 32,
                            borderTopRightRadius: isTablet ? 40 : 32,
                            paddingHorizontal: isTablet ? 48 : 24,
                            paddingTop: isTablet ? 40 : 28,
                            paddingBottom: insets.bottom + (isTablet ? 32 : 24),
                            maxWidth: isLargeTablet ? 600 : undefined,
                            alignSelf: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: isTablet ? 28 : 22,
                                fontWeight: "700",
                                color: TROJAN_NAVY,
                                marginBottom: isTablet ? 10 : 6,
                            }}
                        >
                            Create Account
                        </Text>
                        <Text
                            style={{
                                fontSize: isTablet ? 16 : 14,
                                color: "#6B7280",
                                marginBottom: isTablet ? 28 : 20,
                            }}
                        >
                            Sign up to get started
                        </Text>

                        {/* Google Sign Up */}
                        <Button
                            variant="outline"
                            className="w-full flex-row items-center justify-center gap-2"
                            style={{
                                borderColor: "#E5E7EB",
                                borderRadius: isTablet ? 16 : 14,
                                height: isTablet ? 56 : 48,
                            }}
                            onPress={handleGoogleSignUp}
                            disabled={googleLoading}
                        >
                            <Text style={{ fontSize: isTablet ? 17 : 16, fontWeight: "500", color: "#374151" }}>
                                {googleLoading ? "Connecting..." : "Continue with Google"}
                            </Text>
                        </Button>

                        {/* Divider */}
                        <View className="flex-row items-center" style={{ marginVertical: isTablet ? 28 : 20 }}>
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text
                                style={{
                                    paddingHorizontal: 14,
                                    fontSize: isTablet ? 14 : 13,
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
                        <View style={{ marginBottom: isTablet ? 16 : 12 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
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
                                style={{
                                    borderRadius: isTablet ? 16 : 14,
                                    fontSize: isTablet ? 17 : 16,
                                    height: isTablet ? 56 : 48,
                                }}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={{ marginBottom: isTablet ? 16 : 12 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
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
                                style={{
                                    borderRadius: isTablet ? 16 : 14,
                                    fontSize: isTablet ? 17 : 16,
                                    height: isTablet ? 56 : 48,
                                }}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={{ marginBottom: isTablet ? 28 : 20 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
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
                                style={{
                                    borderRadius: isTablet ? 16 : 14,
                                    fontSize: isTablet ? 17 : 16,
                                    height: isTablet ? 56 : 48,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: isTablet ? 13 : 12,
                                    color: "#9CA3AF",
                                    marginTop: isTablet ? 8 : 6,
                                }}
                            >
                                Must be at least 8 characters
                            </Text>
                        </View>

                        {/* Sign Up Button */}
                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: isTablet ? 16 : 14,
                                height: isTablet ? 56 : 48,
                            }}
                            onPress={handleEmailSignUp}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    fontSize: isTablet ? 17 : 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </Text>
                        </Button>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center items-center" style={{ marginTop: isTablet ? 28 : 20 }}>
                            <Text style={{ fontSize: isTablet ? 16 : 15, color: "#6B7280" }}>
                                Already have an account?{" "}
                            </Text>
                            <Pressable onPress={() => router.push("/login")}>
                                <Text
                                    style={{
                                        fontSize: isTablet ? 16 : 15,
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
