"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Award, Users, Zap, Shield } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const teamMembers = [
    {
        name: "Tapiwa Moyo",
        role: "Founder & CEO",
        image: "https://picsum.photos/seed/tapiwa/400/400",
        bio: "15+ years in solar and electrical engineering",
    },
    {
        name: "Rumbidzai Chikwanha",
        role: "Operations Manager",
        image: "https://picsum.photos/seed/rumbi/400/400",
        bio: "Expert in project delivery and customer success",
    },
    {
        name: "Tendai Mutasa",
        role: "Lead Solar Engineer",
        image: "https://picsum.photos/seed/tendai/400/400",
        bio: "Certified solar installer with 200+ installations",
    },
    {
        name: "Farai Ndlovu",
        role: "CCTV & Security Specialist",
        image: "https://picsum.photos/seed/farai/400/400",
        bio: "Security systems expert for commercial clients",
    },
    {
        name: "Nyasha Zimuto",
        role: "Electrical Technician",
        image: "https://picsum.photos/seed/nyasha/400/400",
        bio: "Licensed electrician with industrial experience",
    },
    {
        name: "Chiedza Makoni",
        role: "Customer Relations",
        image: "https://picsum.photos/seed/chiedza/400/400",
        bio: "Dedicated to ensuring client satisfaction",
    },
];

const stats = [
    { label: "Projects Completed", value: "500+", icon: Zap },
    { label: "Happy Clients", value: "350+", icon: Users },
    { label: "Years Experience", value: "15+", icon: Award },
    { label: "Warranty Support", value: "24/7", icon: Shield },
];

const values = [
    {
        title: "Quality First",
        description: "We use only premium equipment and materials, ensuring long-lasting installations that stand the test of time.",
    },
    {
        title: "Customer Focus",
        description: "Your satisfaction is our priority. We work closely with you to understand and exceed your expectations.",
    },
    {
        title: "Innovation",
        description: "We stay ahead of industry trends, bringing you the latest and most efficient solutions available.",
    },
    {
        title: "Integrity",
        description: "Honest pricing, transparent communication, and ethical business practices guide everything we do.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-16 md:py-24" style={{ backgroundColor: TROJAN_NAVY }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About Trojan Projects
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Zimbabwe's trusted partner for solar, electrical, and security solutions since 2009.
                        We power homes and businesses with reliable, sustainable energy systems.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 -mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="bg-white rounded-2xl p-6 shadow-lg text-center"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                                        style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                    >
                                        <Icon size={24} style={{ color: TROJAN_GOLD }} />
                                    </div>
                                    <p
                                        className="text-3xl font-bold mb-1"
                                        style={{ color: TROJAN_NAVY }}
                                    >
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2
                                className="text-3xl font-bold mb-6"
                                style={{ color: TROJAN_NAVY }}
                            >
                                Our Story
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Trojan Projects was founded in 2009 with a simple mission: to provide Zimbabweans with
                                reliable, affordable energy solutions. What started as a small solar installation
                                company has grown into one of the country's most trusted names in electrical and
                                security services.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Over the years, we've expanded our offerings to include CCTV systems, water solutions,
                                and welding services—all while maintaining our commitment to quality and customer
                                satisfaction.
                            </p>
                            <p className="text-gray-600">
                                Today, we serve hundreds of residential and commercial clients across Zimbabwe,
                                delivering solutions that power their lives and protect their investments.
                            </p>
                        </div>
                        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                            <Image
                                src="https://picsum.photos/seed/trojanoffice/800/600"
                                alt="Trojan Projects Office"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className="text-3xl font-bold text-center mb-12"
                        style={{ color: TROJAN_NAVY }}
                    >
                        Our Values
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={value.title}
                                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                <div
                                    className="w-10 h-10 rounded-full mb-4 flex items-center justify-center text-lg font-bold text-white"
                                    style={{ backgroundColor: TROJAN_GOLD }}
                                >
                                    {index + 1}
                                </div>
                                <h3
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: TROJAN_NAVY }}
                                >
                                    {value.title}
                                </h3>
                                <p className="text-sm text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className="text-3xl font-bold text-center mb-4"
                        style={{ color: TROJAN_NAVY }}
                    >
                        Meet Our Team
                    </h2>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                        Our dedicated professionals bring years of experience and passion to every project.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-64">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3
                                        className="text-lg font-semibold"
                                        style={{ color: TROJAN_NAVY }}
                                    >
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-sm font-medium mb-2"
                                        style={{ color: TROJAN_GOLD }}
                                    >
                                        {member.role}
                                    </p>
                                    <p className="text-sm text-gray-500">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className="text-3xl font-bold text-center mb-12"
                        style={{ color: TROJAN_NAVY }}
                    >
                        Visit Us
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                >
                                    <MapPin size={24} style={{ color: TROJAN_GOLD }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Address</h3>
                                    <p className="text-gray-600">
                                        123 Main Street, Harare<br />
                                        Zimbabwe
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                >
                                    <Phone size={24} style={{ color: TROJAN_GOLD }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+263 77 123 4567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                >
                                    <Mail size={24} style={{ color: TROJAN_GOLD }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">info@trojanprojects.co.zw</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                >
                                    <Clock size={24} style={{ color: TROJAN_GOLD }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                                    <p className="text-gray-600">
                                        Monday - Friday: 8:00 AM - 5:00 PM<br />
                                        Saturday: 9:00 AM - 1:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-80 md:h-full min-h-[300px] rounded-2xl overflow-hidden bg-gray-200">
                            <Image
                                src="https://picsum.photos/seed/trojanmap/800/600"
                                alt="Location Map"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div
                                    className="bg-white rounded-xl p-4 shadow-lg text-center"
                                >
                                    <MapPin size={32} style={{ color: TROJAN_GOLD }} className="mx-auto mb-2" />
                                    <p className="font-semibold" style={{ color: TROJAN_NAVY }}>
                                        Trojan Projects
                                    </p>
                                    <p className="text-sm text-gray-500">Harare, Zimbabwe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
