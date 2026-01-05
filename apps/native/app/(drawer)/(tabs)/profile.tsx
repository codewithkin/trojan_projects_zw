import { ScrollView, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const TROJAN_NAVY = "#0F1B4D";

export default function Profile() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.replace("/login");
    };

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#ffffff" }}>
            <View className="p-4 space-y-4">
                <View className="mb-4">
                    <Text className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Profile
                    </Text>
                    <Text className="text-gray-600 mt-1">Manage your account</Text>
                </View>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">Your account details will appear here.</Text>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">Manage your service preferences and location.</Text>
                    </CardContent>
                </Card>

                <View className="mt-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onPress={handleSignOut}
                    >
                        <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                            Sign Out
                        </Text>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}
