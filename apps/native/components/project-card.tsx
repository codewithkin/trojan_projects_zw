import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProject, statusConfig } from "@/data/services";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ProjectCardProps {
    project: UserProject;
    onPress?: () => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
    const status = statusConfig[project.status];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric", 
            year: "numeric" 
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.row}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: project.serviceImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                        <Ionicons name={status.icon as any} size={12} color={status.color} />
                        <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                        </Text>
                    </View>

                    {/* Service Name */}
                    <Text style={styles.serviceName} numberOfLines={2}>
                        {project.serviceName}
                    </Text>

                    {/* Order ID */}
                    <Text style={styles.orderId}>Order #{project.id}</Text>

                    {/* Meta Info */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={12} color="#999" />
                            <Text style={styles.metaText}>{formatDate(project.requestDate)}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={12} color="#999" />
                            <Text style={styles.metaText} numberOfLines={1}>{project.location}</Text>
                        </View>
                    </View>

                    {/* ETA or Completion */}
                    {project.estimatedArrival && project.status !== "completed" && (
                        <View style={styles.etaRow}>
                            <Ionicons name="time-outline" size={14} color={TROJAN_GOLD} />
                            <Text style={styles.etaText}>
                                ETA: {formatDate(project.estimatedArrival)}
                            </Text>
                        </View>
                    )}
                    {project.completionDate && project.status === "completed" && (
                        <View style={styles.etaRow}>
                            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                            <Text style={[styles.etaText, { color: "#16A34A" }]}>
                                Completed: {formatDate(project.completionDate)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Technician Info */}
            {project.technician && (
                <View style={styles.technicianRow}>
                    <View style={styles.technicianAvatar}>
                        <Text style={styles.technicianInitial}>
                            {project.technician.name.charAt(0)}
                        </Text>
                    </View>
                    <View style={styles.technicianInfo}>
                        <Text style={styles.technicianLabel}>Technician</Text>
                        <Text style={styles.technicianName}>{project.technician.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Notes */}
            {project.notes && (
                <View style={styles.notesRow}>
                    <Ionicons name="document-text-outline" size={14} color="#666" />
                    <Text style={styles.notesText} numberOfLines={2}>
                        {project.notes}
                    </Text>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.price}>US${project.price.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
                    <Text style={styles.detailsButtonText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color={TROJAN_NAVY} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#F3F4F6",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    content: {
        flex: 1,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
        marginBottom: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },
    serviceName: {
        fontSize: 15,
        fontWeight: "700",
        color: TROJAN_NAVY,
        marginBottom: 2,
    },
    orderId: {
        fontSize: 11,
        color: "#999",
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: "row",
        gap: 12,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: "#666",
    },
    etaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 6,
    },
    etaText: {
        fontSize: 12,
        color: TROJAN_GOLD,
        fontWeight: "600",
    },
    technicianRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        gap: 10,
    },
    technicianAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: TROJAN_NAVY,
        alignItems: "center",
        justifyContent: "center",
    },
    technicianInitial: {
        color: "white",
        fontWeight: "700",
        fontSize: 14,
    },
    technicianInfo: {
        flex: 1,
    },
    technicianLabel: {
        fontSize: 10,
        color: "#999",
    },
    technicianName: {
        fontSize: 13,
        fontWeight: "600",
        color: TROJAN_NAVY,
    },
    callButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#16A34A",
        alignItems: "center",
        justifyContent: "center",
    },
    notesRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        marginTop: 12,
        padding: 10,
        backgroundColor: "#FFFBEB",
        borderRadius: 10,
    },
    notesText: {
        flex: 1,
        fontSize: 12,
        color: "#666",
        lineHeight: 18,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    priceLabel: {
        fontSize: 11,
        color: "#999",
    },
    price: {
        fontSize: 18,
        fontWeight: "700",
        color: TROJAN_NAVY,
    },
    detailsButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${TROJAN_GOLD}30`,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 4,
    },
    detailsButtonText: {
        color: TROJAN_NAVY,
        fontWeight: "600",
        fontSize: 13,
    },
});
