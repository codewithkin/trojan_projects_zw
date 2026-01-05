import { useState } from "react";
import { ScrollView, View, TextInput, Pressable, SafeAreaView, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { ServiceCard } from "@/components/service-card";
import { StatsSection } from "@/components/stats-section";
import { services, categoryConfig, type ServiceCategory } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const categories: (ServiceCategory | "all")[] = ["all", "solar", "cctv", "electrical", "water", "welding"];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredServices = services.filter((s) => s.featured);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 16, backgroundColor: TROJAN_NAVY }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
                Trojan Projects
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 2 }}>
                Quality installations you can trust
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/profile")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: TROJAN_GOLD,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person" size={22} color={TROJAN_NAVY} />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 12,
              paddingHorizontal: 14,
              height: 48,
            }}
          >
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search services..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 15,
                color: TROJAN_NAVY,
              }}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={{ padding: 16 }}>
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
          {selectedCategory === "all" && searchQuery === "" && featuredServices.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    width: 6,
                    height: 20,
                    backgroundColor: TROJAN_GOLD,
                    borderRadius: 3,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 18, fontWeight: "700", color: TROJAN_NAVY }}>
                  Featured Services
                </Text>
              </View>
              {featuredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => console.log("Navigate to service:", service.id)}
                />
              ))}
            </View>
          )}

          {/* All Services Section */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 6,
                  height: 20,
                  backgroundColor: TROJAN_GOLD,
                  borderRadius: 3,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 18, fontWeight: "700", color: TROJAN_NAVY }}>
                {selectedCategory === "all"
                  ? (searchQuery ? "Search Results" : "All Services")
                  : categoryConfig[selectedCategory].label
                }
              </Text>
              <Text style={{ marginLeft: 8, color: "#9CA3AF", fontSize: 14 }}>
                ({filteredServices.length})
              </Text>
            </View>

            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => console.log("Navigate to service:", service.id)}
                />
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 40, backgroundColor: "white", borderRadius: 16 }}>
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text style={{ fontSize: 16, fontWeight: "600", color: TROJAN_NAVY, marginTop: 12 }}>
                  No services found
                </Text>
                <Text style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4, textAlign: "center" }}>
                  Try adjusting your search or category filter
                </Text>
                <Pressable
                  onPress={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  style={{
                    marginTop: 16,
                    backgroundColor: TROJAN_GOLD,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: TROJAN_NAVY, fontWeight: "600" }}>
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
              padding: 20,
              backgroundColor: TROJAN_NAVY,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              Need a Custom Quote?
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4, marginBottom: 16 }}>
              Contact us for personalized solutions tailored to your needs.
            </Text>
            <Pressable
              style={{
                backgroundColor: TROJAN_GOLD,
                paddingVertical: 12,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: TROJAN_NAVY, fontWeight: "700", fontSize: 15 }}>
                Request Quote
              </Text>
            </Pressable>
          </View>

          {/* Stats Section */}
          <StatsSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

