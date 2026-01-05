"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ServiceTag {
    id: string;
    name: string;
    icon: string;
}

const serviceTags: ServiceTag[] = [
    { id: "solar", name: "Solar Installation", icon: "Sun" },
    { id: "cctv", name: "CCTV & Security", icon: "Camera" },
    { id: "electrical", name: "Electrical Work", icon: "Zap" },
    { id: "water", name: "Water Systems", icon: "Droplet" },
    { id: "welding", name: "Welding Services", icon: "Flame" },
    { id: "borehole", name: "Borehole Drilling", icon: "Drill" },
    { id: "plumbing", name: "Plumbing", icon: "Wrench" },
    { id: "aircon", name: "Air Conditioning", icon: "Wind" },
    { id: "gate", name: "Gate Automation", icon: "DoorOpen" },
    { id: "maintenance", name: "Maintenance", icon: "Settings" },
    { id: "other", name: "Something Else", icon: "MoreHorizontal" },
];

const zimbabweLocations = [
    "Harare",
    "Bulawayo",
    "Mutare",
    "Gweru",
    "Kwekwe",
    "Kadoma",
    "Masvingo",
    "Chinhoyi",
    "Norton",
    "Marondera",
    "Ruwa",
    "Chitungwiza",
    "Bindura",
    "Beitbridge",
    "Redcliff",
    "Victoria Falls",
    "Hwange",
    "Chegutu",
    "Kariba",
    "Karoi",
    "Other",
];

export default function UserOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    const toggleInterest = (tagId: string) => {
        setSelectedInterests((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleNext = () => {
        if (step === 1 && selectedInterests.length > 0) {
            setStep(2);
        }
    };

    const handleComplete = async () => {
        if (!selectedLocation) return;

        // TODO: Save preferences to API
        const preferences = {
            interests: selectedInterests,
            location: selectedLocation,
        };

        console.log("Saving preferences:", preferences);

        // Redirect to dashboard
        router.push("/dashboard");
    };

    const getIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName];
        return Icon ? <Icon size={24} /> : null;
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: "#ffffff" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl"
            >
                {/* Progress indicator */}
                <div className="flex gap-2 mb-8 justify-center">
                    <div
                        className="h-2 rounded-full transition-all"
                        style={{
                            width: step === 1 ? "48px" : "24px",
                            backgroundColor: step === 1 ? TROJAN_GOLD : "rgba(15, 27, 77, 0.2)",
                        }}
                    />
                    <div
                        className="h-2 rounded-full transition-all"
                        style={{
                            width: step === 2 ? "48px" : "24px",
                            backgroundColor: step === 2 ? TROJAN_GOLD : "rgba(15, 27, 77, 0.2)",
                        }}
                    />
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h1
                                className="text-4xl font-bold mb-3"
                                style={{ color: TROJAN_NAVY }}
                            >
                                What brings you here?
                            </h1>
                            <p className="text-slate-600">
                                Select all the services you're interested in
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {serviceTags.map((tag, index) => {
                                const isSelected = selectedInterests.includes(tag.id);
                                return (
                                    <motion.button
                                        key={tag.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => toggleInterest(tag.id)}
                                        className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:shadow-md"
                                        style={{
                                            borderColor: isSelected ? TROJAN_GOLD : "#e2e8f0",
                                            backgroundColor: isSelected
                                                ? "rgba(255, 193, 7, 0.1)"
                                                : "#ffffff",
                                            color: isSelected ? TROJAN_NAVY : "#64748b",
                                        }}
                                    >
                                        <div style={{ color: isSelected ? TROJAN_GOLD : "#64748b" }}>
                                            {getIcon(tag.icon)}
                                        </div>
                                        <span className="text-sm font-medium text-center">
                                            {tag.name}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button
                                onClick={handleNext}
                                disabled={selectedInterests.length === 0}
                                className="px-8 py-6 text-lg"
                                style={{
                                    backgroundColor:
                                        selectedInterests.length > 0 ? TROJAN_GOLD : "#d1d5db",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                Continue
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h1
                                className="text-4xl font-bold mb-3"
                                style={{ color: TROJAN_NAVY }}
                            >
                                Where are you based?
                            </h1>
                            <p className="text-slate-600">
                                Help us serve you better by letting us know your location
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                            {zimbabweLocations.map((location, index) => {
                                const isSelected = selectedLocation === location;
                                return (
                                    <motion.button
                                        key={location}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        onClick={() => setSelectedLocation(location)}
                                        className="p-3 rounded-lg border-2 transition-all hover:shadow-md"
                                        style={{
                                            borderColor: isSelected ? TROJAN_GOLD : "#e2e8f0",
                                            backgroundColor: isSelected
                                                ? "rgba(255, 193, 7, 0.1)"
                                                : "#ffffff",
                                            color: isSelected ? TROJAN_NAVY : "#64748b",
                                        }}
                                    >
                                        <span className="text-sm font-medium">{location}</span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                            <Button
                                onClick={() => setStep(1)}
                                variant="outline"
                                className="px-6 py-6"
                                style={{
                                    borderColor: TROJAN_NAVY,
                                    color: TROJAN_NAVY,
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleComplete}
                                disabled={!selectedLocation}
                                className="px-8 py-6 text-lg"
                                style={{
                                    backgroundColor: selectedLocation ? TROJAN_GOLD : "#d1d5db",
                                    color: TROJAN_NAVY,
                                }}
                            >
                                Get Started
                            </Button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
