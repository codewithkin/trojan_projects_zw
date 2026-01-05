import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function Quotes() {
    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#ffffff" }}>
            <View className="p-4 space-y-4">
                <View className="mb-4">
                    <Text className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Quotes
                    </Text>
                    <Text className="text-gray-600 mt-1">Request and view your quotes</Text>
                </View>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Request a Quote</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700 mb-4">
                            Get a free, no-obligation quote for your project
                        </Text>
                        <Button
                            className="w-full"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                New Quote Request
                            </Text>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Your Quotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">No quotes yet.</Text>
                    </CardContent>
                </Card>
            </View>
        </ScrollView>
    );
}
