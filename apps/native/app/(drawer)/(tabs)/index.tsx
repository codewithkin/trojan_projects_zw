import { useState, useMemo } from "react";
import { ScrollView, View, TextInput, Pressable, SafeAreaView, StatusBar, Platform, Dimensions, useWindowDimensions, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { ServiceCard } from "@/components/service-card";
import { StatsSection } from "@/components/stats-section";
import { ServicesGridSkeleton, ServicesListSkeleton } from "@/components/skeletons";
import { useServices } from "@/hooks/use-services";
import { categoryConfig, type ServiceCategory } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categories: (ServiceCategory | "all")[] = ["all", "solar", "cctv", "electrical", "water", "welding"];

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Fetch services from API
  const { data: services, isLoading, isError, error, refetch } = useServices();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Responsive breakpoints
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const contentPadding = isTablet ? 24 : 16;
  const gridColumns = isLargeTablet ? 3 : isTablet ? 2 : 1;

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((service) => {
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const featuredServices = useMemo(() => services?.filter((s) => s.featured) || [], [services]);

  const handleServicePress = (serviceSlug: string) => {
    router.push(`/service/${serviceSlug}`);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Search Header */}
        <View style={{ padding: contentPadding, backgroundColor: "#F9FAFB" }}>
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#D1D5DB", // gray-300
              borderRadius: isTablet ? 24 : 20,
              paddingHorizontal: isTablet ? 18 : 14,
              height: isTablet ? 56 : 48,
              maxWidth: isLargeTablet ? 800 : undefined,
              alignSelf: "center",
              width: "100%",
            }}
          >
            <Ionicons name="search" size={isTablet ? 24 : 20} color="#6B7280" />
            <TextInput
              placeholder="Search services..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: isTablet ? 17 : 15,
                color: TROJAN_NAVY,
              }}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={isTablet ? 24 : 20} color="#6B7280" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={{
          padding: contentPadding,
          maxWidth: isLargeTablet ? 1200 : undefined,
          alignSelf: "center",
          width: "100%",
        }}>
          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20, marginHorizontal: -16, paddingHorizontal: 16 }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const config = cat === "all" ? null : categoryConfig[cat];
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    marginRight: 10,
                    backgroundColor: isActive ? TROJAN_NAVY : "white",
                    borderWidth: 1,
                    borderColor: isActive ? TROJAN_NAVY : "#E5E7EB",
                  }}
                >
                  {config && (
                    <Ionicons
                      name={config.icon as any}
                      size={16}
                      color={isActive ? "white" : config.color}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text
                    style={{
                      color: isActive ? "white" : "#374151",
                      fontWeight: "600",
                      fontSize: 13,
                    }}
                  >
                    {cat === "all" ? "All Services" : config?.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Featured Section (only when "all" is selected) */}
          {selectedCategory === "all" && searchQuery === "" && !isLoading && !isError && featuredServices.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    width: 6,
                    height: isTablet ? 24 : 20,
                    backgroundColor: TROJAN_GOLD,
                    borderRadius: 3,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: isTablet ? 22 : 18, fontWeight: "700", color: TROJAN_NAVY }}>
                  Featured Services
                </Text>
              </View>
              <View style={{
                flexDirection: isTablet ? "row" : "column",
                flexWrap: "wrap",
                gap: isTablet ? 16 : 12,
              }}>
                {featuredServices.map((service) => (
                  <View key={service.id} style={{
                    width: isTablet ? `${100 / gridColumns - 2}%` : "100%",
                  }}>
                    <ServiceCard
                      service={service}
                      onPress={() => handleServicePress(service.slug)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* All Services Section */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 6,
                  height: isTablet ? 24 : 20,
                  backgroundColor: TROJAN_GOLD,
                  borderRadius: 3,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: isTablet ? 22 : 18, fontWeight: "700", color: TROJAN_NAVY }}>
                {selectedCategory === "all"
                  ? (searchQuery ? "Search Results" : "All Services")
                  : categoryConfig[selectedCategory].label
                }
              </Text>
              {!isLoading && !isError && (
                <Text style={{ marginLeft: 8, color: "#9CA3AF", fontSize: isTablet ? 16 : 14 }}>
                  ({filteredServices.length})
                </Text>
              )}
            </View>

            {/* Loading State */}
            {isLoading && (
              <View>
                {isTablet ? (
                  <ServicesGridSkeleton count={4} />
                ) : (
                  <ServicesListSkeleton count={4} />
                )}
              </View>
            )}

            {/* Error State */}
            {isError && (
              <View style={{
                alignItems: "center",
                paddingVertical: isTablet ? 60 : 40,
                backgroundColor: "white",
                borderRadius: 16
              }}>
                <Ionicons name="warning-outline" size={isTablet ? 64 : 48} color="#EF4444" />
                <Text style={{ fontSize: isTablet ? 20 : 16, fontWeight: "600", color: TROJAN_NAVY, marginTop: 12 }}>
                  Failed to load services
                </Text>
                <Text style={{ fontSize: isTablet ? 16 : 14, color: "#9CA3AF", marginTop: 4, textAlign: "center" }}>
                  {error?.message || "An error occurred"}
                </Text>
                <Pressable
                  onPress={refetch}
                  style={{
                    marginTop: 16,
                    backgroundColor: TROJAN_GOLD,
                    paddingHorizontal: isTablet ? 28 : 20,
                    paddingVertical: isTablet ? 14 : 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: TROJAN_NAVY, fontWeight: "600", fontSize: isTablet ? 16 : 14 }}>
                    Try Again
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Services List */}
            {!isLoading && !isError && filteredServices.length > 0 ? (
              <View style={{
                flexDirection: isTablet ? "row" : "column",
                flexWrap: "wrap",
                gap: isTablet ? 16 : 12,
              }}>
                {filteredServices.map((service) => (
                  <View key={service.id} style={{
                    width: isTablet ? `${100 / gridColumns - 2}%` : "100%",
                  }}>
                    <ServiceCard
                      service={service}
                      onPress={() => handleServicePress(service.slug)}
                    />
                  </View>
                ))}
              </View>
            ) : !isLoading && !isError && (
              <View style={{
                alignItems: "center",
                paddingVertical: isTablet ? 60 : 40,
                backgroundColor: "white",
                borderRadius: 16
              }}>
                <Ionicons name="search-outline" size={isTablet ? 64 : 48} color="#D1D5DB" />
                <Text style={{ fontSize: isTablet ? 20 : 16, fontWeight: "600", color: TROJAN_NAVY, marginTop: 12 }}>
                  No services found
                </Text>
                <Text style={{ fontSize: isTablet ? 16 : 14, color: "#9CA3AF", marginTop: 4, textAlign: "center" }}>
                  Try adjusting your search or category filter
                </Text>
                <Pressable
                  onPress={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  style={{
                    marginTop: 16,
                    backgroundColor: TROJAN_GOLD,
                    paddingHorizontal: isTablet ? 28 : 20,
                    paddingVertical: isTablet ? 14 : 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: TROJAN_NAVY, fontWeight: "600", fontSize: isTablet ? 16 : 14 }}>
                    Clear Filters
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* CTA Section */}
          <View
            style={{
              marginTop: 24,
              marginBottom: 32,
              padding: isTablet ? 28 : 20,
              backgroundColor: TROJAN_NAVY,
              borderRadius: isTablet ? 24 : 20,
              flexDirection: isLargeTablet ? "row" : "column",
              alignItems: isLargeTablet ? "center" : "stretch",
              justifyContent: isLargeTablet ? "space-between" : "flex-start",
            }}
          >
            <View style={{ flex: isLargeTablet ? 1 : undefined, marginBottom: isLargeTablet ? 0 : 16 }}>
              <Text style={{ color: "white", fontSize: isTablet ? 22 : 18, fontWeight: "700" }}>
                Need a Custom Quote?
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: isTablet ? 16 : 14, marginTop: 4 }}>
                Contact us for personalized solutions tailored to your needs.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/quotes")}
              style={{
                backgroundColor: TROJAN_GOLD,
                paddingVertical: isTablet ? 16 : 12,
                paddingHorizontal: isLargeTablet ? 32 : undefined,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: TROJAN_NAVY, fontWeight: "700", fontSize: isTablet ? 17 : 15 }}>
                Request Quote
              </Text>
            </Pressable>
          </View>

          {/* Stats Section */}
          <StatsSection />
        </View>
      </ScrollView>

      {/* Floating Action Button for New Project Request */}
      <Pressable
        onPress={() => router.push("/projects/new")}
        style={{
          position: "absolute",
          bottom: isTablet ? 32 : 24,
          right: isTablet ? 32 : 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: TROJAN_GOLD,
          width: isTablet ? 160 : 56,
          height: 56,
          borderRadius: isTablet ? 28 : 28,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={isTablet ? 26 : 24} color={TROJAN_NAVY} />
        {isTablet && (
          <Text style={{ marginLeft: 8, color: TROJAN_NAVY, fontWeight: "700", fontSize: 16 }}>
            New Project
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

