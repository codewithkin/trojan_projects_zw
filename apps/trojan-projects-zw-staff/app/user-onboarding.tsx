import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

/**
 * Staff app doesn't need user onboarding for service preferences
 * Redirect directly to the main app
 */
export default function UserOnboardingScreen() {
    const router = useRouter();

    useEffect(() => {
        // Staff users don't need to select service preferences
        // Redirect them directly to the main app
        const timer = setTimeout(() => {
            router.replace("/(tabs)");
        }, 500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: TROJAN_NAVY,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ActivityIndicator size="large" color={TROJAN_GOLD} />
            <Text
                style={{
                    color: "white",
                    marginTop: 16,
                    fontSize: 16,
                }}
            >
                Setting up your workspace...
            </Text>
        </View>
    );
}