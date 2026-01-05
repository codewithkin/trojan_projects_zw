import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

function SignIn({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => {
            router.push("/dashboard");
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
      setIsLoading(false);
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
            Sign in to your Trojan Projects account
          </Text>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full flex-row items-center justify-center gap-2"
            style={{ height: isTablet ? 52 : 48, marginBottom: isTablet ? 20 : 16 }}
            onPress={handleGoogleSignIn}
          >
            <Text className="font-medium" style={{ fontSize: isTablet ? 16 : 14 }}>Continue with Google</Text>
          </Button>

          {/* Divider */}
          <View className="flex-row items-center" style={{ marginVertical: isTablet ? 20 : 16 }}>
            <View className="flex-1 h-px bg-border" />
            <Text className="px-3 text-muted-foreground uppercase" style={{ fontSize: isTablet ? 13 : 12 }}>
              Or continue with
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

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
              <Pressable>
                <Text style={{ color: TROJAN_NAVY, fontSize: isTablet ? 13 : 12 }}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>
            <Input
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
              className="px-3"
              style={{ height: isTablet ? 48 : 40, fontSize: isTablet ? 16 : 14 }}
            />
          </View>

          {/* Sign In Button */}
          <Button
            className="w-full font-semibold"
            style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 48 : 40, marginBottom: isTablet ? 20 : 16 }}
            onPress={handleEmailSignIn}
            disabled={isLoading}
          >
            <Text style={{ color: TROJAN_NAVY, fontSize: isTablet ? 16 : 14 }} className="font-semibold">
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </Button>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-muted-foreground" style={{ fontSize: isTablet ? 15 : 14 }}>
              Don&apos;t have an account?{" "}
            </Text>
            <Pressable onPress={onSwitchToSignUp}>
              <Text className="font-semibold" style={{ color: TROJAN_NAVY, fontSize: isTablet ? 15 : 14 }}>
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export { SignIn };
