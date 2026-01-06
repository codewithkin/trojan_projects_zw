import React from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { AlertTriangle, RefreshCw, Home } from "lucide-react-native";
import { useRouter, ErrorBoundaryProps } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View 
      className="flex-1 justify-center items-center p-6"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <ScrollView 
        contentContainerClassName="items-center justify-center min-h-full"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center max-w-md w-full">
          {/* Error Icon */}
          <View 
            className="rounded-full items-center justify-center mb-4"
            style={{ 
              backgroundColor: `${TROJAN_GOLD}20`,
              width: isTablet ? 112 : 96,
              height: isTablet ? 112 : 96
            }}
          >
            <AlertTriangle size={isTablet ? 56 : 48} color={TROJAN_NAVY} />
          </View>
          <View 
            className="rounded-full mb-6"
            style={{ 
              backgroundColor: TROJAN_GOLD,
              width: isTablet ? 96 : 72,
              height: 4
            }}
          />

          {/* Message */}
          <Text 
            className="font-bold text-center mb-3"
            style={{ 
              color: TROJAN_NAVY,
              fontSize: isTablet ? 24 : 20
            }}
          >
            Something Went Wrong
          </Text>
          <Text 
            className="text-center text-gray-600 mb-2"
            style={{ fontSize: isTablet ? 16 : 14 }}
          >
            We encountered an unexpected error. Don't worry, our team has been notified.
          </Text>

          {/* Error Details (Development) */}
          {__DEV__ && (
            <View className="w-full bg-red-50 p-4 rounded-lg mb-6 mt-4">
              <Text className="text-red-800 font-medium text-sm mb-2">
                Error Details (Development Only)
              </Text>
              <ScrollView 
                className="max-h-40" 
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
                <Text className="text-red-700 text-xs">
                  {error.message}
                </Text>
              </ScrollView>
            </View>
          )}

          {/* Actions */}
          <View className="w-full gap-3 mt-6">
            <Button 
              onPress={retry}
              className="flex-row items-center justify-center gap-2"
              style={{ 
                backgroundColor: TROJAN_NAVY,
                height: isTablet ? 52 : 48
              }}
            >
              <RefreshCw size={isTablet ? 20 : 18} color="white" />
              <Text 
                className="text-white font-semibold"
                style={{ fontSize: isTablet ? 16 : 14 }}
              >
                Try Again
              </Text>
            </Button>
            <Button 
              onPress={() => router.push("/(tabs)")}
              variant="outline"
              className="flex-row items-center justify-center gap-2"
              style={{ 
                borderColor: TROJAN_NAVY,
                height: isTablet ? 52 : 48
              }}
            >
              <Home size={isTablet ? 20 : 18} color={TROJAN_NAVY} />
              <Text 
                className="font-semibold"
                style={{ 
                  color: TROJAN_NAVY,
                  fontSize: isTablet ? 16 : 14
                }}
              >
                Go Home
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
