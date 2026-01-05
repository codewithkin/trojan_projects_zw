import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

function SignIn({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const router = useRouter();
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
      <View className="w-full max-w-md">
        {/* Card container with white background */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {/* Header */}
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: TROJAN_NAVY }}
          >
            Welcome Back
          </Text>
          <Text className="text-center text-muted-foreground mb-6">
            Sign in to your Trojan Projects account
          </Text>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full h-12 mb-4 flex-row items-center justify-center gap-2"
            onPress={handleGoogleSignIn}
          >
            <Text className="font-medium">Continue with Google</Text>
          </Button>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="px-3 text-xs text-muted-foreground uppercase">
              Or continue with
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Error Message */}
          {error && (
            <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
          )}

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: TROJAN_NAVY }}>
              Email
            </Text>
            <Input
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              className="h-10 px-3"
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium" style={{ color: TROJAN_NAVY }}>
                Password
              </Text>
              <Pressable>
                <Text className="text-xs" style={{ color: TROJAN_NAVY }}>
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
              className="h-10 px-3"
            />
          </View>

          {/* Sign In Button */}
          <Button
            className="w-full h-10 font-semibold mb-4"
            style={{ backgroundColor: TROJAN_GOLD }}
            onPress={handleEmailSignIn}
            disabled={isLoading}
          >
            <Text style={{ color: TROJAN_NAVY }} className="font-semibold">
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </Button>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
            </Text>
            <Pressable onPress={onSwitchToSignUp}>
              <Text className="text-sm font-semibold" style={{ color: TROJAN_NAVY }}>
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
