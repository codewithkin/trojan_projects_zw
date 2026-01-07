import { useState, useEffect, useMemo } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChevronDown, Lock, Search, X } from "lucide-react-native";
import { env } from "@trojan_projects_zw/env/native";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Text as StyledText } from "@/components/ui/text";
import { zimbabweLocations } from "@/data/onboarding";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface Service {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    priceFormatted?: string;
}

export default function NewProjectScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ serviceId?: string }>();
    const { user, isAuthenticated, requireAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingServices, setFetchingServices] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [showServicePicker, setShowServicePicker] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [serviceSearchQuery, setServiceSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        serviceId: "",
        serviceName: "",
        location: "",
        price: "",
        scheduledDate: "",
        notes: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    // Auto-select service if serviceId is provided in query params
    useEffect(() => {
        if (params.serviceId && services.length > 0 && !formData.serviceId) {
            const preSelectedService = services.find(s => s.id === params.serviceId);
            if (preSelectedService) {
                handleServiceSelect(preSelectedService);
            }
        }
    }, [params.serviceId, services]);

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

    // Filter services based on search query
    const filteredServices = useMemo(() => {
        if (!serviceSearchQuery.trim()) return services;
        const query = serviceSearchQuery.toLowerCase();
        return services.filter(
            (s) =>
                s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query)
        );
    }, [services, serviceSearchQuery]);

    // Handle service selection - auto-fill price
    const handleServiceSelect = (service: Service) => {
        setFormData({
            ...formData,
            serviceId: service.id,
            serviceName: service.name,
            price: service.price ? service.price.toString() : "",
        });
        setShowServicePicker(false);
        setServiceSearchQuery("");
    };

    const handleSubmit = async () => {
        // Check auth first
        const isAuthed = await requireAuth("Please sign in to create a project");
        if (!isAuthed) return;

        if (!formData.serviceId) {
            Alert.alert("Error", "Please select a service");
            return;
        }

        if (!formData.location) {
            Alert.alert("Error", "Please select a location");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${env.EXPO_PUBLIC_API_URL}/api/projects`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        serviceId: formData.serviceId,
                        location: formData.location,
                        price: formData.price ? parseFloat(formData.price) : null,
                        scheduledDate: formData.scheduledDate || null,
                        notes: formData.notes || null,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Project created successfully!", [
                    { text: "OK", onPress: () => router.replace("/") },
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
                        className="flex-row items-center mb-4 px-3 py-2 rounded-lg w-fit self-start"
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
                            className="flex-row items-center mb-6 px-3 py-2 rounded-lg w-fit self-start"
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
                                        Service *
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowServicePicker(!showServicePicker)}
                                        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white"
                                    >
                                        <Text
                                            className={formData.serviceName ? "text-gray-900" : "text-gray-400"}
                                            numberOfLines={1}
                                            style={{ flex: 1 }}
                                        >
                                            {formData.serviceName || "Select a service"}
                                        </Text>
                                        <ChevronDown size={20} color="#6B7280" />
                                    </Pressable>
                                    {showServicePicker && services.length > 0 && (
                                        <View className="border border-gray-200 rounded-lg mt-2 bg-white max-h-96">
                                            {/* Search Input */}
                                            <View className="p-2 border-b border-gray-100">
                                                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                                                    <Search size={18} color="#6B7280" />
                                                    <TextInput
                                                        placeholder="Search services..."
                                                        placeholderTextColor="#9CA3AF"
                                                        value={serviceSearchQuery}
                                                        onChangeText={setServiceSearchQuery}
                                                        className="flex-1 ml-2 text-gray-900"
                                                        autoFocus
                                                    />
                                                    {serviceSearchQuery.length > 0 && (
                                                        <Pressable onPress={() => setServiceSearchQuery("")}>
                                                            <X size={18} color="#6B7280" />
                                                        </Pressable>
                                                    )}
                                                </View>
                                            </View>
                                            <ScrollView nestedScrollEnabled style={{ maxHeight: 280 }}>
                                                {filteredServices.length > 0 ? (
                                                    filteredServices.map((service) => (
                                                        <Pressable
                                                            key={service.id}
                                                            onPress={() => handleServiceSelect(service)}
                                                            className="p-3 border-b border-gray-100"
                                                        >
                                                            <View className="flex-row items-center justify-between">
                                                                <View className="flex-1">
                                                                    <Text className="text-gray-900 font-medium">
                                                                        {service.name}
                                                                    </Text>
                                                                    <Text className="text-sm text-gray-500 mt-0.5">
                                                                        {service.category}
                                                                    </Text>
                                                                </View>
                                                                <Text
                                                                    className="font-semibold ml-2"
                                                                    style={{ color: TROJAN_NAVY }}
                                                                >
                                                                    ${service.price?.toLocaleString() || "0"}
                                                                </Text>
                                                            </View>
                                                        </Pressable>
                                                    ))
                                                ) : (
                                                    <View className="p-4 items-center">
                                                        <Text className="text-gray-500">
                                                            No services match "{serviceSearchQuery}"
                                                        </Text>
                                                    </View>
                                                )}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Location Selection */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Location *
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowLocationPicker(!showLocationPicker)}
                                        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white"
                                    >
                                        <Text
                                            className={formData.location ? "text-gray-900" : "text-gray-400"}
                                            numberOfLines={1}
                                            style={{ flex: 1 }}
                                        >
                                            {formData.location || "Select location"}
                                        </Text>
                                        <ChevronDown size={20} color="#6B7280" />
                                    </Pressable>
                                    {showLocationPicker && (
                                        <View className="border border-gray-200 rounded-lg mt-2 bg-white max-h-80">
                                            <ScrollView nestedScrollEnabled>
                                                {zimbabweLocations.map((location, index) => {
                                                    const isDisabled = location !== "Mutare";
                                                    return (
                                                        <Pressable
                                                            key={index}
                                                            onPress={() => {
                                                                if (!isDisabled) {
                                                                    setFormData({ ...formData, location });
                                                                    setShowLocationPicker(false);
                                                                }
                                                            }}
                                                            className="p-3 border-b border-gray-100"
                                                            style={{ opacity: isDisabled ? 0.5 : 1 }}
                                                        >
                                                            <View className="flex-row items-center justify-between">
                                                                <Text className="text-gray-900">{location}</Text>
                                                                {isDisabled && (
                                                                    <Text className="text-xs text-gray-400 italic">
                                                                        Coming Soon
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </Pressable>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Project Price */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Project Price {formData.serviceId ? "(Auto-filled from service)" : "(Optional)"}
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        placeholder="e.g., 1250.00"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="decimal-pad"
                                        value={formData.price}
                                        onChangeText={(text) => setFormData({ ...formData, price: text })}
                                    />
                                    <Text className="text-xs text-gray-500 mt-1">
                                        {formData.serviceId
                                            ? "Price auto-filled from selected service. You can adjust if needed."
                                            : "Agreed upon price in USD"}
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
                                        Project Details (Optional)
                                    </Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        placeholder="Describe what you need for this project..."
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
                                                Your project request will be reviewed by our team
                                            </Text>
                                        </View>
                                        <View className="flex-row items-start">
                                            <Text className="text-blue-800 mr-2">•</Text>
                                            <Text className="text-sm text-blue-800 flex-1">
                                                We'll contact you to confirm details and schedule the work
                                            </Text>
                                        </View>
                                        <View className="flex-row items-start">
                                            <Text className="text-blue-800 mr-2">•</Text>
                                            <Text className="text-sm text-blue-800 flex-1">
                                                You can track progress from the home page once approved
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
                                                Create Project
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
