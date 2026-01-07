import { useState, useRef, useEffect } from "react";
import {
    View,
    Pressable,
    Animated,
    StyleSheet,
    Dimensions,
    Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, X, FolderPlus, FileText } from "lucide-react-native";
import { Text } from "@/components/ui/text";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface FABAction {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}

export function FABGroup() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const actions: FABAction[] = [
        {
            icon: <FolderPlus size={22} color={TROJAN_NAVY} />,
            label: "New Project",
            onPress: () => {
                setIsOpen(false);
                router.push("/new/project");
            },
        },
        {
            icon: <FileText size={22} color={TROJAN_NAVY} />,
            label: "New Quote",
            onPress: () => {
                setIsOpen(false);
                router.push("/new/quote");
            },
        },
    ];

    useEffect(() => {
        Animated.parallel([
            Animated.spring(animation, {
                toValue: isOpen ? 1 : 0,
                useNativeDriver: true,
                friction: 6,
                tension: 80,
            }),
            Animated.timing(rotateAnimation, {
                toValue: isOpen ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isOpen]);

    const rotate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "45deg"],
    });

    const backdropOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => setIsOpen(false)}
                >
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: "black",
                                opacity: backdropOpacity,
                            },
                        ]}
                    />
                </Pressable>
            )}

            {/* FAB Container */}
            <View style={styles.container}>
                {/* Action buttons */}
                {actions.map((action, index) => {
                    const translateY = animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -((index + 1) * 70)],
                    });

                    const scale = animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.5, 1],
                    });

                    const opacity = animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0, 1],
                    });

                    return (
                        <Animated.View
                            key={action.label}
                            style={[
                                styles.actionContainer,
                                {
                                    transform: [{ translateY }, { scale }],
                                    opacity,
                                },
                            ]}
                        >
                            <Pressable
                                onPress={action.onPress}
                                style={styles.actionLabelContainer}
                            >
                                <Text style={styles.actionLabel}>
                                    {action.label}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={action.onPress}
                                style={styles.actionButton}
                            >
                                {action.icon}
                            </Pressable>
                        </Animated.View>
                    );
                })}

                {/* Main FAB button */}
                <Pressable
                    onPress={() => setIsOpen(!isOpen)}
                    style={[styles.mainButton, { backgroundColor: TROJAN_GOLD }]}
                >
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <Plus size={28} color={TROJAN_NAVY} strokeWidth={2.5} />
                    </Animated.View>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 24,
        right: 24,
        alignItems: "center",
    },
    mainButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    actionContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    actionLabelContainer: {
        backgroundColor: "white",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    actionLabel: {
        color: TROJAN_NAVY,
        fontWeight: "600",
        fontSize: 14,
    },
});
