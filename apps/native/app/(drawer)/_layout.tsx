import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Pressable, Text, View, Image, useWindowDimensions } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const { data: session } = authClient.useSession();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: TROJAN_NAVY,
          paddingTop: insets.top + (isTablet ? 28 : 20),
          paddingBottom: isTablet ? 28 : 24,
          paddingHorizontal: isTablet ? 28 : 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: isTablet ? 72 : 56,
              height: isTablet ? 72 : 56,
              borderRadius: isTablet ? 36 : 28,
              backgroundColor: TROJAN_GOLD,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            {session?.user?.image ? (
              <Image
                source={{ uri: session.user.image }}
                style={{ width: isTablet ? 72 : 56, height: isTablet ? 72 : 56, borderRadius: isTablet ? 36 : 28 }}
              />
            ) : (
              <Text style={{ fontSize: isTablet ? 26 : 20, fontWeight: "bold", color: TROJAN_NAVY }}>
                {userInitials}
              </Text>
            )}
          </View>
          <View style={{ marginLeft: isTablet ? 18 : 14, flex: 1 }}>
            <Text style={{ color: "#fff", fontSize: isTablet ? 22 : 18, fontWeight: "600" }}>
              {session?.user?.name || "Welcome"}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 15 : 13, marginTop: 2 }}>
              {session?.user?.email || "Sign in to continue"}
            </Text>
          </View>
        </View>
        {/* Stats row */}
        <View
          style={{
            flexDirection: "row",
            marginTop: isTablet ? 24 : 20,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: isTablet ? 16 : 12,
            padding: isTablet ? 16 : 12,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: TROJAN_GOLD, fontSize: isTablet ? 24 : 20, fontWeight: "bold" }}>2</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 13 : 11 }}>Projects</Text>
          </View>
          <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.2)" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: TROJAN_GOLD, fontSize: isTablet ? 24 : 20, fontWeight: "bold" }}>3</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 13 : 11 }}>Quotes</Text>
          </View>
          <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.2)" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: TROJAN_GOLD, fontSize: isTablet ? 24 : 20, fontWeight: "bold" }}>5★</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 13 : 11 }}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: isTablet ? 14 : 10 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          padding: isTablet ? 24 : 20,
          paddingBottom: insets.bottom + (isTablet ? 24 : 20),
        }}
      >
        <Text style={{ color: "#9CA3AF", fontSize: isTablet ? 14 : 12, textAlign: "center" }}>
          Trojan Projects v1.0.0
        </Text>
      </View>
    </View>
  );
}

function DrawerLayout() {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  const drawerWidth = isTablet ? 360 : 300;

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: TROJAN_NAVY,
        headerStyle: {
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTitleStyle: {
          fontWeight: "700",
          color: TROJAN_NAVY,
          fontSize: isTablet ? 20 : 18,
        },
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: drawerWidth,
        },
        drawerActiveBackgroundColor: `${TROJAN_GOLD}20`,
        drawerActiveTintColor: TROJAN_NAVY,
        drawerInactiveTintColor: "#6B7280",
        drawerLabelStyle: {
          marginLeft: -16,
          fontSize: isTablet ? 17 : 15,
          fontWeight: "500",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "Dashboard",
          drawerLabel: "Dashboard",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "Trojan Projects",
          drawerLabel: "All Tabs",
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 16 }}>
                <View
                  style={{
                    backgroundColor: TROJAN_GOLD,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="add" size={18} color={TROJAN_NAVY} />
                  <Text style={{ color: TROJAN_NAVY, fontWeight: "600", marginLeft: 4, fontSize: 13 }}>
                    Quote
                  </Text>
                </View>
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
