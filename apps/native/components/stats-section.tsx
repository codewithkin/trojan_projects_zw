import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const stats = [
  { icon: "people", label: "Happy Customers", value: "500+", color: "#3B82F6" },
  { icon: "briefcase", label: "Projects Completed", value: "1,200+", color: "#16A34A" },
  { icon: "trophy", label: "Years Experience", value: "15+", color: "#F59E0B" },
  { icon: "trending-up", label: "Customer Satisfaction", value: "98%", color: "#7C3AED" },
];

export function StatsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Section Title */}
        <Text style={styles.title}>Why Choose Us</Text>
        <Text style={styles.subtitle}>
          Trusted by hundreds of homes and businesses across Zimbabwe
        </Text>

        {/* Stats Grid */}
        <View style={styles.grid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.value}>{stat.value}</Text>
              <Text style={styles.label}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TROJAN_NAVY,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  content: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    marginBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: TROJAN_GOLD,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "center",
  },
});
