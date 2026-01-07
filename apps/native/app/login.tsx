import { MotiView } from "moti";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sun, Shield, Zap } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/error-message";
import { signIn } from "@/lib/auth-client";
import { useAuth } from "@/contexts/auth-context";

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
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= 768;
    const isLargeTablet = screenWidth >= 1024;
    const { refreshSession } = useAuth();

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
            const response = await signIn({ email, password });
            if (response.success) {
                refreshSession();
                router.replace("/(tabs)");
            } else {
                if (response.error?.includes("verify")) {
                    setError("Please verify your email address first");
                } else {
                    setError(response.error || "Sign in failed");
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Sign in failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
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
                            paddingTop: insets.top + (isTablet ? 60 : 40),
                            paddingBottom: isTablet ? 60 : 40,
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
                            <View className="flex-row items-center mb-6">
                                <Image
                                    source={require("@/assets/images/logo.png")}
                                    style={{
                                        width: isTablet ? 56 : 48,
                                        height: isTablet ? 56 : 48,
                                        borderRadius: isTablet ? 16 : 12,
                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: isTablet ? 28 : 24,
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
                                    fontSize: isTablet ? 40 : 32,
                                    fontWeight: "700",
                                    lineHeight: isTablet ? 50 : 40,
                                }}
                            >
                                Power Your Home{"\n"}With Expert Solutions
                            </Text>

                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: isTablet ? 18 : 16,
                                    marginTop: isTablet ? 16 : 12,
                                    lineHeight: isTablet ? 28 : 24,
                                }}
                            >
                                Professional engineering services for solar, security, and electrical systems.
                            </Text>

                            {/* Features - Scrollable */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: isTablet ? 24 : 16 }}
                                contentContainerStyle={{ gap: isTablet ? 16 : 12 }}
                            >
                                {features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <View
                                            key={feature.text}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                borderRadius: isTablet ? 24 : 20,
                                                paddingHorizontal: isTablet ? 16 : 12,
                                                paddingVertical: isTablet ? 10 : 8,
                                            }}
                                        >
                                            <Icon size={isTablet ? 20 : 16} color={TROJAN_GOLD} />
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontSize: isTablet ? 15 : 13,
                                                    marginLeft: isTablet ? 8 : 6,
                                                }}
                                            >
                                                {feature.text}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
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
                            paddingTop: isTablet ? 48 : 32,
                            paddingBottom: insets.bottom + (isTablet ? 32 : 24),
                            maxWidth: isLargeTablet ? 600 : undefined,
                            alignSelf: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: isTablet ? 28 : 24,
                                fontWeight: "700",
                                color: TROJAN_NAVY,
                                marginBottom: isTablet ? 12 : 8,
                            }}
                        >
                            Welcome Back
                        </Text>
                        <Text
                            style={{
                                fontSize: isTablet ? 17 : 15,
                                color: "#6B7280",
                                marginBottom: isTablet ? 32 : 24,
                            }}
                        >
                            Sign in to continue to your account
                        </Text>

                        {/* Error */}
                        <ErrorMessage message={error} />

                        {/* Email Input */}
                        <View style={{ marginBottom: isTablet ? 20 : 16 }}>
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
                        <View style={{ marginBottom: isTablet ? 32 : 24 }}>
                            <View className="flex-row justify-between items-center" style={{ marginBottom: isTablet ? 10 : 8 }}>
                                <Text
                                    style={{
                                        fontSize: isTablet ? 15 : 14,
                                        fontWeight: "600",
                                        color: TROJAN_NAVY,
                                    }}
                                >
                                    Password
                                </Text>
                                <Pressable onPress={() => {
                                    router.push("/forgot-password");
                                }}>
                                    <Text style={{ fontSize: isTablet ? 14 : 13, color: TROJAN_NAVY }}>
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
                                style={{
                                    borderRadius: isTablet ? 16 : 14,
                                    fontSize: isTablet ? 17 : 16,
                                    height: isTablet ? 56 : 48,
                                }}
                            />
                        </View>

                        {/* Sign In Button */}
                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: isTablet ? 16 : 14,
                                height: isTablet ? 56 : 48,
                            }}
                            onPress={handleEmailSignIn}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    fontSize: isTablet ? 17 : 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Text>
                        </Button>

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center items-center" style={{ marginTop: isTablet ? 32 : 24 }}>
                            <Text style={{ fontSize: isTablet ? 16 : 15, color: "#6B7280" }}>
                                Don't have an account?{" "}
                            </Text>
                            <Pressable onPress={() => router.push("/signup")}>
                                <Text
                                    style={{
                                        fontSize: isTablet ? 16 : 15,
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
