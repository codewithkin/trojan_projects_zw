import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";

export default function Services() {
    return (
        <ScrollView className="flex-1" style={{ backgroundColor: "#ffffff" }}>
            <View className="p-4 space-y-4">
                <View className="mb-4">
                    <Text className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Our Services
                    </Text>
                    <Text className="text-gray-600 mt-1">Browse our engineering solutions</Text>
                </View>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Solar Power Systems</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">1.5 KVA to 10 KVA installations starting from US$750</Text>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>CCTV & Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">Professional surveillance systems with 24/7 monitoring</Text>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Electrical Systems</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">Complete electrical installations and repairs</Text>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Water Solutions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">Borehole drilling, pumps, and water systems</Text>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Welding & Fabrication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-gray-700">Custom metalwork and fabrication services</Text>
                    </CardContent>
                </Card>
            </View>
        </ScrollView>
    );
}
