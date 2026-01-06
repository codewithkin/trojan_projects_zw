import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View, useWindowDimensions, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { signUp } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

function SignUp({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignUp = async () => {
    setError(null);
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await signUp({ name, email, password });

      if (response.success) {
        router.push("/user-onboarding");
      } else {
        setError(response.error || "Sign up failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
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
            Create Account
          </Text>
          <Text
            className="text-center text-muted-foreground"
            style={{ fontSize: isTablet ? 16 : 14, marginBottom: isTablet ? 32 : 24 }}
          >
            Join Trojan Projects ZW today
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

          {/* Name Input */}
          <View style={{ marginBottom: isTablet ? 20 : 16 }}>
            <Text
              className="font-medium"
              style={{ color: TROJAN_NAVY, fontSize: isTablet ? 15 : 14, marginBottom: isTablet ? 10 : 8 }}
            >
              Full Name
            </Text>
            <Input
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              className="px-3"
              style={{ height: isTablet ? 48 : 40, fontSize: isTablet ? 16 : 14 }}
            />
          </View>

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
            <Text
              className="font-medium"
              style={{ color: TROJAN_NAVY, fontSize: isTablet ? 15 : 14, marginBottom: isTablet ? 10 : 8 }}
            >
              Password
            </Text>
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

          {/* Create Account Button */}
          <Button
            className="w-full font-semibold"
            style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 48 : 40, marginBottom: isTablet ? 20 : 16 }}
            onPress={handleEmailSignUp}
            disabled={isLoading}
          >
            <Text style={{ color: TROJAN_NAVY, fontSize: isTablet ? 16 : 14 }} className="font-semibold">
              {isLoading ? "Creating account..." : "Create Account"}
            </Text>
          </Button>

          {/* Sign In Link */}
          <View className="flex-row justify-center">
            <Text className="text-muted-foreground" style={{ fontSize: isTablet ? 15 : 14 }}>
              Already have an account?{" "}
            </Text>
            <Pressable onPress={onSwitchToSignIn}>
              <Text className="font-semibold" style={{ color: TROJAN_NAVY, fontSize: isTablet ? 15 : 14 }}>
                Sign in
              </Text>
            </Pressable>
          </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export { SignUp };
