import { Link, Stack } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import { Home, Search } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function NotFoundScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found", headerShown: false }} />
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <View className="items-center max-w-md w-full">
          {/* 404 Number */}
          <Text
            className="font-bold mb-2"
            style={{
              color: TROJAN_NAVY,
              fontSize: isTablet ? 72 : 56
            }}
          >
            404
          </Text>
          <View
            className="rounded-full mb-6"
            style={{
              backgroundColor: TROJAN_GOLD,
              width: isTablet ? 96 : 72,
              height: 4
            }}
          />

          {/* Icon */}
          <View
            className="rounded-full items-center justify-center mb-6"
            style={{
              backgroundColor: `${TROJAN_GOLD}20`,
              width: isTablet ? 192 : 144,
              height: isTablet ? 192 : 144
            }}
          >
            <Text style={{ fontSize: isTablet ? 80 : 64 }}>🔍</Text>
          </View>

          {/* Message */}
          <Text
            className="font-bold text-center mb-3"
            style={{
              color: TROJAN_NAVY,
              fontSize: isTablet ? 24 : 20
            }}
          >
            Page Not Found
          </Text>
          <Text
            className="text-center text-gray-600 mb-8"
            style={{ fontSize: isTablet ? 16 : 14 }}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </Text>

          {/* Actions */}
          <View className="w-full gap-3">
            <Link href="/(tabs)" asChild>
              <Button
                className="flex-row items-center justify-center gap-2"
                style={{
                  backgroundColor: TROJAN_NAVY,
                  height: isTablet ? 52 : 48
                }}
              >
                <Home size={isTablet ? 20 : 18} color="white" />
                <Text
                  className="text-white font-semibold"
                  style={{ fontSize: isTablet ? 16 : 14 }}
                >
                  Go Home
                </Text>
              </Button>
            </Link>
            <Link href="/(tabs)/services" asChild>
              <Button
                variant="outline"
                className="flex-row items-center justify-center gap-2"
                style={{
                  borderColor: TROJAN_NAVY,
                  height: isTablet ? 52 : 48
                }}
              >
                <Search size={isTablet ? 20 : 18} color={TROJAN_NAVY} />
                <Text
                  className="font-semibold"
                  style={{
                    color: TROJAN_NAVY,
                    fontSize: isTablet ? 16 : 14
                  }}
                >
                  Browse Services
                </Text>
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
