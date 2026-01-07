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
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ErrorMessage } from "@/components/error-message";
import { changePassword } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= 768;
    const isLargeTablet = screenWidth >= 1024;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChangePassword = async () => {
        setError(null);

        if (!currentPassword) {
            setError("Current password is required");
            return;
        }

        if (!newPassword) {
            setError("New password is required");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from current password");
            return;
        }

        setLoading(true);
        try {
            const response = await changePassword({
                currentPassword,
                newPassword
            });
            if (response.success) {
                Alert.alert(
                    "Password Changed",
                    "Your password has been updated successfully.",
                    [{ text: "OK", onPress: () => router.back() }]
                );
            } else {
                setError(response.error || "Failed to change password");
            }
        } catch (err: any) {
            setError(err.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                {/* Header */}
                <View
                    style={{
                        backgroundColor: TROJAN_NAVY,
                        paddingTop: insets.top + 16,
                        paddingBottom: 24,
                        paddingHorizontal: isTablet ? 32 : 20,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </Pressable>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: isTablet ? 24 : 20,
                                fontWeight: "700",
                            }}
                        >
                            Change Password
                        </Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        padding: isTablet ? 32 : 20,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 400 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: isTablet ? 24 : 20,
                            padding: isTablet ? 32 : 24,
                            maxWidth: isLargeTablet ? 600 : undefined,
                            alignSelf: "center",
                            width: "100%",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <View
                            style={{
                                width: isTablet ? 64 : 56,
                                height: isTablet ? 64 : 56,
                                borderRadius: isTablet ? 32 : 28,
                                backgroundColor: `${TROJAN_GOLD}20`,
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: isTablet ? 24 : 20,
                                alignSelf: "center",
                            }}
                        >
                            <Ionicons name="key" size={isTablet ? 32 : 28} color={TROJAN_NAVY} />
                        </View>

                        <Text
                            style={{
                                fontSize: isTablet ? 15 : 14,
                                color: "#6B7280",
                                textAlign: "center",
                                marginBottom: isTablet ? 32 : 24,
                                lineHeight: isTablet ? 24 : 20,
                            }}
                        >
                            Enter your current password and choose a new password for your account.
                        </Text>

                        {/* Error */}
                        <ErrorMessage message={error} />

                        {/* Current Password Input */}
                        <View style={{ marginBottom: isTablet ? 20 : 16 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
                                }}
                            >
                                Current Password
                            </Text>
                            <View style={{ position: "relative" }}>
                                <Input
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry={!showCurrentPassword}
                                    editable={!loading}
                                    style={{
                                        borderRadius: isTablet ? 16 : 14,
                                        fontSize: isTablet ? 17 : 16,
                                        height: isTablet ? 56 : 48,
                                        paddingRight: 48,
                                    }}
                                />
                                <Pressable
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={{
                                        position: "absolute",
                                        right: 16,
                                        top: 0,
                                        bottom: 0,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={showCurrentPassword ? "eye-off" : "eye"}
                                        size={22}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/* Divider */}
                        <View
                            style={{
                                height: 1,
                                backgroundColor: "#E5E7EB",
                                marginVertical: isTablet ? 24 : 20,
                            }}
                        />

                        {/* New Password Input */}
                        <View style={{ marginBottom: isTablet ? 20 : 16 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
                                }}
                            >
                                New Password
                            </Text>
                            <View style={{ position: "relative" }}>
                                <Input
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                    editable={!loading}
                                    style={{
                                        borderRadius: isTablet ? 16 : 14,
                                        fontSize: isTablet ? 17 : 16,
                                        height: isTablet ? 56 : 48,
                                        paddingRight: 48,
                                    }}
                                />
                                <Pressable
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: "absolute",
                                        right: 16,
                                        top: 0,
                                        bottom: 0,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={showNewPassword ? "eye-off" : "eye"}
                                        size={22}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>
                            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                                Must be at least 8 characters
                            </Text>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={{ marginBottom: isTablet ? 32 : 24 }}>
                            <Text
                                style={{
                                    fontSize: isTablet ? 15 : 14,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginBottom: isTablet ? 10 : 8,
                                }}
                            >
                                Confirm New Password
                            </Text>
                            <View style={{ position: "relative" }}>
                                <Input
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    editable={!loading}
                                    style={{
                                        borderRadius: isTablet ? 16 : 14,
                                        fontSize: isTablet ? 17 : 16,
                                        height: isTablet ? 56 : 48,
                                        paddingRight: 48,
                                    }}
                                />
                                <Pressable
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: "absolute",
                                        right: 16,
                                        top: 0,
                                        bottom: 0,
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off" : "eye"}
                                        size={22}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: TROJAN_GOLD,
                                borderRadius: isTablet ? 16 : 14,
                                height: isTablet ? 56 : 48,
                            }}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            <Text
                                style={{
                                    fontSize: isTablet ? 17 : 16,
                                    fontWeight: "700",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Text>
                        </Button>

                        {/* Cancel Button */}
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                marginTop: isTablet ? 16 : 12,
                                paddingVertical: isTablet ? 14 : 12,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: isTablet ? 16 : 15,
                                    fontWeight: "600",
                                    color: "#6B7280",
                                }}
                            >
                                Cancel
                            </Text>
                        </Pressable>
                    </MotiView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
