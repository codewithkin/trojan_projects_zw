import { useState } from "react";
import { ScrollView, View, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Plus, Clock, CheckCircle2, XCircle, FileText, DollarSign, Calendar, X, ChevronDown } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type QuoteStatus = "pending" | "approved" | "rejected";

interface Quote {
    id: string;
    service: string;
    description: string;
    estimatedPrice: string;
    status: QuoteStatus;
    requestDate: string;
    responseDate?: string;
}

const userQuotes: Quote[] = [
    {
        id: "1",
        service: "3.5 KVA Solar System",
        description: "Complete solar installation for 3-bedroom house",
        estimatedPrice: "US$1,800 - US$2,200",
        status: "pending",
        requestDate: "Dec 18, 2024",
    },
    {
        id: "2",
        service: "CCTV 4-Camera System",
        description: "Office security surveillance with night vision",
        estimatedPrice: "US$580",
        status: "approved",
        requestDate: "Dec 10, 2024",
        responseDate: "Dec 12, 2024",
    },
    {
        id: "3",
        service: "Electrical Wiring",
        description: "Full house rewiring for old property",
        estimatedPrice: "US$950",
        status: "rejected",
        requestDate: "Dec 5, 2024",
        responseDate: "Dec 6, 2024",
    },
];

const statusFilters: { label: string; value: QuoteStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const serviceOptions = [
    "Solar Power System",
    "CCTV & Security",
    "Electrical Installation",
    "Borehole Drilling",
    "Water Pump System",
    "Welding & Fabrication",
    "Other",
];

const getStatusConfig = (status: QuoteStatus) => {
    switch (status) {
        case "approved":
            return { icon: CheckCircle2, color: "#16A34A", bg: "#DCFCE7", label: "Approved" };
        case "pending":
            return { icon: Clock, color: "#CA8A04", bg: "#FEF9C3", label: "Pending" };
        case "rejected":
            return { icon: XCircle, color: "#DC2626", bg: "#FEE2E2", label: "Rejected" };
    }
};

export default function Quotes() {
    const [selectedFilter, setSelectedFilter] = useState<QuoteStatus | "all">("all");
    const [showModal, setShowModal] = useState(false);
    const [showServicePicker, setShowServicePicker] = useState(false);
    const [newQuote, setNewQuote] = useState({
        service: "",
        description: "",
        location: "",
        phone: "",
    });

    const filteredQuotes = userQuotes.filter((quote) => {
        if (selectedFilter === "all") return true;
        return quote.status === selectedFilter;
    });

    const handleSubmitQuote = () => {
        console.log("Submit quote:", newQuote);
        setShowModal(false);
        setNewQuote({ service: "", description: "", location: "", phone: "" });
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="p-4 flex-row items-center justify-between">
                    <View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Quotes
                        </Text>
                        <Text className="text-gray-500 mt-1">
                            Manage your quote requests
                        </Text>
                    </View>
                    <Button
                        className="rounded-full"
                        style={{ backgroundColor: TROJAN_GOLD }}
                        onPress={() => setShowModal(true)}
                    >
                        <View className="flex-row items-center">
                            <Plus size={18} color={TROJAN_NAVY} />
                            <Text className="font-semibold ml-1" style={{ color: TROJAN_NAVY }}>
                                New
                            </Text>
                        </View>
                    </Button>
                </View>

                {/* Stats Cards */}
                <View className="px-4 flex-row gap-3 mb-4">
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <View className="flex-row items-center mb-2">
                            <FileText size={18} color="#6B7280" />
                            <Text className="text-gray-500 ml-2 text-sm">Total</Text>
                        </View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {userQuotes.length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <View className="flex-row items-center mb-2">
                            <Clock size={18} color="#CA8A04" />
                            <Text className="text-gray-500 ml-2 text-sm">Pending</Text>
                        </View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {userQuotes.filter((q) => q.status === "pending").length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <View className="flex-row items-center mb-2">
                            <CheckCircle2 size={18} color="#16A34A" />
                            <Text className="text-gray-500 ml-2 text-sm">Approved</Text>
                        </View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {userQuotes.filter((q) => q.status === "approved").length}
                        </Text>
                    </View>
                </View>

                {/* Filter Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-4 mb-4"
                >
                    {statusFilters.map((filter) => (
                        <Pressable
                            key={filter.value}
                            onPress={() => setSelectedFilter(filter.value)}
                            className={`mr-2 px-4 py-2 rounded-full border ${selectedFilter === filter.value
                                    ? "border-transparent"
                                    : "border-gray-200 bg-white"
                                }`}
                            style={
                                selectedFilter === filter.value
                                    ? { backgroundColor: TROJAN_NAVY }
                                    : {}
                            }
                        >
                            <Text
                                className={`text-sm font-medium ${selectedFilter === filter.value ? "text-white" : "text-gray-600"
                                    }`}
                            >
                                {filter.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Quotes List */}
                <View className="px-4 pb-8">
                    {filteredQuotes.map((quote) => {
                        const statusConfig = getStatusConfig(quote.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <Card key={quote.id} className="bg-white mb-3">
                                <CardContent className="p-4">
                                    {/* Header */}
                                    <View className="flex-row items-start justify-between mb-3">
                                        <View className="flex-1">
                                            <Text className="text-base font-semibold text-gray-900">
                                                {quote.service}
                                            </Text>
                                            <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                                                {quote.description}
                                            </Text>
                                        </View>
                                        <View
                                            className="flex-row items-center px-2 py-1 rounded-full ml-2"
                                            style={{ backgroundColor: statusConfig.bg }}
                                        >
                                            <StatusIcon size={12} color={statusConfig.color} />
                                            <Text
                                                className="text-xs font-medium ml-1"
                                                style={{ color: statusConfig.color }}
                                            >
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Details */}
                                    <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
                                        <View className="flex-row items-center">
                                            <DollarSign size={16} color="#6B7280" />
                                            <Text className="text-sm font-medium text-gray-700 ml-1">
                                                {quote.estimatedPrice}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Calendar size={14} color="#9CA3AF" />
                                            <Text className="text-xs text-gray-500 ml-1">
                                                {quote.requestDate}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Action */}
                                    {quote.status === "approved" && (
                                        <Button
                                            className="w-full mt-2"
                                            style={{ backgroundColor: TROJAN_GOLD }}
                                        >
                                            <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                                Start Project
                                            </Text>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Empty State */}
                    {filteredQuotes.length === 0 && (
                        <View className="items-center justify-center py-16">
                            <Text className="text-5xl mb-3">📄</Text>
                            <Text className="text-lg font-medium text-gray-900">No quotes found</Text>
                            <Text className="text-gray-500 mt-1 text-center">
                                {selectedFilter === "all"
                                    ? "Request a quote to get started"
                                    : "No quotes with this status"}
                            </Text>
                            <Button
                                className="mt-4"
                                style={{ backgroundColor: TROJAN_GOLD }}
                                onPress={() => setShowModal(true)}
                            >
                                <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                    Request Quote
                                </Text>
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* New Quote Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <Pressable
                        className="flex-1 bg-black/50"
                        onPress={() => setShowModal(false)}
                    />
                    <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: "80%" }}>
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
                                Request a Quote
                            </Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <X size={24} color="#6B7280" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Service Select */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Service Type *
                                </Text>
                                <Pressable
                                    onPress={() => setShowServicePicker(!showServicePicker)}
                                    className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
                                >
                                    <Text className={newQuote.service ? "text-gray-900" : "text-gray-400"}>
                                        {newQuote.service || "Select a service"}
                                    </Text>
                                    <ChevronDown size={20} color="#6B7280" />
                                </Pressable>
                                {showServicePicker && (
                                    <View className="border border-gray-200 rounded-lg mt-2 bg-white">
                                        {serviceOptions.map((service) => (
                                            <Pressable
                                                key={service}
                                                onPress={() => {
                                                    setNewQuote({ ...newQuote, service });
                                                    setShowServicePicker(false);
                                                }}
                                                className="p-3 border-b border-gray-100"
                                            >
                                                <Text className="text-gray-900">{service}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Description */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Project Description *
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900"
                                    placeholder="Describe your project requirements..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={newQuote.description}
                                    onChangeText={(text) => setNewQuote({ ...newQuote, description: text })}
                                    style={{ minHeight: 100 }}
                                />
                            </View>

                            {/* Location */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900"
                                    placeholder="e.g., Borrowdale, Harare"
                                    placeholderTextColor="#9CA3AF"
                                    value={newQuote.location}
                                    onChangeText={(text) => setNewQuote({ ...newQuote, location: text })}
                                />
                            </View>

                            {/* Phone */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900"
                                    placeholder="+263 77 123 4567"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    value={newQuote.phone}
                                    onChangeText={(text) => setNewQuote({ ...newQuote, phone: text })}
                                />
                            </View>

                            {/* Submit Button */}
                            <Button
                                className="w-full mb-4"
                                style={{ backgroundColor: TROJAN_GOLD }}
                                onPress={handleSubmitQuote}
                            >
                                <Text className="font-semibold text-base" style={{ color: TROJAN_NAVY }}>
                                    Submit Quote Request
                                </Text>
                            </Button>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
