import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { getSession } from "@/lib/auth-client";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if user has an active session
                const session = await getSession();

                if (session?.user) {
                    // User is authenticated - redirect to main app
                    router.replace("/(tabs)");
                } else {
                    // No session - allow guest access to main app
                    router.replace("/(tabs)");
                }
            } catch (error) {
                // Error checking session, still allow guest access
                router.replace("/(tabs)");
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
