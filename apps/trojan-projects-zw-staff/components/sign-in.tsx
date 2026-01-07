import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { signIn } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

function SignIn() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await signIn({ email, password });

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.error || "Sign in failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-full" style={{ maxWidth: isTablet ? 500 : 400 }}>
            {/* Card container with white background */}
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: isTablet ? 16 : 8,
                padding: isTablet ? 40 : 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              {/* Header */}
              <Text
                className="font-bold text-center mb-2"
                style={{ color: TROJAN_NAVY, fontSize: isTablet ? 28 : 24 }}
              >
                Welcome Back
              </Text>
              <Text
                className="text-center text-muted-foreground"
                style={{ fontSize: isTablet ? 16 : 14, marginBottom: isTablet ? 32 : 24 }}
              >
                Staff & Admin Access Only
              </Text>

              {/* Error Message */}
              {error && (
                <Text
                  className="text-red-500 text-center"
                  style={{ fontSize: isTablet ? 15 : 14, marginBottom: isTablet ? 20 : 16 }}
                >
                  {error}
                </Text>
              )}

              {/* Email Input */}
              <View style={{ marginBottom: isTablet ? 20 : 16 }}>
                <Text
                  className="font-medium"
                  style={{ color: TROJAN_NAVY, fontSize: isTablet ? 15 : 14, marginBottom: isTablet ? 10 : 8 }}
                >
                  Email
                </Text>
                <Input
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  className="px-3"
                  style={{ height: isTablet ? 48 : 40, fontSize: isTablet ? 16 : 14 }}
                />
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: isTablet ? 28 : 24 }}>
                <View className="flex-row items-center justify-between" style={{ marginBottom: isTablet ? 10 : 8 }}>
                  <Text
                    className="font-medium"
                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 15 : 14 }}
                  >
                    Password
                  </Text>
                  <Pressable onPress={() => router.push("/forgot-password")}>
                    <Text style={{ color: TROJAN_NAVY, fontSize: isTablet ? 13 : 12 }}>
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>
                <View className="flex-row items-center">
                  <Input
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    className="px-3 flex-1"
                    style={{ height: isTablet ? 48 : 40, fontSize: isTablet ? 16 : 14, paddingRight: 44 }}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={TROJAN_NAVY} />
                    ) : (
                      <Eye size={20} color={TROJAN_NAVY} />
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Sign In Button */}
              <Button
                className="w-full font-semibold"
                style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 48 : 40 }}
                onPress={handleEmailSignIn}
                disabled={isLoading}
              >
                <Text style={{ color: TROJAN_NAVY, fontSize: isTablet ? 16 : 14 }} className="font-semibold">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export { SignIn };
