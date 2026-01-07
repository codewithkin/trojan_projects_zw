import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
    StatusBar,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/error-message";
import { forgotPassword } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= 768;
    const isLargeTablet = screenWidth >= 1024;

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleForgotPassword = async () => {
        setError(null);
        if (!email) {
            setError("Email is required");
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(email);
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error || "Failed to send reset email");
            }
        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <View className="flex-1" style={{ backgroundColor: TROJAN_NAVY }}>
                <StatusBar barStyle="light-content" />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: isTablet ? 48 : 24,
                    }}
                >
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "timing", duration: 400 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: isTablet ? 32 : 24,
                            padding: isTablet ? 40 : 32,
                            width: "100%",
                            maxWidth: isLargeTablet ? 500 : undefined,
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: isTablet ? 80 : 64,
                                height: isTablet ? 80 : 64,
                                borderRadius: isTablet ? 40 : 32,
                                backgroundColor: "#DCFCE7",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: isTablet ? 24 : 20,
                            }}
                        >
                            <Ionicons name="checkmark-circle" size={isTablet ? 48 : 40} color="#16A34A" />
                        </View>

                        <Text
                            style={{
                                fontSize: isTablet ? 28 : 24,
                                fontWeight: "700",
                                color: TROJAN_NAVY,
                                textAlign: "center",
                                marginBottom: isTablet ? 16 : 12,
                            }}
                        >
                            Check Your Email
                        </Text>

                        <Text
                            style={{
                                fontSize: isTablet ? 17 : 15,
                                color: "#6B7280",
                                textAlign: "center",
                                marginBottom: isTablet ? 32 : 24,
                                lineHeight: isTablet ? 26 : 22,
                            }}
                        >
                            We've sent a password reset link to{"\n"}
                            <Text style={{ fontWeight: "600", color: TROJAN_NAVY }}>{email}</Text>
                        </Text>

                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: isTablet ? 16 : 14,
                                height: isTablet ? 56 : 48,
                            }}
                            onPress={() => router.replace("/login")}
                        >
                            <Text
                                style={{
                                    fontSize: isTablet ? 17 : 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                Back to Login
                            </Text>
                        </Button>
                    </MotiView>
                </View>
            </View>
        );
    }

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
                    {/* Header */}
                    <View
                        style={{
                            paddingTop: insets.top + (isTablet ? 40 : 20),
                            paddingBottom: isTablet ? 60 : 40,
                            paddingHorizontal: isTablet ? 48 : 24,
                            maxWidth: isLargeTablet ? 800 : undefined,
                            alignSelf: "center",
                            width: "100%",
                        }}
                    >
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: isTablet ? 40 : 32,
                            }}
                        >
                            <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: isTablet ? 18 : 16, marginLeft: 8 }}>
                                Back
                            </Text>
                        </Pressable>

                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 600 }}
                        >
                            <View
                                style={{
                                    width: isTablet ? 72 : 56,
                                    height: isTablet ? 72 : 56,
                                    borderRadius: isTablet ? 36 : 28,
                                    backgroundColor: `${TROJAN_GOLD}30`,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: isTablet ? 24 : 20,
                                }}
                            >
                                <Ionicons name="lock-closed" size={isTablet ? 36 : 28} color={TROJAN_GOLD} />
                            </View>

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: isTablet ? 36 : 28,
                                    fontWeight: "700",
                                    lineHeight: isTablet ? 44 : 36,
                                }}
                            >
                                Forgot Password?
                            </Text>

                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: isTablet ? 18 : 16,
                                    marginTop: isTablet ? 16 : 12,
                                    lineHeight: isTablet ? 28 : 24,
                                }}
                            >
                                No worries! Enter your email and we'll send you a reset link.
                            </Text>
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
                        {/* Error */}
                        <ErrorMessage message={error} />

                        {/* Email Input */}
                        <View style={{ marginBottom: isTablet ? 32 : 24 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
                                }}
                            >
                                Email Address
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

                        {/* Submit Button */}
                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: isTablet ? 16 : 14,
                                height: isTablet ? 56 : 48,
                            }}
                            onPress={handleForgotPassword}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    fontSize: isTablet ? 17 : 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Text>
                        </Button>

                        {/* Back to Login */}
                        <View className="flex-row justify-center items-center" style={{ marginTop: isTablet ? 32 : 24 }}>
                            <Text style={{ fontSize: isTablet ? 16 : 15, color: "#6B7280" }}>
                                Remember your password?{" "}
                            </Text>
                            <Pressable onPress={() => router.replace("/login")}>
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
