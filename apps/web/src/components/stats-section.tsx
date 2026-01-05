import { motion } from "framer-motion";
import { Users, Briefcase, Award, TrendingUp } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const stats = [
    {
        icon: Users,
        value: "500+",
        label: "Happy Customers",
        color: "#3B82F6",
    },
    {
        icon: Briefcase,
        value: "1,200+",
        label: "Projects Completed",
        color: "#16A34A",
    },
    {
        icon: Award,
        value: "15+",
        label: "Years Experience",
        color: TROJAN_GOLD,
    },
    {
        icon: TrendingUp,
        value: "98%",
        label: "Customer Satisfaction",
        color: "#7C3AED",
    },
];

export function StatsSection() {
    return (
        <section className="py-16" style={{ backgroundColor: TROJAN_NAVY }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Trusted by Zimbabweans
                    </h2>
                    <p className="text-gray-300">
                        Delivering quality service since 2009
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <Icon size={28} style={{ color: stat.color }} />
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: TROJAN_GOLD }}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-300 text-sm lg:text-base">
                                    {stat.label}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
