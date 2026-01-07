// Service categories offered by Trojan Projects
export type ServiceCategory = "solar" | "cctv" | "electrical" | "water" | "welding";

// Project status for tracking user requests
export type ProjectStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface Service {
    id: string;
    name: string;
    price: number;
    priceRange: string;
    description: string;
    category: ServiceCategory;
    specifications?: {
        inverter?: string;
        battery?: string;
        panels?: string;
        protectionKit?: boolean;
    };
    supports: string[];
    brands: string[];
    images: string[];
    featured?: boolean;
    rating?: number;
    reviewCount?: number;
}

export interface UserProject {
    id: string;
    serviceId: string;
    serviceName: string;
    serviceImage: string;
    status: ProjectStatus;
    requestDate: string;
    estimatedArrival?: string;
    completionDate?: string;
    location: string;
    notes?: string;
    price: number;
    technician?: {
        name: string;
        phone: string;
    };
}

// Category display configuration
export const categoryConfig: Record<ServiceCategory, { label: string; color: string; icon: string }> = {
    solar: { label: "Solar", color: "#F59E0B", icon: "sunny" },
    cctv: { label: "CCTV", color: "#3B82F6", icon: "videocam" },
    electrical: { label: "Electrical", color: "#EF4444", icon: "flash" },
    water: { label: "Borehole", color: "#06B6D4", icon: "water" },
    welding: { label: "Welding", color: "#6B7280", icon: "construct" },
};

// Status display configuration
export const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string; icon: string }> = {
    pending: { label: "Pending", color: "#CA8A04", bgColor: "#FEF3C7", icon: "time-outline" },
    confirmed: { label: "Confirmed", color: "#2563EB", bgColor: "#DBEAFE", icon: "checkmark-circle-outline" },
    "in-progress": { label: "In Progress", color: "#7C3AED", bgColor: "#EDE9FE", icon: "car-outline" },
    completed: { label: "Completed", color: "#16A34A", bgColor: "#DCFCE7", icon: "checkmark-done-outline" },
    cancelled: { label: "Cancelled", color: "#DC2626", bgColor: "#FEE2E2", icon: "close-circle-outline" },
};

// Mock services data
export const services: Service[] = [
    {
        id: "10kva-solar-system",
        name: "10 KVA Solar System",
        price: 3950,
        priceRange: "$3,900 - $4,800",
        description: "Full-power 10 KVA system for large homes & businesses. Depending on Brand, Number of Panels and Batteries.",
        category: "solar",
        specifications: {
            inverter: "5 KVA Hybrid Inverter (x2 or equivalent configuration)",
            battery: "48V / 200Ah Lithium Battery (1)",
            panels: "450W Solar Panels (10)",
            protectionKit: true,
        },
        supports: [
            "Lights",
            "Washing machine",
            "2 refrigerators",
            "4000W incubator",
            "WiFi",
            "TV & accessories",
            "Booster pump",
            "1.5hp borehole pump",
            "Electric gate"
        ],
        brands: ["MUST", "GROWART", "SUMRY", "SAKO"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/two.jpg",
        ],
        featured: true,
        rating: 4.9,
        reviewCount: 28,
    },
    {
        id: "1.5kva-solar-system",
        name: "1.5 KVA Solar System",
        price: 750,
        priceRange: "$750 - $900",
        description: "Complete 1.5 KVA hybrid system. Price depending on number of panels and battery type.",
        category: "solar",
        specifications: {
            inverter: "1.5 KVA Hybrid Inverter",
            battery: "12.5V Lithium Battery (1)",
            panels: "400W Solar Panel (max of 2)",
            protectionKit: true,
        },
        supports: [
            "LED lights",
            "Decoder",
            "Laptops",
            "Small refrigerator",
            "TV",
            "Fans",
            "WiFi",
            "Phones",
        ],
        brands: ["Must", "Sumry"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/one.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/two.jpg"
        ],
        rating: 4.7,
        reviewCount: 45,
    },
    {
        id: "3.5kva-solar-system",
        name: "3.5 KVA Solar System",
        price: 1250,
        priceRange: "$1,250 - $1,400",
        description: "Full 3.2 KVA system suitable for home & office backup. Depending on Brand.",
        category: "solar",
        specifications: {
            inverter: "3.2 KVA Hybrid Inverter",
            battery: "24V Lithium Battery (1)",
            panels: "450W Solar Panels (4)",
            protectionKit: true,
        },
        supports: [
            "Lights",
            "Decoder",
            "Laptops",
            "Upright refrigerator",
            "Deep freezer",
            "Fans",
            "WiFi",
            "Phones",
        ],
        brands: ["Must", "Growart", "Sumry", "Code"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/two.jpg",
        ],
        featured: true,
        rating: 4.8,
        reviewCount: 32,
    },
    {
        id: "cctv-installation",
        name: "CCTV Installation",
        price: 120,
        priceRange: "$120 - $650",
        description: "HD cameras with DVR/NVR setup, night vision & remote phone viewing.",
        category: "cctv",
        supports: [
            "HD cameras",
            "DVR/NVR setup",
            "Night vision",
            "Remote phone viewing",
            "WiFi cams"
        ],
        brands: ["Hikvision", "Dahua"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/cctv-installation/one.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/cctv-installation/two.jpg",
        ],
        rating: 4.6,
        reviewCount: 18,
    },
    {
        id: "borehole-drilling",
        name: "Borehole Drilling",
        price: 1800,
        priceRange: "$1,800 - $3,500",
        description: "Professional borehole drilling with pump installation. Depth and water yield dependent.",
        category: "water",
        supports: [
            "Site survey",
            "Drilling",
            "Pump installation",
            "Water testing",
            "Tank connection"
        ],
        brands: ["Pedrollo", "DAB", "Grundfos"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
        ],
        featured: true,
        rating: 4.9,
        reviewCount: 12,
    },
    {
        id: "electrical-installation",
        name: "Electrical Installation",
        price: 200,
        priceRange: "$200 - $2,000",
        description: "Complete electrical wiring and installation for residential and commercial properties.",
        category: "electrical",
        supports: [
            "House wiring",
            "DB board installation",
            "Light fittings",
            "Power outlets",
            "Maintenance"
        ],
        brands: [],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
        ],
        rating: 4.5,
        reviewCount: 22,
    },
];

// Mock user projects data
export const userProjects: UserProject[] = [
    {
        id: "proj-001",
        serviceId: "10kva-solar-system",
        serviceName: "10 KVA Solar System",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
        status: "in-progress",
        requestDate: "2025-01-05",
        estimatedArrival: "2025-01-20",
        location: "Greendale, Harare",
        notes: "Installation scheduled for next week. Equipment delivered.",
        price: 3950,
        technician: {
            name: "Tapiwa Moyo",
            phone: "+263 77 123 4567",
        },
    },
    {
        id: "proj-002",
        serviceId: "cctv-installation",
        serviceName: "CCTV Installation - 4 Cameras",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/cctv-installation/one.jpg",
        status: "completed",
        requestDate: "2024-12-10",
        completionDate: "2024-12-15",
        location: "Borrowdale, Harare",
        price: 450,
        technician: {
            name: "Kudzi Ndlovu",
            phone: "+263 77 987 6543",
        },
    },
    {
        id: "proj-003",
        serviceId: "3.5kva-solar-system",
        serviceName: "3.5 KVA Solar System",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
        status: "pending",
        requestDate: "2025-01-10",
        location: "Mount Pleasant, Harare",
        notes: "Awaiting site survey appointment",
        price: 1350,
    },
    {
        id: "proj-004",
        serviceId: "borehole-drilling",
        serviceName: "Borehole Drilling",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
        status: "confirmed",
        requestDate: "2025-01-08",
        estimatedArrival: "2025-01-25",
        location: "Ruwa, Harare",
        notes: "Site survey completed. Drilling scheduled.",
        price: 2200,
        technician: {
            name: "Blessing Chikwanha",
            phone: "+263 77 555 1234",
        },
    },
    {
        id: "proj-005",
        serviceId: "electrical-installation",
        serviceName: "Electrical Wiring - New House",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
        status: "cancelled",
        requestDate: "2024-12-20",
        location: "Mabvuku, Harare",
        notes: "Customer cancelled - postponed to next year",
        price: 850,
    },
];
