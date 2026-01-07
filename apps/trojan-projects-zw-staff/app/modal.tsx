import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View, useWindowDimensions } from "react-native";

import { Container } from "@/components/container";

function Modal() {
  const accentForegroundColor = useThemeColor("accent-foreground");
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  function handleClose() {
    router.back();
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-4">
        <Surface
          variant="secondary"
          className="p-5 w-full rounded-lg"
          style={{
            maxWidth: isTablet ? 480 : 400,
            padding: isTablet ? 32 : 20,
          }}
        >
          <View className="items-center">
            <View
              className="bg-accent rounded-lg items-center justify-center mb-3"
              style={{
                width: isTablet ? 64 : 48,
                height: isTablet ? 64 : 48,
                borderRadius: isTablet ? 16 : 8,
                marginBottom: isTablet ? 16 : 12,
              }}
            >
              <Ionicons name="checkmark" size={isTablet ? 32 : 24} color={accentForegroundColor} />
            </View>
            <Text
              className="text-foreground font-medium mb-1"
              style={{ fontSize: isTablet ? 22 : 18 }}
            >
              Modal Screen
            </Text>
            <Text
              className="text-muted text-center mb-4"
              style={{ fontSize: isTablet ? 16 : 14, marginBottom: isTablet ? 24 : 16 }}
            >
              This is an example modal screen for dialogs and confirmations.
            </Text>
          </View>
          <Button
            onPress={handleClose}
            className="w-full"
            size={isTablet ? "md" : "sm"}
          >
            <Button.Label>Close</Button.Label>
          </Button>
        </Surface>
      </View>
    </Container>
  );
}

export default Modal;
