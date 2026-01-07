import { useRouter } from "expo-router";
import { View, ImageBackground, StatusBar, useWindowDimensions, SafeAreaView, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { SignIn } from "@/components/sign-in";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function LoginScreen() {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isTablet = screenWidth >= 768;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: TROJAN_NAVY,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <StatusBar barStyle="light-content" backgroundColor={TROJAN_NAVY} />
            
            {/* Header */}
            <View
                style={{
                    padding: isTablet ? 40 : 24,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: isTablet ? 36 : 28,
                        fontWeight: "700",
                        color: TROJAN_GOLD,
                        marginBottom: 8,
                    }}
                >
                    Trojan Projects
                </Text>
                <Text
                    style={{
                        fontSize: isTablet ? 18 : 16,
                        color: "rgba(255, 255, 255, 0.8)",
                    }}
                >
                    Staff Hub
                </Text>
            </View>

            {/* Sign In Component */}
            <View style={{ flex: 1 }}>
                <SignIn />
            </View>
        </SafeAreaView>
    );
}