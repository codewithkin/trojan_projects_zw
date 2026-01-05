import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    View,
    useWindowDimensions,
} from "react-native";
import PagerView from "react-native-pager-view";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { projects } from "@/data/projects";

const { width: staticWidth, height: staticHeight } = Dimensions.get("window");
const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface OnboardingSlide {
    title: string;
    description: string;
    images: string[];
    highlight: string;
    type: "bubbles" | "background";
}

const slides: OnboardingSlide[] = [
    {
        title: "Welcome to Trojan Projects ZW",
        description: "Your trusted partner for solar installations, electrical systems, CCTV security, and water solutions across Zimbabwe.",
        images: projects[0].images, // 10 KVA Solar System - 6 images
        highlight: "Multi-Service Engineering Excellence",
        type: "bubbles",
    },
    {
        title: "Solar Power Solutions",
        description: "From 1.5 KVA to 10 KVA systems. Power your home or business with reliable, affordable solar energy installations.",
        images: projects[2].images, // 3.5 KVA Solar System - 3 images
        highlight: "Starting from US$750",
        type: "background",
    },
    {
        title: "CCTV & Security Systems",
        description: "Professional HD camera installations with DVR/NVR setup, night vision, and remote phone viewing for complete peace of mind.",
        images: projects[3].images, // CCTV Installation - 5 images
        highlight: "24/7 Surveillance Protection",
        type: "bubbles",
    },
    {
        title: "Get Started Today",
        description: "Join hundreds of satisfied customers. Browse our services, request quotes, and track your installations all in one place.",
        images: projects[1].images, // 1.5 KVA Solar System - 2 images
        highlight: "Your Project is Our Mission",
        type: "background",
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { width, height } = useWindowDimensions();
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;

    const handleNext = () => {
        if (currentPage < slides.length - 1) {
            pagerRef.current?.setPage(currentPage + 1);
        }
    };

    const handleGetStarted = () => {
        router.replace("/login");
    };

    const handleSignUp = () => {
        router.push("/signup");
    };

    const renderBubbles = (images: string[]) => {
        const baseBubbleSize = isLargeTablet ? 180 : isTablet ? 140 : width * 0.35;
        const bubbleSizes = [
            { width: baseBubbleSize * 1.3, height: baseBubbleSize * 1.3 },
            { width: baseBubbleSize, height: baseBubbleSize },
            { width: baseBubbleSize * 0.8, height: baseBubbleSize * 0.8 },
            { width: baseBubbleSize * 0.65, height: baseBubbleSize * 0.65 },
        ];

        // Tone down animations: halve translate distances and slow slightly
        const bubbleAnimations = [
            { translateY: [0, -8, 0], duration: 3600 },
            { translateY: [0, -10, 0], duration: 4000 },
            { translateY: [0, -6, 0], duration: 3200 },
            { translateY: [0, -9, 0], duration: 3800 },
        ];

        return (
            <MotiView
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 200 }}
                className="mb-6"
                style={{ height: isTablet ? height * 0.4 : height * 0.35 }}
            >
                <View className="flex-row flex-wrap justify-center items-center gap-3">
                    {images.slice(0, 4).map((image, idx) => (
                        <MotiView
                            key={idx}
                            from={{ scale: 0, rotate: "-10deg", translateY: 50 }}
                            animate={{
                                scale: 1,
                                rotate: "0deg",
                                translateY: bubbleAnimations[idx].translateY,
                            }}
                            transition={{
                                type: "spring",
                                delay: 300 + idx * 100,
                                damping: 14,
                                translateY: {
                                    type: "timing",
                                    duration: bubbleAnimations[idx].duration,
                                    loop: true,
                                    delay: 1000 + idx * 250,
                                },
                            }}
                        >
                            <Image
                                source={{ uri: image }}
                                style={{
                                    width: bubbleSizes[idx].width,
                                    height: bubbleSizes[idx].height,
                                    borderRadius: 1000,
                                    borderWidth: isTablet ? 4 : 3,
                                    borderColor: TROJAN_GOLD,
                                }}
                                resizeMode="cover"
                            />
                        </MotiView>
                    ))}
                </View>
            </MotiView>
        );
    };

    const renderBackground = (slide: OnboardingSlide, index: number) => {
        return (
            <View key={index} className="flex-1" style={{ backgroundColor: "#ffffff" }}>
                <ImageBackground
                    source={{ uri: slide.images[0] }}
                    style={{
                        width: "100%",
                        height: isTablet ? height * 0.45 : height * 0.4,
                    }}
                    resizeMode="cover"
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(15, 27, 77, 0.7)",
                            justifyContent: "flex-end",
                            paddingBottom: 20,
                        }}
                    >
                        <MotiView
                            from={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ type: "timing", delay: 400 }}
                            className="px-6"
                        >
                            <View
                                className="mb-3 rounded-full self-start"
                                style={{ 
                                    backgroundColor: TROJAN_GOLD,
                                    paddingHorizontal: isTablet ? 20 : 16,
                                    paddingVertical: isTablet ? 10 : 8,
                                }}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 16 : 14 }}
                                >
                                    {slide.highlight}
                                </Text>
                            </View>
                        </MotiView>
                    </View>
                </ImageBackground>

                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "timing", duration: 500 }}
                    className="flex-1 items-center pt-8"
                    style={{
                        borderTopLeftRadius: isTablet ? 32 : 24,
                        borderTopRightRadius: isTablet ? 32 : 24,
                        paddingHorizontal: isTablet ? 40 : 24,
                        maxWidth: isLargeTablet ? 800 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}
                >
                    {/* Title */}
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: "timing", delay: 600 }}
                        className="mb-4"
                    >
                        <Text
                            className="font-bold text-center px-4"
                            style={{ color: TROJAN_NAVY, fontSize: isTablet ? 36 : 30 }}
                        >
                            {slide.title}
                        </Text>
                    </MotiView>

                    {/* Description */}
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: "timing", delay: 800 }}
                        className="mb-8"
                    >
                        <Text
                            className="text-center px-6 leading-6"
                            style={{ color: "#4b5563", fontSize: isTablet ? 18 : 16 }}
                        >
                            {slide.description}
                        </Text>
                    </MotiView>

                    {/* Dots Indicator */}
                    <View className="flex-row gap-2 mb-8">
                        {slides.map((_, dotIndex) => (
                            <MotiView
                                key={dotIndex}
                                animate={{
                                    width: currentPage === dotIndex ? (isTablet ? 32 : 24) : (isTablet ? 12 : 8),
                                    backgroundColor:
                                        currentPage === dotIndex ? TROJAN_GOLD : "rgba(15, 27, 77, 0.2)",
                                }}
                                transition={{ type: "timing", duration: 300 }}
                                style={{ height: isTablet ? 10 : 8, borderRadius: isTablet ? 5 : 4 }}
                            />
                        ))}
                    </View>

                    {/* Buttons */}
                    {currentPage === slides.length - 1 ? (
                        <MotiView
                            from={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ type: "timing", delay: 1000 }}
                            className="w-full px-6 gap-3"
                            style={{ maxWidth: isTablet ? 400 : undefined }}
                        >
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 56 : 48 }}
                                onPress={handleGetStarted}
                            >
                                <Text
                                    className="font-bold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 18 : 16 }}
                                >
                                    Sign In
                                </Text>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                style={{ height: isTablet ? 56 : 48 }}
                                onPress={handleSignUp}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 18 : 16 }}
                                >
                                    Create Account
                                </Text>
                            </Button>
                        </MotiView>
                    ) : (
                        <MotiView
                            from={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ type: "timing", delay: 1000 }}
                            className="w-full px-6"
                            style={{ maxWidth: isTablet ? 400 : undefined }}
                        >
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 56 : 48 }}
                                onPress={handleNext}
                            >
                                <Text
                                    className="font-bold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 18 : 16 }}
                                >
                                    Next
                                </Text>
                            </Button>
                        </MotiView>
                    )}

                    {/* Skip Button */}
                    {currentPage < slides.length - 1 && (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: "timing", delay: 1200 }}
                            className="mt-4"
                        >
                            <Pressable onPress={handleGetStarted}>
                                <Text
                                    style={{ color: "#4b5563", fontSize: isTablet ? 16 : 14 }}
                                >
                                    Skip
                                </Text>
                            </Pressable>
                        </MotiView>
                    )}
                </MotiView>
            </View>
        );
    };

    const renderBubblesSlide = (slide: OnboardingSlide, index: number) => {
        return (
            <View key={index} className="flex-1" style={{ backgroundColor: "#ffffff" }}>
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "timing", duration: 500 }}
                    className="flex-1 items-center justify-center pt-8"
                    style={{
                        paddingHorizontal: isTablet ? 40 : 24,
                        maxWidth: isLargeTablet ? 900 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}
                >
                    {/* Image Bubbles */}
                    {renderBubbles(slide.images)}

                    {/* Highlight Badge */}
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: "timing", delay: 400 }}
                        className="mb-4 rounded-full"
                        style={{ 
                            backgroundColor: TROJAN_GOLD,
                            paddingHorizontal: isTablet ? 20 : 16,
                            paddingVertical: isTablet ? 10 : 8,
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{ color: TROJAN_NAVY, fontSize: isTablet ? 16 : 14 }}
                        >
                            {slide.highlight}
                        </Text>
                    </MotiView>

                    {/* Title */}
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: "timing", delay: 600 }}
                        className="mb-4"
                    >
                        <Text
                            className="font-bold text-center px-4"
                            style={{ color: TROJAN_NAVY, fontSize: isTablet ? 36 : 30 }}
                        >
                            {slide.title}
                        </Text>
                    </MotiView>

                    {/* Description */}
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: "timing", delay: 800 }}
                        className="mb-8"
                    >
                        <Text
                            className="text-center px-6 leading-6"
                            style={{ color: "#4b5563", fontSize: isTablet ? 18 : 16 }}
                        >
                            {slide.description}
                        </Text>
                    </MotiView>

                    {/* Dots Indicator */}
                    <View className="flex-row gap-2 mb-8">
                        {slides.map((_, dotIndex) => (
                            <MotiView
                                key={dotIndex}
                                animate={{
                                    width: currentPage === dotIndex ? (isTablet ? 32 : 24) : (isTablet ? 12 : 8),
                                    backgroundColor:
                                        currentPage === dotIndex ? TROJAN_GOLD : "rgba(15, 27, 77, 0.2)",
                                }}
                                transition={{ type: "timing", duration: 300 }}
                                style={{ height: isTablet ? 10 : 8, borderRadius: isTablet ? 5 : 4 }}
                            />
                        ))}
                    </View>

                    {/* Buttons */}
                    {currentPage === slides.length - 1 ? (
                        <MotiView
                            from={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ type: "timing", delay: 1000 }}
                            className="w-full px-6 gap-3"
                            style={{ maxWidth: isTablet ? 400 : undefined }}
                        >
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 56 : 48 }}
                                onPress={handleGetStarted}
                            >
                                <Text
                                    className="font-bold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 18 : 16 }}
                                >
                                    Sign In
                                </Text>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                style={{ height: isTablet ? 56 : 48 }}
                                onPress={handleSignUp}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 18 : 16 }}
                                >
                                    Create Account
                                </Text>
                            </Button>
                        </MotiView>
                    ) : (
                        <MotiView
                            from={{ translateY: 20, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{ type: "timing", delay: 1000 }}
                            className="w-full px-6"
                            style={{ maxWidth: isTablet ? 400 : undefined }}
                        >
                            <Button
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, height: isTablet ? 56 : 48 }}
                                onPress={handleNext}
                            >
                                <Text
                                    className="font-bold"
                                    style={{ color: TROJAN_NAVY, fontSize: isTablet ? 18 : 16 }}
                                >
                                    Next
                                </Text>
                            </Button>
                        </MotiView>
                    )}

                    {/* Skip Button */}
                    {currentPage < slides.length - 1 && (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: "timing", delay: 1200 }}
                            className="mt-4"
                        >
                            <Pressable onPress={handleGetStarted}>
                                <Text
                                    style={{ color: "#4b5563", fontSize: isTablet ? 16 : 14 }}
                                >
                                    Skip
                                </Text>
                            </Pressable>
                        </MotiView>
                    )}
                </MotiView>
            </View>
        );
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#ffffff" }}>
            <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {slides.map((slide, index) =>
                    slide.type === "bubbles"
                        ? renderBubblesSlide(slide, index)
                        : renderBackground(slide, index)
                )}
            </PagerView>
        </View>
    );
}
