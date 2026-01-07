import { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Pressable, RefreshControl, ActivityIndicator, Alert, SafeAreaView, StatusBar, Platform } from "react-native";
import { Plus, Clock, CheckCircle2, XCircle, FileText, DollarSign, Calendar, ArrowRight, File } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@trojan_projects_zw/env/native";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type QuoteStatus = "pending" | "approved" | "rejected";

interface Quote {
    id: string;
    status: QuoteStatus;
    location: string;
    notes: string | null;
    estimatedPrice: number | null;
    staffNotes: string | null;
    service: {
        id: string;
        name: string;
        slug: string;
        category: string;
        images: string[];
    };
    hasProject: boolean;
    project: {
        id: string;
        status: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

const statusFilters: { label: string; value: QuoteStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
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
    const router = useRouter();
    const { user, isAuthenticated, requireAuth } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState<QuoteStatus | "all">("all");
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [promotingId, setPromotingId] = useState<string | null>(null);

    const isStaff = (user as { role?: string } | undefined)?.role === "staff" || (user as { role?: string } | undefined)?.role === "support";

    const fetchQuotes = useCallback(async () => {
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/quotes`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.quotes) {
                setQuotes(data.quotes);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchQuotes();
            setLoading(false);
        };
        loadData();
    }, [fetchQuotes]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchQuotes();
        setRefreshing(false);
    };

    const filteredQuotes = quotes.filter((quote) => {
        if (selectedFilter === "all") return true;
        return quote.status === selectedFilter;
    });

    const handlePromoteToProject = async (quoteId: string) => {
        setPromotingId(quoteId);
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/quotes/${quoteId}/promote`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Quote promoted to project successfully!");
                await fetchQuotes();
                // Navigate to projects tab
                router.push("/(tabs)/projects");
            } else {
                Alert.alert("Error", data.error || "Failed to promote quote");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to promote quote. Please try again.");
        } finally {
            setPromotingId(null);
        }
    };

    const handleStaffAction = async (quoteId: string, action: "approved" | "rejected", estimatedPrice?: number) => {
        try {
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/quotes/${quoteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    status: action,
                    estimatedPrice: estimatedPrice || null,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", `Quote ${action} successfully!`);
                await fetchQuotes();
            } else {
                Alert.alert("Error", data.error || "Failed to update quote");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update quote. Please try again.");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
                <ActivityIndicator size="large" color={TROJAN_GOLD} />
            </View>
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
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={TROJAN_GOLD} />
                }
            >
                {/* Header */}
                <View className="p-4 flex-row items-center justify-between">
                    <View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Quotes
                        </Text>
                        <Text className="text-gray-500 mt-1">
                            {isStaff ? "Manage quote requests" : "Your quote requests"}
                        </Text>
                    </View>
                    {!isStaff && (
                        <Button
                            className="rounded-full"
                            style={{ backgroundColor: TROJAN_GOLD }}
                            onPress={async () => {
                                const authed = await requireAuth("Sign in to request a quote");
                                if (authed) router.push("/new/quote");
                            }}
                        >
                            <View className="flex-row items-center">
                                <Plus size={18} color={TROJAN_NAVY} />
                                <Text className="font-semibold ml-1" style={{ color: TROJAN_NAVY }}>
                                    New
                                </Text>
                            </View>
                        </Button>
                    )}
                </View>

                {/* Stats Cards */}
                <View className="px-4 flex-row gap-3 mb-4">
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <View className="flex-row items-center mb-2">
                            <FileText size={18} color="#6B7280" />
                            <Text className="text-gray-500 ml-2 text-sm">Total</Text>
                        </View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {quotes.length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <View className="flex-row items-center mb-2">
                            <Clock size={18} color="#CA8A04" />
                            <Text className="text-gray-500 ml-2 text-sm">Pending</Text>
                        </View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {quotes.filter((q) => q.status === "pending").length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                        <View className="flex-row items-center mb-2">
                            <CheckCircle2 size={18} color="#16A34A" />
                            <Text className="text-gray-500 ml-2 text-sm">Approved</Text>
                        </View>
                        <Text className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            {quotes.filter((q) => q.status === "approved").length}
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
                                                {quote.service.name}
                                            </Text>
                                            <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                                                {quote.notes || quote.location}
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
                                                {quote.estimatedPrice
                                                    ? `US$${quote.estimatedPrice.toFixed(2)}`
                                                    : "Awaiting quote"}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Calendar size={14} color="#9CA3AF" />
                                            <Text className="text-xs text-gray-500 ml-1">
                                                {formatDate(quote.createdAt)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Action Buttons */}
                                    {quote.status === "pending" && !isStaff && (
                                        <Button
                                            className="w-full mt-2"
                                            disabled
                                            style={{ backgroundColor: "#E5E7EB" }}
                                        >
                                            <View className="flex-row items-center">
                                                <Clock size={16} color="#9CA3AF" />
                                                <Text className="font-semibold ml-2" style={{ color: "#9CA3AF" }}>
                                                    Waiting for approval
                                                </Text>
                                            </View>
                                        </Button>
                                    )}

                                    {quote.status === "pending" && isStaff && (
                                        <View className="flex-row gap-2 mt-2">
                                            <Button
                                                className="flex-1"
                                                style={{ backgroundColor: "#16A34A" }}
                                                onPress={() => {
                                                    Alert.alert(
                                                        "Approve Quote",
                                                        "Are you sure you want to approve this quote?",
                                                        [
                                                            { text: "Cancel", style: "cancel" },
                                                            {
                                                                text: "Approve",
                                                                onPress: () => handleStaffAction(quote.id, "approved"),
                                                            },
                                                        ]
                                                    );
                                                }}
                                            >
                                                <Text className="font-semibold text-white">Approve</Text>
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                style={{ backgroundColor: "#DC2626" }}
                                                onPress={() => handleStaffAction(quote.id, "rejected")}
                                            >
                                                <Text className="font-semibold text-white">Reject</Text>
                                            </Button>
                                        </View>
                                    )}

                                    {quote.status === "approved" && !quote.hasProject && !isStaff && (
                                        <Button
                                            className="w-full mt-2"
                                            style={{ backgroundColor: TROJAN_GOLD }}
                                            onPress={() => handlePromoteToProject(quote.id)}
                                            disabled={promotingId === quote.id}
                                        >
                                            <View className="flex-row items-center">
                                                {promotingId === quote.id ? (
                                                    <ActivityIndicator size="small" color={TROJAN_NAVY} />
                                                ) : (
                                                    <>
                                                        <ArrowRight size={16} color={TROJAN_NAVY} />
                                                        <Text className="font-semibold ml-2" style={{ color: TROJAN_NAVY }}>
                                                            Start Project
                                                        </Text>
                                                    </>
                                                )}
                                            </View>
                                        </Button>
                                    )}

                                    {quote.status === "approved" && quote.hasProject && (
                                        <Button
                                            className="w-full mt-2"
                                            style={{ backgroundColor: `${TROJAN_NAVY}10` }}
                                            onPress={() => router.push("/(tabs)/projects")}
                                        >
                                            <View className="flex-row items-center">
                                                <CheckCircle2 size={16} color={TROJAN_NAVY} />
                                                <Text className="font-semibold ml-2" style={{ color: TROJAN_NAVY }}>
                                                    View Project
                                                </Text>
                                            </View>
                                        </Button>
                                    )}

                                    {quote.status === "rejected" && (
                                        <View className="mt-2 p-3 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                            <Text className="text-sm text-red-700">
                                                {quote.staffNotes || "This quote was not approved."}
                                            </Text>
                                        </View>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Empty State */}
                    {filteredQuotes.length === 0 && (
                        <View className="items-center justify-center py-16">
                            <File size={64} color={TROJAN_NAVY} style={{ marginBottom: 12 }} />
                            <Text className="text-lg font-medium text-gray-900">No quotes found</Text>
                            <Text className="text-gray-500 mt-1 text-center">
                                {selectedFilter === "all"
                                    ? "Request a quote to get started"
                                    : "No quotes with this status"}
                            </Text>
                            <Button
                                className="mt-4"
                                style={{ backgroundColor: TROJAN_GOLD }}
                                onPress={async () => {
                                    const authed = await requireAuth("Sign in to request a quote");
                                    if (authed) router.push("/new/quote");
                                }}
                            >
                                <Text className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                    Request Quote
                                </Text>
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
