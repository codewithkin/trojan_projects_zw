import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if user has an active session
                const { data: session } = await authClient.getSession();

                if (session?.user) {
                    // User is authenticated - check if they have completed onboarding
                    // For now, redirect to main app
                    router.replace("/(drawer)/(tabs)");
                } else {
                    // No session - check if user has been onboarded
                    // For now, redirect to login page
                    router.replace("/login");
                }
            } catch (error) {
                // Error checking session, show login
                router.replace("/login");
            }
        };

        // Add a small delay to ensure app is ready
        const timer = setTimeout(checkAuth, 500);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
            <ActivityIndicator size="large" color="#0F1B4D" />
        </View>
    );
}
