import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, View, useWindowDimensions, ScrollView } from "react-native";
import PagerView from "react-native-pager-view";
import { Briefcase, FolderKanban, FileText, MessageSquare } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { staffOnboardingSlides } from "@/data/onboarding";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const iconMap: Record<string, any> = {
    Briefcase,
    FolderKanban,
    FileText,
    MessageSquare,
};

export default function OnboardingScreen() {
    const router = useRouter();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { width, height } = useWindowDimensions();
    const isTablet = width >= 768;

    const handleNext = () => {
        if (currentPage < staffOnboardingSlides.length - 1) {
            pagerRef.current?.setPage(currentPage + 1);
        }
    };

    const handleGetStarted = () => {
        router.replace("/login");
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {staffOnboardingSlides.map((slide, index) => {
                    const IconComponent = iconMap[slide.icon];
                    return (
                        <View key={index} style={{ flex: 1 }}>
                            <ScrollView
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: "center",
                                    paddingHorizontal: isTablet ? 60 : 24,
                                    paddingVertical: 40,
                                }}
                            >
                                {/* Icon */}
                                <View
                                    style={{
                                        alignItems: "center",
                                        marginBottom: isTablet ? 48 : 32,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: `${TROJAN_GOLD}20`,
                                            borderRadius: isTablet ? 80 : 60,
                                            width: isTablet ? 160 : 120,
                                            height: isTablet ? 160 : 120,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <IconComponent
                                            size={isTablet ? 80 : 60}
                                            color={TROJAN_NAVY}
                                            strokeWidth={1.5}
                                        />
                                    </View>
                                </View>

                                {/* Highlight Badge */}
                                <View
                                    style={{
                                        alignSelf: "center",
                                        backgroundColor: TROJAN_GOLD,
                                        paddingHorizontal: isTablet ? 24 : 20,
                                        paddingVertical: isTablet ? 12 : 10,
                                        borderRadius: 24,
                                        marginBottom: isTablet ? 32 : 24,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: TROJAN_NAVY,
                                            fontSize: isTablet ? 16 : 14,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {slide.highlight}
                                    </Text>
                                </View>

                                {/* Title */}
                                <Text
                                    style={{
                                        fontSize: isTablet ? 36 : 28,
                                        fontWeight: "700",
                                        color: TROJAN_NAVY,
                                        textAlign: "center",
                                        marginBottom: isTablet ? 24 : 16,
                                        lineHeight: isTablet ? 44 : 36,
                                    }}
                                >
                                    {slide.title}
                                </Text>

                                {/* Description */}
                                <Text
                                    style={{
                                        fontSize: isTablet ? 18 : 16,
                                        color: "#6b7280",
                                        textAlign: "center",
                                        lineHeight: isTablet ? 28 : 24,
                                        marginBottom: isTablet ? 48 : 32,
                                    }}
                                >
                                    {slide.description}
                                </Text>

                                {/* Dots Indicator */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignSelf: "center",
                                        gap: 8,
                                        marginBottom: isTablet ? 32 : 24,
                                    }}
                                >
                                    {staffOnboardingSlides.map((_, dotIndex) => (
                                        <View
                                            key={dotIndex}
                                            style={{
                                                width: currentPage === dotIndex ? (isTablet ? 32 : 24) : (isTablet ? 10 : 8),
                                                height: isTablet ? 10 : 8,
                                                borderRadius: isTablet ? 5 : 4,
                                                backgroundColor:
                                                    currentPage === dotIndex
                                                        ? TROJAN_GOLD
                                                        : "rgba(15, 27, 77, 0.2)",
                                            }}
                                        />
                                    ))}
                                </View>

                                {/* Button */}
                                {currentPage === staffOnboardingSlides.length - 1 ? (
                                    <Button
                                        style={{
                                            backgroundColor: TROJAN_GOLD,
                                            height: isTablet ? 56 : 48,
                                            maxWidth: isTablet ? 400 : undefined,
                                            alignSelf: "center",
                                            width: "100%",
                                        }}
                                        onPress={handleGetStarted}
                                    >
                                        <Text
                                            style={{
                                                color: TROJAN_NAVY,
                                                fontSize: isTablet ? 18 : 16,
                                                fontWeight: "700",
                                            }}
                                        >
                                            Sign In to Get Started
                                        </Text>
                                    </Button>
                                ) : (
                                    <Button
                                        style={{
                                            backgroundColor: TROJAN_GOLD,
                                            height: isTablet ? 56 : 48,
                                            maxWidth: isTablet ? 400 : undefined,
                                            alignSelf: "center",
                                            width: "100%",
                                        }}
                                        onPress={handleNext}
                                    >
                                        <Text
                                            style={{
                                                color: TROJAN_NAVY,
                                                fontSize: isTablet ? 18 : 16,
                                                fontWeight: "700",
                                            }}
                                        >
                                            Next
                                        </Text>
                                    </Button>
                                )}
                            </ScrollView>
                        </View>
                    );
                })}
            </PagerView>
        </View>
    );
}