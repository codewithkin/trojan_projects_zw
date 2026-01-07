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
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronDown, Lock, Search, X } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { env } from "@trojan_projects_zw/env/native";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Text as StyledText } from "@/components/ui/text";
import { zimbabweLocations } from "@/data/onboarding";
import { categoryConfig, type ServiceCategory } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Service categories for quick selection
const serviceCategories: { key: ServiceCategory; label: string; icon: string; color: string }[] = [
    { key: "solar", label: "Solar", icon: "sunny", color: "#F59E0B" },
    { key: "cctv", label: "CCTV", icon: "videocam", color: "#3B82F6" },
    { key: "electrical", label: "Electrical", icon: "flash", color: "#EF4444" },
    { key: "water", label: "Borehole", icon: "water", color: "#06B6D4" },
    { key: "welding", label: "Welding", icon: "construct", color: "#6B7280" },
];

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
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [serviceSearchQuery, setServiceSearchQuery] = useState("");
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

    // Filter services based on category and search
    const filteredServices = useMemo(() => {
        let result = services;

        // Filter by category if selected
        if (selectedCategory) {
            result = result.filter((s) => s.category === selectedCategory);
        }

        // Filter by search query
        if (serviceSearchQuery.trim()) {
            const query = serviceSearchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(query) ||
                    s.category.toLowerCase().includes(query)
            );
        }

        return result;
    }, [services, selectedCategory, serviceSearchQuery]);

    // Handle category selection
    const handleCategorySelect = (category: ServiceCategory) => {
        if (selectedCategory === category) {
            setSelectedCategory(null); // Deselect if same
        } else {
            setSelectedCategory(category);
            setShowServicePicker(true); // Auto-open service picker
        }
    };

    // Handle service selection
    const handleServiceSelect = (service: Service) => {
        setFormData({
            ...formData,
            serviceId: service.id,
            serviceName: service.name,
        });
        setShowServicePicker(false);
        setServiceSearchQuery("");
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
                    <View className="flex-row">
                        <Pressable
                            onPress={() => router.back()}
                            className="flex-row items-center mb-4 px-3 py-2 rounded-lg self-start"
                            style={{ backgroundColor: TROJAN_GOLD }}
                        >
                            <ArrowLeft size={20} color={TROJAN_NAVY} />
                            <Text className="ml-2 font-semibold" style={{ color: TROJAN_NAVY }}>Back</Text>
                        </Pressable>
                    </View>
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
                        <View className="mb-6">
                            <Pressable
                                onPress={() => router.back()}
                                className="flex-row items-center px-3 py-2 rounded-lg self-start"
                                style={{ backgroundColor: TROJAN_GOLD }}
                            >
                                <ArrowLeft size={20} color={TROJAN_NAVY} />
                                <Text className="ml-2 font-semibold" style={{ color: TROJAN_NAVY }}>Back</Text>
                            </Pressable>
                        </View>
                        {fetchingServices ? (
                            <View className="items-center justify-center py-12">
                                <ActivityIndicator size="large" color={TROJAN_GOLD} />
                                <Text className="text-gray-500 mt-4">Loading services...</Text>
                            </View>
                        ) : (
                            <>
                                {/* Quick Category Selection */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Quick Select by Category
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
                                    >
                                        {serviceCategories.map((cat) => {
                                            const isActive = selectedCategory === cat.key;
                                            return (
                                                <Pressable
                                                    key={cat.key}
                                                    onPress={() => handleCategorySelect(cat.key)}
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        paddingHorizontal: 14,
                                                        paddingVertical: 10,
                                                        borderRadius: 20,
                                                        marginRight: 10,
                                                        backgroundColor: isActive ? TROJAN_NAVY : "white",
                                                        borderWidth: 1,
                                                        borderColor: isActive ? TROJAN_NAVY : "#E5E7EB",
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={cat.icon as any}
                                                        size={16}
                                                        color={isActive ? "white" : cat.color}
                                                        style={{ marginRight: 6 }}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: isActive ? "white" : "#374151",
                                                            fontWeight: "600",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {cat.label}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </ScrollView>
                                </View>

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
                                                {selectedCategory && (
                                                    <View className="flex-row items-center mt-2">
                                                        <Text className="text-xs text-gray-500">
                                                            Filtered by: {categoryConfig[selectedCategory].label}
                                                        </Text>
                                                        <Pressable
                                                            onPress={() => setSelectedCategory(null)}
                                                            className="ml-2"
                                                        >
                                                            <Text className="text-xs text-blue-500">Clear</Text>
                                                        </Pressable>
                                                    </View>
                                                )}
                                            </View>
                                            <ScrollView nestedScrollEnabled style={{ maxHeight: 280 }}>
                                                {filteredServices.length > 0 ? (
                                                    filteredServices.map((service) => (
                                                        <Pressable
                                                            key={service.id}
                                                            onPress={() => handleServiceSelect(service)}
                                                            className="p-3 border-b border-gray-100"
                                                        >
                                                            <Text className="text-gray-900 font-medium">{service.name}</Text>
                                                            <Text className="text-gray-500 text-xs mt-0.5">{service.category}</Text>
                                                        </Pressable>
                                                    ))
                                                ) : (
                                                    <View className="p-4 items-center">
                                                        <Text className="text-gray-500">
                                                            {serviceSearchQuery
                                                                ? `No services match "${serviceSearchQuery}"`
                                                                : "No services available"}
                                                        </Text>
                                                    </View>
                                                )}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                {/* Location */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Project Location *
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowLocationPicker(!showLocationPicker)}
                                        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white"
                                    >
                                        <Text
                                            className={formData.location ? "text-gray-900" : "text-gray-400"}
                                        >
                                            {formData.location || "Select your location"}
                                        </Text>
                                        <ChevronDown size={20} color="#6B7280" />
                                    </Pressable>
                                    {showLocationPicker && (
                                        <View className="border border-gray-200 rounded-lg mt-2 bg-white max-h-64">
                                            <ScrollView nestedScrollEnabled>
                                                {zimbabweLocations.map((location) => {
                                                    const isDisabled = location !== "Mutare";
                                                    return (
                                                        <Pressable
                                                            key={location}
                                                            onPress={() => {
                                                                if (!isDisabled) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        location: location,
                                                                    });
                                                                    setShowLocationPicker(false);
                                                                }
                                                            }}
                                                            className="p-3 border-b border-gray-100"
                                                            style={{ opacity: isDisabled ? 0.5 : 1 }}
                                                        >
                                                            <View className="flex-row items-center justify-between">
                                                                <Text className={`font-medium ${isDisabled ? "text-gray-400" : "text-gray-900"}`}>
                                                                    {location}
                                                                </Text>
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
        </SafeAreaView>
    );
}
