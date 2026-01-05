import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";

export default function Projects() {
  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "#ffffff" }}>
      <View className="p-4 space-y-4">
        <View className="mb-4">
          <Text className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
            My Projects
          </Text>
          <Text className="text-gray-600 mt-1">Track your ongoing installations</Text>
        </View>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>No Projects Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-gray-700">
              Your requested projects and installations will appear here.
            </Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
