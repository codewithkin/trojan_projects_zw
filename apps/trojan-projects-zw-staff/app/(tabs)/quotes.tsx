import { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Pressable, RefreshControl, SafeAreaView, StatusBar, Platform, useWindowDimensions } from "react-native";
import { FileText, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { hasFullAdminAccess, getEffectiveRole } from "@/config/admins";
import { env } from "@trojan_projects_zw/env/native";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

type QuoteStatus = "pending" | "approved" | "rejected";

interface Quote {
    id: string;
    status: QuoteStatus;
    location: string;
    estimatedPrice: number | null;
    service: {
        name: string;
        category: string;
    };
    user?: {
        name: string;
        email: string;
    };
    createdAt: string;
}

const statusConfig: Record<QuoteStatus, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: "Pending", color: "#CA8A04", bg: "#FEF9C3", icon: Clock },
    approved: { label: "Approved", color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle },
    rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2", icon: XCircle },
};

export default function Quotes() {
    const router = useRouter();
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<QuoteStatus | "all">("all");

    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;
    const contentPadding = isTablet ? 24 : 16;

    const effectiveRole = getEffectiveRole(user);
    const isAdmin = hasFullAdminAccess(user);

    const fetchQuotes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/api/quotes`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.quotes) {
                setQuotes(data.quotes);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchQuotes();
        setRefreshing(false);
    };

    const filteredQuotes = quotes.filter((q) => filter === "all" || q.status === filter);

    const handleQuotePress = (quoteId: string) => {
        console.log("Open quote:", quoteId);
    };

    const totalValue = quotes
        .filter((q) => q.estimatedPrice && q.status === "approved")
        .reduce((sum, q) => sum + (q.estimatedPrice || 0), 0);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <View style={{ padding: contentPadding, backgroundColor: "white" }}>
                <Text
                    style={{
                        fontSize: isTablet ? 28 : 22,
                        fontWeight: "700",
                        color: TROJAN_NAVY,
                    }}
                >
                    {isAdmin ? "All Quotations" : effectiveRole === "staff" ? "My Quotations" : "Customer Quotations"}
                </Text>
                <Text
                    style={{
                        fontSize: isTablet ? 14 : 12,
                        color: "#6B7280",
                        marginTop: 4,
                    }}
                >
                    {isAdmin
                        ? `Total approved value: $${totalValue.toLocaleString()}`
                        : effectiveRole === "staff"
                        ? "Quotations you've created"
                        : "Generate and track quotations"}
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[TROJAN_GOLD]} />}
            >
                <View
                    style={{
                        padding: contentPadding,
                        maxWidth: isLargeTablet ? 1200 : undefined,
                        alignSelf: "center",
                        width: "100%",
                    }}
                >
                    {/* Status Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 20, marginHorizontal: -8 }}
                    >
                        <Pressable
                            onPress={() => setFilter("all")}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                marginHorizontal: 4,
                                backgroundColor: filter === "all" ? TROJAN_NAVY : "white",
                                borderWidth: 1,
                                borderColor: filter === "all" ? TROJAN_NAVY : "#E5E7EB",
                            }}
                        >
                            <Text
                                style={{
                                    color: filter === "all" ? "white" : "#374151",
                                    fontWeight: "600",
                                    fontSize: 13,
                                }}
                            >
                                All ({quotes.length})
                            </Text>
                        </Pressable>
                        {(["pending", "approved", "rejected"] as QuoteStatus[]).map((status) => (
                            <Pressable
                                key={status}
                                onPress={() => setFilter(status)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    marginHorizontal: 4,
                                    backgroundColor: filter === status ? TROJAN_NAVY : "white",
                                    borderWidth: 1,
                                    borderColor: filter === status ? TROJAN_NAVY : "#E5E7EB",
                                }}
                            >
                                <Text
                                    style={{
                                        color: filter === status ? "white" : "#374151",
                                        fontWeight: "600",
                                        fontSize: 13,
                                    }}
                                >
                                    {statusConfig[status].label} ({quotes.filter((q) => q.status === status).length})
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Quotes List */}
                    {loading ? (
                        <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>Loading quotations...</Text>
                    ) : filteredQuotes.length === 0 ? (
                        <View
                            style={{
                                backgroundColor: "white",
                                borderRadius: 16,
                                padding: 40,
                                alignItems: "center",
                            }}
                        >
                            <FileText size={48} color="#D1D5DB" />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    color: TROJAN_NAVY,
                                    marginTop: 16,
                                }}
                            >
                                No quotations found
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    marginTop: 8,
                                    textAlign: "center",
                                }}
                            >
                                {filter === "all"
                                    ? "No quotations available"
                                    : `No ${statusConfig[filter as QuoteStatus]?.label.toLowerCase()} quotations`}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
                            {filteredQuotes.map((quote) => {
                                const config = statusConfig[quote.status];
                                const IconComponent = config.icon;
                                return (
                                    <Pressable
                                        key={quote.id}
                                        onPress={() => handleQuotePress(quote.id)}
                                        style={{
                                            backgroundColor: "white",
                                            borderRadius: isTablet ? 16 : 12,
                                            padding: isTablet ? 20 : 16,
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 8,
                                            elevation: 2,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: isTablet ? 18 : 16,
                                                        fontWeight: "700",
                                                        color: TROJAN_NAVY,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {quote.service.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: isTablet ? 14 : 12,
                                                        color: "#6B7280",
                                                    }}
                                                >
                                                    {quote.location}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: config.bg,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 12,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    height: 32,
                                                }}
                                            >
                                                <IconComponent size={14} color={config.color} strokeWidth={2.5} />
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: "600",
                                                        color: config.color,
                                                    }}
                                                >
                                                    {config.label}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Role-based content */}
                                        {(isAdmin || effectiveRole === "support") && quote.user && (
                                            <View style={{ marginBottom: 8 }}>
                                                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                                                    Customer: <Text style={{ fontWeight: "600", color: TROJAN_NAVY }}>{quote.user.name}</Text>
                                                </Text>
                                                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{quote.user.email}</Text>
                                            </View>
                                        )}

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginTop: 8,
                                                paddingTop: 12,
                                                borderTopWidth: 1,
                                                borderTopColor: "#F3F4F6",
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                                                {new Date(quote.createdAt).toLocaleDateString()}
                                            </Text>
                                            {quote.estimatedPrice && (
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                                    <DollarSign size={16} color={TROJAN_GOLD} strokeWidth={2.5} />
                                                    <Text
                                                        style={{
                                                            fontSize: isTablet ? 18 : 16,
                                                            fontWeight: "700",
                                                            color: TROJAN_GOLD,
                                                        }}
                                                    >
                                                        {quote.estimatedPrice.toLocaleString()}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Admin/Support actions */}
                                        {(isAdmin || effectiveRole === "support") && quote.status === "pending" && (
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    gap: 8,
                                                    marginTop: 12,
                                                }}
                                            >
                                                <Pressable
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: "#16A34A",
                                                        paddingVertical: 10,
                                                        borderRadius: 8,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                                                        Approve
                                                    </Text>
                                                </Pressable>
                                                <Pressable
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: "#DC2626",
                                                        paddingVertical: 10,
                                                        borderRadius: 8,
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                                                        Reject
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}