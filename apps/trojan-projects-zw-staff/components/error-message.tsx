import { MotiView } from "moti";
import { View } from "react-native";
import { AlertCircle } from "lucide-react-native";

import { Text } from "@/components/ui/text";

interface ErrorMessageProps {
    message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "timing", duration: 200 }}
        >
            <View
                className="flex-row items-center gap-2 p-3 rounded-lg"
                style={{ backgroundColor: "#FEE2E2" }}
            >
                <AlertCircle size={18} color="#DC2626" />
                <Text
                    className="flex-1 text-sm"
                    style={{ color: "#991B1B" }}
                >
                    {message}
                </Text>
            </View>
        </MotiView>
    );
}
