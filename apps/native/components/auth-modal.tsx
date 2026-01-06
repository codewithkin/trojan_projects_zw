import { useState } from "react";
import {
    Modal,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    message?: string;
}

export function AuthModal({ visible, onClose, onSuccess, message }: AuthModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setError(null);
    };

    const handleSignIn = async () => {
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
                        resetForm();
                        onClose();
                        onSuccess?.();
                    },
                    onError: (err) => {
                        if (err.error.status === 403) {
                            setError("Please verify your email address first");
                        } else {
                            setError(err.error.message || "Sign in failed");
                        }
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
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
                        resetForm();
                        onClose();
                        onSuccess?.();
                    },
                    onError: (err) => {
                        setError(err.error.message || "Sign up failed");
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);
        try {
            await authClient.signIn.social({
                provider: "google",
            });
            onClose();
            onSuccess?.();
        } catch {
            setError("Google authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === "signin" ? "signup" : "signin");
        resetForm();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View
                        className="w-11/12 max-w-md rounded-2xl overflow-hidden"
                        style={{ backgroundColor: "#fff" }}
                    >
                        {/* Header */}
                        <View
                            className="p-4 flex-row items-center justify-between"
                            style={{ backgroundColor: TROJAN_NAVY }}
                        >
                            <View className="flex-row items-center">
                                <Image
                                    source={require("@/assets/images/logo.png")}
                                    style={{ width: 36, height: 36, borderRadius: 8 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-white font-bold text-lg ml-3">
                                    Trojan Projects
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-5">
                            {/* Message */}
                            {message && (
                                <View
                                    className="p-3 rounded-lg mb-4"
                                    style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                >
                                    <Text className="text-center" style={{ color: TROJAN_NAVY }}>
                                        {message}
                                    </Text>
                                </View>
                            )}

                            {/* Title */}
                            <Text
                                className="text-2xl font-bold text-center mb-2"
                                style={{ color: TROJAN_NAVY }}
                            >
                                {mode === "signin" ? "Welcome Back" : "Create Account"}
                            </Text>
                            <Text className="text-gray-500 text-center mb-6">
                                {mode === "signin"
                                    ? "Sign in to continue"
                                    : "Sign up to get started"}
                            </Text>

                            {/* Google Button */}
                            <Button
                                variant="outline"
                                className="w-full mb-4"
                                onPress={handleGoogleAuth}
                                disabled={loading}
                            >
                                <Text className="font-medium">Continue with Google</Text>
                            </Button>

                            {/* Divider */}
                            <View className="flex-row items-center my-4">
                                <View className="flex-1 h-px bg-gray-200" />
                                <Text className="px-3 text-gray-400 text-sm">OR</Text>
                                <View className="flex-1 h-px bg-gray-200" />
                            </View>

                            {/* Error */}
                            {error && (
                                <Text className="text-red-500 text-center mb-4">{error}</Text>
                            )}

                            {/* Name Input (Sign Up only) */}
                            {mode === "signup" && (
                                <View className="mb-4">
                                    <Text className="font-medium mb-2" style={{ color: TROJAN_NAVY }}>
                                        Full Name
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg px-4 py-3"
                                        placeholder="John Doe"
                                        value={name}
                                        onChangeText={setName}
                                        editable={!loading}
                                    />
                                </View>
                            )}

                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="font-medium mb-2" style={{ color: TROJAN_NAVY }}>
                                    Email
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>

                            {/* Password Input */}
                            <View className="mb-6">
                                <Text className="font-medium mb-2" style={{ color: TROJAN_NAVY }}>
                                    Password
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-3"
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>

                            {/* Submit Button */}
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD }}
                                onPress={mode === "signin" ? handleSignIn : handleSignUp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={TROJAN_NAVY} />
                                ) : (
                                    <Text className="font-bold" style={{ color: TROJAN_NAVY }}>
                                        {mode === "signin" ? "Sign In" : "Create Account"}
                                    </Text>
                                )}
                            </Button>

                            {/* Switch Mode */}
                            <TouchableOpacity onPress={switchMode} className="mt-4 py-2">
                                <Text className="text-center text-gray-600">
                                    {mode === "signin"
                                        ? "Don't have an account? "
                                        : "Already have an account? "}
                                    <Text style={{ color: TROJAN_NAVY, fontWeight: "600" }}>
                                        {mode === "signin" ? "Sign Up" : "Sign In"}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
