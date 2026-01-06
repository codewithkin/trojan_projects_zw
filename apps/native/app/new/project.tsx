import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown, Lock } from "lucide-react-native";
import { env } from "@trojan_projects_zw/env/native";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Text as StyledText } from "@/components/ui/text";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Quote {
    id: string;
    service: {
        id: string;
        name: string;
        category: string;
    };
    location: string;
    notes: string | null;
    estimatedPrice: number | null;
    status: string;
    hasProject: boolean;
    createdAt: string;
}

export default function NewProjectScreen() {
    const router = useRouter();
    const { user, isAuthenticated, requireAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingQuotes, setFetchingQuotes] = useState(true);
    const [approvedQuotes, setApprovedQuotes] = useState<Quote[]>([]);
    const [showQuotePicker, setShowQuotePicker] = useState(false);
    const [formData, setFormData] = useState({
        quoteId: "",
        quoteName: "",
        finalPrice: "",
        scheduledDate: "",
        notes: "",
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchApprovedQuotes();
        } else {
            setFetchingQuotes(false);
        }
    }, [isAuthenticated]);

    const fetchApprovedQuotes = async () => {
        try {
            const response = await fetch(
                `${env.EXPO_PUBLIC_API_URL}/api/quotes?status=approved`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (data.quotes) {
                // Filter quotes that don't have projects yet
                const quotesWithoutProjects = data.quotes.filter((q: Quote) => !q.hasProject);
                setApprovedQuotes(quotesWithoutProjects);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
            Alert.alert("Error", "Failed to load approved quotes");
        } finally {
            setFetchingQuotes(false);
        }
    };

    const handleSubmit = async () => {
        // Check auth first
        const isAuthed = await requireAuth("Please sign in to create a project");
        if (!isAuthed) return;

        if (!formData.quoteId) {
            Alert.alert("Error", "Please select an approved quote");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${env.EXPO_PUBLIC_API_URL}/api/quotes/${formData.quoteId}/promote`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        finalPrice: formData.finalPrice ? parseFloat(formData.finalPrice) : null,
                        scheduledDate: formData.scheduledDate || null,
                        notes: formData.notes || null,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Project created successfully!", [
                    { text: "OK", onPress: () => router.push("/(tabs)/projects") },
                ]);
            } else {
                Alert.alert("Error", data.error || "Failed to create project");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            Alert.alert("Error", "Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const selectedQuote = approvedQuotes.find((q) => q.id === formData.quoteId);

    // If not authenticated, show auth prompt
    if (!isAuthenticated) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: "#F9FAFB",
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                }}
            >
                <View className="p-4">
                    <Pressable
                        onPress={() => router.back()}
                        className="flex-row items-center mb-4 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: TROJAN_GOLD }}
                    >
                        <ArrowLeft size={20} color={TROJAN_NAVY} />
                        <Text className="ml-2 font-semibold" style={{ color: TROJAN_NAVY }}>Back</Text>
                    </Pressable>
                </View>
                <View className="flex-1 items-center justify-center p-6">
                    <View className="bg-white rounded-2xl p-8 items-center w-full max-w-sm shadow-sm">
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mb-4"
                            style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                        >
                            <Lock size={32} color={TROJAN_NAVY} />
                        </View>
                        <StyledText className="text-xl font-bold text-center mb-2" style={{ color: TROJAN_NAVY }}>
                            Sign In Required
                        </StyledText>
                        <StyledText className="text-gray-500 text-center mb-6">
                            Please sign in to create a new project
                        </StyledText>
                        <Button
                            onPress={() => requireAuth("Sign in to create a new project")}
                            className="w-full"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <StyledText className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                Sign In
                            </StyledText>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="p-4">
                        <Pressable
                            onPress={() => router.back()}
                            className="flex-row items-center mb-6 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <ArrowLeft size={20} color={TROJAN_NAVY} />
                            <Text className="ml-2 font-semibold" style={{ color: TROJAN_NAVY }}>Back</Text>
                        </Pressable>
                        {fetchingQuotes ? (
                            <View className="items-center justify-center py-12">
                                <ActivityIndicator size="large" color={TROJAN_GOLD} />
                                <Text className="text-gray-500 mt-4">Loading approved quotes...</Text>
                            </View>
                        ) : approvedQuotes.length === 0 ? (
                            <View className="bg-white rounded-lg p-8 items-center">
                                <Text className="text-5xl mb-3">📋</Text>
                                <Text className="text-lg font-semibold text-gray-900 mb-2">
                                    No Approved Quotes
                                </Text>
                                <Text className="text-gray-500 text-center mb-4">
                                    You need an approved quote before starting a project
                                </Text>
                                <Pressable
                                    onPress={() => router.push("/new/quote")}
                                    className="rounded-lg p-3 px-6"
                                    style={{ backgroundColor: TROJAN_GOLD }}
                                >
                                    <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                        Request a Quote
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <>
                                {/* Quote Selection */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Select Approved Quote *
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowQuotePicker(!showQuotePicker)}
                                        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white"
                                    >
                                        <Text
                                            className={formData.quoteName ? "text-gray-900" : "text-gray-400"}
                                            numberOfLines={1}
                                            style={{ flex: 1 }}
                                        >
                                            {formData.quoteName || "Choose a quote"}
                                        </Text>
                                        <ChevronDown size={20} color="#6B7280" />
                                    </Pressable>
                                    {showQuotePicker && (
                                        <View className="border border-gray-200 rounded-lg mt-2 bg-white max-h-64">
                                            <ScrollView nestedScrollEnabled>
                                                {approvedQuotes.map((quote) => (
                                                    <Pressable
                                                        key={quote.id}
                                                        onPress={() => {
                                                            setFormData({
                                                                ...formData,
                                                                quoteId: quote.id,
                                                                quoteName: `${quote.service.name} - ${quote.location}`,
                                                            });
                                                            setShowQuotePicker(false);
                                                        }}
                                                        className="p-3 border-b border-gray-100"
                                                    >
                                                        <Text className="text-gray-900 font-medium">
                                                            {quote.service.name}
                                                        </Text>
                                                        <Text className="text-sm text-gray-500 mt-1">
                                                            {quote.location}
                                                            {quote.estimatedPrice && (
                                                                <Text className="text-gray-600">
                                                                    {" "}• US${quote.estimatedPrice.toFixed(2)}
                                                                </Text>
                                                            )}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Selected Quote Details */}
                                {selectedQuote && (
                                    <View className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                                        <Text className="font-semibold text-blue-900 mb-2">
                                            Quote Details
                                        </Text>
                                        <View className="space-y-1">
                                            <View className="flex-row">
                                                <Text className="text-sm font-medium text-blue-800 w-24">
                                                    Service:
                                                </Text>
                                                <Text className="text-sm text-blue-800 flex-1">
                                                    {selectedQuote.service.name}
                                                </Text>
                                            </View>
                                            <View className="flex-row">
                                                <Text className="text-sm font-medium text-blue-800 w-24">
                                                    Location:
                                                </Text>
                                                <Text className="text-sm text-blue-800 flex-1">
                                                    {selectedQuote.location}
                                                </Text>
                                            </View>
                                            {selectedQuote.notes && (
                                                <View className="flex-row">
                                                    <Text className="text-sm font-medium text-blue-800 w-24">
                                                        Notes:
                                                    </Text>
                                                    <Text className="text-sm text-blue-800 flex-1">
                                                        {selectedQuote.notes}
                                                    </Text>
                                                </View>
                                            )}
                                            {selectedQuote.estimatedPrice && (
                                                <View className="flex-row">
                                                    <Text className="text-sm font-medium text-blue-800 w-24">
                                                        Estimate:
                                                    </Text>
                                                    <Text className="text-sm text-blue-800 flex-1">
                                                        US${selectedQuote.estimatedPrice.toFixed(2)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}

                                {/* Final Price */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Final Price (Optional)
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        placeholder="e.g., 1250.00"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="decimal-pad"
                                        value={formData.finalPrice}
                                        onChangeText={(text) => setFormData({ ...formData, finalPrice: text })}
                                    />
                                    <Text className="text-xs text-gray-500 mt-1">
                                        Leave blank to use the estimated price from the quote
                                    </Text>
                                </View>

                                {/* Scheduled Date */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Scheduled Start Date (Optional)
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.scheduledDate}
                                        onChangeText={(text) => setFormData({ ...formData, scheduledDate: text })}
                                    />
                                    <Text className="text-xs text-gray-500 mt-1">
                                        Format: YYYY-MM-DD (e.g., 2026-02-15)
                                    </Text>
                                </View>

                                {/* Additional Notes */}
                                <View className="mb-6">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes (Optional)
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        placeholder="Any additional information about the project..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        value={formData.notes}
                                        onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                        style={{ minHeight: 100 }}
                                    />
                                </View>

                                {/* Info Card */}
                                <View className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                                    <Text className="font-semibold text-blue-900 mb-2">
                                        What happens next?
                                    </Text>
                                    <View className="space-y-2">
                                        <View className="flex-row items-start">
                                            <Text className="text-blue-800 mr-2">•</Text>
                                            <Text className="text-sm text-blue-800 flex-1">
                                                Your project will be created with a "scheduled" status
                                            </Text>
                                        </View>
                                        <View className="flex-row items-start">
                                            <Text className="text-blue-800 mr-2">•</Text>
                                            <Text className="text-sm text-blue-800 flex-1">
                                                Our team will assign a technician and contact you to confirm details
                                            </Text>
                                        </View>
                                        <View className="flex-row items-start">
                                            <Text className="text-blue-800 mr-2">•</Text>
                                            <Text className="text-sm text-blue-800 flex-1">
                                                You can track project progress from the projects page
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View className="flex-row gap-3 mb-8">
                                    <Pressable
                                        onPress={() => router.back()}
                                        disabled={loading}
                                        className="flex-1 border border-gray-300 rounded-lg p-4 items-center bg-white"
                                    >
                                        <Text className="font-semibold text-gray-700">Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 rounded-lg p-4 items-center"
                                        style={{ backgroundColor: TROJAN_GOLD }}
                                    >
                                        {loading ? (
                                            <ActivityIndicator size="small" color={TROJAN_NAVY} />
                                        ) : (
                                            <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                                Start Project
                                            </Text>
                                        )}
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
