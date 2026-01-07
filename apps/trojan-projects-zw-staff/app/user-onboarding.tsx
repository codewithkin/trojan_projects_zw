import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    View,
} from "react-native";
import * as LucideIcons from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { serviceTags, zimbabweLocations, type UserPreferences } from "@/data/onboarding";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function UserOnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    const toggleInterest = (tagId: string) => {
        setSelectedInterests((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleNext = () => {
        if (step === 1 && selectedInterests.length > 0) {
            setStep(2);
        }
    };

    const handleComplete = async () => {
        if (!selectedLocation) return;

        // TODO: Save preferences to API
        const preferences: UserPreferences = {
            interests: selectedInterests,
            location: selectedLocation,
        };

        console.log("Saving preferences:", preferences);

        // Redirect to main app (drawer)
        router.replace("/(drawer)");
    };

    const getIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName];
        return Icon ? <Icon size={24} color={TROJAN_GOLD} /> : null;
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#ffffff" }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingTop: 60 }}
            >
                {/* Progress indicator */}
                <View className="flex-row gap-2 mb-8 justify-center">
                    <MotiView
                        animate={{
                            width: step === 1 ? 48 : 24,
                            backgroundColor: step === 1 ? TROJAN_GOLD : "rgba(15, 27, 77, 0.2)",
                        }}
                        transition={{ type: "timing", duration: 300 }}
                        className="h-2 rounded-full"
                    />
                    <MotiView
                        animate={{
                            width: step === 2 ? 48 : 24,
                            backgroundColor: step === 2 ? TROJAN_GOLD : "rgba(15, 27, 77, 0.2)",
                        }}
                        transition={{ type: "timing", duration: 300 }}
                        className="h-2 rounded-full"
                    />
                </View>

                {step === 1 && (
                    <MotiView
                        from={{ opacity: 0, translateX: 20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ type: "timing", duration: 300 }}
                    >
                        <View className="mb-8">
                            <Text
                                className="text-4xl font-bold mb-3 text-center"
                                style={{ color: TROJAN_NAVY }}
                            >
                                What brings you here?
                            </Text>
                            <Text className="text-center text-slate-600">
                                Select all the services you're interested in
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap gap-3">
                            {serviceTags.map((tag, index) => {
                                const isSelected = selectedInterests.includes(tag.id);
                                return (
                                    <MotiView
                                        key={tag.id}
                                        from={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "timing", delay: index * 50 }}
                                        style={{ width: "48%" }}
                                    >
                                        <Pressable
                                            onPress={() => toggleInterest(tag.id)}
                                            className="p-4 rounded-xl border-2 flex-col items-center gap-2"
                                            style={{
                                                borderColor: isSelected ? TROJAN_GOLD : "#e2e8f0",
                                                backgroundColor: isSelected
                                                    ? "rgba(255, 193, 7, 0.1)"
                                                    : "#ffffff",
                                            }}
                                        >
                                            <View style={{ opacity: isSelected ? 1 : 0.5 }}>
                                                {getIcon(tag.icon)}
                                            </View>
                                            <Text
                                                className="text-sm font-medium text-center"
                                                style={{
                                                    color: isSelected ? TROJAN_NAVY : "#64748b",
                                                }}
                                            >
                                                {tag.name}
                                            </Text>
                                        </Pressable>
                                    </MotiView>
                                );
                            })}
                        </View>

                        <View className="mt-8 items-center">
                            <Button
                                onPress={handleNext}
                                disabled={selectedInterests.length === 0}
                                className="px-8 h-14 w-full max-w-xs"
                                style={{
                                    backgroundColor:
                                        selectedInterests.length > 0 ? TROJAN_GOLD : "#d1d5db",
                                }}
                            >
                                <Text
                                    className="text-lg font-bold"
                                    style={{ color: TROJAN_NAVY }}
                                >
                                    Continue
                                </Text>
                            </Button>
                        </View>
                    </MotiView>
                )}

                {step === 2 && (
                    <MotiView
                        from={{ opacity: 0, translateX: 20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ type: "timing", duration: 300 }}
                    >
                        <View className="mb-8">
                            <Text
                                className="text-4xl font-bold mb-3 text-center"
                                style={{ color: TROJAN_NAVY }}
                            >
                                Where are you based?
                            </Text>
                            <Text className="text-center text-slate-600">
                                Help us serve you better by letting us know your location
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap gap-2 mb-8">
                            {zimbabweLocations.map((location, index) => {
                                const isSelected = selectedLocation === location;
                                return (
                                    <MotiView
                                        key={location}
                                        from={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "timing", delay: index * 20 }}
                                    >
                                        <Pressable
                                            onPress={() => setSelectedLocation(location)}
                                            className="px-4 py-3 rounded-lg border-2"
                                            style={{
                                                borderColor: isSelected ? TROJAN_GOLD : "#e2e8f0",
                                                backgroundColor: isSelected
                                                    ? "rgba(255, 193, 7, 0.1)"
                                                    : "#ffffff",
                                            }}
                                        >
                                            <Text
                                                className="text-sm font-medium"
                                                style={{
                                                    color: isSelected ? TROJAN_NAVY : "#64748b",
                                                }}
                                            >
                                                {location}
                                            </Text>
                                        </Pressable>
                                    </MotiView>
                                );
                            })}
                        </View>

                        <View className="flex-row gap-3 mt-8">
                            <Button
                                onPress={() => setStep(1)}
                                variant="outline"
                                className="flex-1 h-14"
                                style={{
                                    borderColor: TROJAN_NAVY,
                                }}
                            >
                                <Text className="font-bold" style={{ color: TROJAN_NAVY }}>
                                    Back
                                </Text>
                            </Button>
                            <Button
                                onPress={handleComplete}
                                disabled={!selectedLocation}
                                className="flex-1 h-14"
                                style={{
                                    backgroundColor: selectedLocation ? TROJAN_GOLD : "#d1d5db",
                                }}
                            >
                                <Text
                                    className="text-lg font-bold"
                                    style={{ color: TROJAN_NAVY }}
                                >
                                    Get Started
                                </Text>
                            </Button>
                        </View>
                    </MotiView>
                )}
            </ScrollView>
        </View>
    );
}
