import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View, useWindowDimensions } from "react-native";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function TabLayout() {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? (isTablet ? 100 : 88) : (isTablet ? 76 : 68),
          paddingBottom: Platform.OS === "ios" ? (isTablet ? 32 : 28) : (isTablet ? 16 : 12),
          paddingTop: isTablet ? 16 : 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
          // Center tab bar on large tablets
          ...(screenWidth >= 1024 ? {
            marginHorizontal: "auto",
            maxWidth: 600,
            borderRadius: 24,
            marginBottom: 20,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
          } : {}),
        },
        tabBarActiveTintColor: TROJAN_NAVY,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: isTablet ? 13 : 11,
          fontWeight: "600",
          marginTop: isTablet ? 6 : 4,
        },
        tabBarIconStyle: {
          marginTop: isTablet ? 6 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <View
              style={{
                backgroundColor: focused ? `${TROJAN_GOLD}30` : "transparent",
                borderRadius: isTablet ? 16 : 12,
                paddingHorizontal: isTablet ? 24 : 16,
                paddingVertical: isTablet ? 10 : 8,
              }}
            >
              <Ionicons name={focused ? "home" : "home-outline"} size={isTablet ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <View
              style={{
                backgroundColor: focused ? `${TROJAN_GOLD}30` : "transparent",
                borderRadius: isTablet ? 16 : 12,
                paddingHorizontal: isTablet ? 24 : 16,
                paddingVertical: isTablet ? 10 : 8,
              }}
            >
              <Ionicons name={focused ? "grid" : "grid-outline"} size={isTablet ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "My Projects",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <View
              style={{
                backgroundColor: focused ? `${TROJAN_GOLD}30` : "transparent",
                borderRadius: isTablet ? 16 : 12,
                paddingHorizontal: isTablet ? 24 : 16,
                paddingVertical: isTablet ? 10 : 8,
              }}
            >
              <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={isTablet ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <View
              style={{
                backgroundColor: focused ? `${TROJAN_GOLD}30` : "transparent",
                borderRadius: isTablet ? 16 : 12,
                paddingHorizontal: isTablet ? 24 : 16,
                paddingVertical: isTablet ? 10 : 8,
              }}
            >
              <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={isTablet ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      {/* Hide quotes from tab bar - accessed from projects/services */}
      <Tabs.Screen
        name="quotes"
        options={{
          href: null,
        }}
      />
      {/* Hide deprecated profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
