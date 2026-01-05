import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { projects } from "@/data/projects";

const { width, height } = Dimensions.get("window");
const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface OnboardingSlide {
  title: string;
  description: string;
  image: string;
  highlight: string;
}

const slides: OnboardingSlide[] = [
  {
    title: "Welcome to Trojan Projects ZW",
    description: "Your trusted partner for solar installations, electrical systems, CCTV security, and water solutions across Zimbabwe.",
    image: projects[0].images[0], // 10 KVA Solar System
    highlight: "Multi-Service Engineering Excellence",
  },
  {
    title: "Solar Power Solutions",
    description: "From 1.5 KVA to 10 KVA systems. Power your home or business with reliable, affordable solar energy installations.",
    image: projects[2].images[0], // 3.5 KVA Solar System
    highlight: "Starting from US$750",
  },
  {
    title: "CCTV & Security Systems",
    description: "Professional HD camera installations with DVR/NVR setup, night vision, and remote phone viewing for complete peace of mind.",
    image: projects[3].images[0], // CCTV Installation
    highlight: "24/7 Surveillance Protection",
  },
  {
    title: "Get Started Today",
    description: "Join hundreds of satisfied customers. Browse our services, request quotes, and track your installations all in one place.",
    image: projects[1].images[0], // 1.5 KVA Solar System
    highlight: "Your Project is Our Mission",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  return (
    <View className="flex-1" style={{ backgroundColor: TROJAN_NAVY }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {slides.map((slide, index) => (
          <View key={index} className="flex-1">
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", duration: 500 }}
              className="flex-1 items-center justify-center px-6"
            >
              {/* Image */}
              <MotiView
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 200 }}
                className="mb-8"
              >
                <Image
                  source={{ uri: slide.image }}
                  style={{
                    width: width * 0.8,
                    height: height * 0.35,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
              </MotiView>

              {/* Highlight Badge */}
              <MotiView
                from={{ translateY: 20, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ type: "timing", delay: 400 }}
                className="mb-4 px-4 py-2 rounded-full"
                style={{ backgroundColor: TROJAN_GOLD }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: TROJAN_NAVY }}
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
                  className="text-3xl font-bold text-center px-4"
                  style={{ color: "white" }}
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
                  className="text-base text-center px-6 leading-6"
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
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
                      width: currentPage === dotIndex ? 24 : 8,
                      backgroundColor:
                        currentPage === dotIndex ? TROJAN_GOLD : "rgba(255, 193, 7, 0.3)",
                    }}
                    transition={{ type: "timing", duration: 300 }}
                    className="h-2 rounded-full"
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
                >
                  <Button
                    className="w-full h-14"
                    style={{ backgroundColor: TROJAN_GOLD }}
                    onPress={handleGetStarted}
                  >
                    <Text
                      className="font-bold text-lg"
                      style={{ color: TROJAN_NAVY }}
                    >
                      Sign In
                    </Text>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-14"
                    style={{ borderColor: TROJAN_GOLD }}
                    onPress={handleSignUp}
                  >
                    <Text
                      className="font-semibold text-lg"
                      style={{ color: TROJAN_GOLD }}
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
                >
                  <Button
                    className="w-full h-14"
                    style={{ backgroundColor: TROJAN_GOLD }}
                    onPress={handleNext}
                  >
                    <Text
                      className="font-bold text-lg"
                      style={{ color: TROJAN_NAVY }}
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
                      className="text-sm"
                      style={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      Skip
                    </Text>
                  </Pressable>
                </MotiView>
              )}
            </MotiView>
          </View>
        ))}
      </PagerView>
    </View>
  );
}
