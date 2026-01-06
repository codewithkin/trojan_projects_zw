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

interface Service {
    id: string;
    name: string;
    slug: string;
    category: string;
}

export default function NewQuoteScreen() {
    const router = useRouter();
    const { isAuthenticated, requireAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingServices, setFetchingServices] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [showServicePicker, setShowServicePicker] = useState(false);
    const [formData, setFormData] = useState({
        serviceId: "",
        serviceName: "",
        location: "",
        notes: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/services`);
            const data = await response.json();
            if (data.services) {
                setServices(data.services);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            Alert.alert("Error", "Failed to load services");
        } finally {
            setFetchingServices(false);
        }
    };

    const handleSubmit = async () => {
        // Check auth first
        const isAuthed = await requireAuth("Please sign in to request a quote");
        if (!isAuthed) return;

        if (!formData.serviceId || !formData.location) {
            Alert.alert("Error", "Please select a service and enter your location");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/quotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    serviceId: formData.serviceId,
                    location: formData.location,
                    notes: formData.notes || null,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Quote request submitted successfully!", [
                    { text: "OK", onPress: () => router.push("/(tabs)/quotes") },
                ]);
            } else {
                Alert.alert("Error", data.error || "Failed to submit quote");
            }
        } catch (error) {
            console.error("Error submitting quote:", error);
            Alert.alert("Error", "Failed to submit quote. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) {
            acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

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
                        style={{ backgroundColor: TROJAN_GOLD, width: 'fit-content' }}
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
                            Please sign in to request a quote
                        </StyledText>
                        <Button
                            onPress={() => requireAuth("Sign in to request a quote")}
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
                            className="flex-row items-center mb-6 px-3 py-2 rounded-lg w-fit"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <ArrowLeft size={20} color={TROJAN_NAVY} />
                            <Text className="ml-2 font-semibold" style={{ color: TROJAN_NAVY }}>Back</Text>
                        </Pressable>
                    {fetchingServices ? (
                        <View className="items-center justify-center py-12">
                            <ActivityIndicator size="large" color={TROJAN_GOLD} />
                            <Text className="text-gray-500 mt-4">Loading services...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Service Selection */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Service Type *
                                </Text>
                                <Pressable
                                    onPress={() => setShowServicePicker(!showServicePicker)}
                                    className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white"
                                >
                                    <Text
                                        className={formData.serviceName ? "text-gray-900" : "text-gray-400"}
                                    >
                                        {formData.serviceName || "Select a service"}
                                    </Text>
                                    <ChevronDown size={20} color="#6B7280" />
                                </Pressable>
                                {showServicePicker && (
                                    <View className="border border-gray-200 rounded-lg mt-2 bg-white max-h-64">
                                        <ScrollView nestedScrollEnabled>
                                            {Object.entries(groupedServices).map(([category, categoryServices]) => (
                                                <View key={category}>
                                                    <View className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                                                        <Text className="text-xs font-semibold text-gray-600 uppercase">
                                                            {category}
                                                        </Text>
                                                    </View>
                                                    {categoryServices.map((service) => (
                                                        <Pressable
                                                            key={service.id}
                                                            onPress={() => {
                                                                setFormData({
                                                                    ...formData,
                                                                    serviceId: service.id,
                                                                    serviceName: service.name,
                                                                });
                                                                setShowServicePicker(false);
                                                            }}
                                                            className="p-3 border-b border-gray-100"
                                                        >
                                                            <Text className="text-gray-900">{service.name}</Text>
                                                        </Pressable>
                                                    ))}
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* Location */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Project Location *
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                    placeholder="e.g., Borrowdale, Harare"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.location}
                                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                                />
                            </View>

                            {/* Project Description */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Project Description
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                    placeholder="Describe your project requirements, timeline, and any specific details..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                    value={formData.notes}
                                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                    style={{ minHeight: 120 }}
                                />
                                <Text className="text-xs text-gray-500 mt-1">
                                    Include any relevant details to help us provide an accurate quote
                                </Text>
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
                                            Our team will review your quote request within 24 hours
                                        </Text>
                                    </View>
                                    <View className="flex-row items-start">
                                        <Text className="text-blue-800 mr-2">•</Text>
                                        <Text className="text-sm text-blue-800 flex-1">
                                            We'll contact you to discuss project details and provide an estimate
                                        </Text>
                                    </View>
                                    <View className="flex-row items-start">
                                        <Text className="text-blue-800 mr-2">•</Text>
                                        <Text className="text-sm text-blue-800 flex-1">
                                            Once approved, you can start your project from the quotes page
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
                                            Submit Request
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
