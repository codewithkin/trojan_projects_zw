// Services offered by Trojan Projects
// This will be replaced with admin-created services from the database

export interface Service {
    id: string;
    name: string;
    price: string;
    priceRange: string;
    description: string;
    category: "solar" | "cctv" | "electrical" | "water" | "welding";
    specifications: {
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

export const services: Service[] = [
    {
        id: "10kva-solar-system",
        name: "10 KVA Solar System",
        price: "US$3,950.00",
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
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/three.jpg",
        ],
        featured: true,
        rating: 4.9,
        reviewCount: 24,
    },
    {
        id: "1.5kva-solar-system",
        name: "1.5 KVA Solar System",
        price: "US$750.00",
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
            "Starlink",
            "Small printer"
        ],
        brands: ["Must", "Sumry"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/one.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/two.jpg"
        ],
        rating: 4.7,
        reviewCount: 31,
    },
    {
        id: "3.5kva-solar-system",
        name: "3.5 KVA Solar System",
        price: "US$1,250.00",
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
            "Printers",
            "Other appliances"
        ],
        brands: ["Must", "Growart", "Sumry", "Code"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/two.jpg",
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/three.jpg"
        ],
        featured: true,
        rating: 4.8,
        reviewCount: 18,
    },
    {
        id: "cctv-installation",
        name: "CCTV Installation",
        price: "US$120.00",
        priceRange: "$120 - $650",
        description: "HD cameras with DVR/NVR setup, night vision & remote phone viewing. Depending on Number and Type of Cameras. WiFi cams from $30.",
        category: "cctv",
        specifications: {},
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
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/cctv-installation/three.jpg",
        ],
        rating: 4.6,
        reviewCount: 42,
    },
    {
        id: "electrical-wiring",
        name: "Electrical Wiring",
        price: "US$200.00",
        priceRange: "$200 - $2,000",
        description: "Complete electrical wiring for homes and offices. New installations and rewiring services.",
        category: "electrical",
        specifications: {},
        supports: [
            "New installations",
            "Rewiring",
            "Circuit breaker installation",
            "Fault finding",
            "Safety inspections"
        ],
        brands: [],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/electrical/one.jpg",
        ],
        rating: 4.7,
        reviewCount: 15,
    },
    {
        id: "borehole-pump",
        name: "Borehole Pump Installation",
        price: "US$350.00",
        priceRange: "$350 - $1,500",
        description: "Complete borehole pump installation including submersible pumps, pressure tanks, and piping.",
        category: "water",
        specifications: {},
        supports: [
            "Submersible pumps",
            "Pressure tanks",
            "Piping",
            "Pump repairs",
            "Water storage solutions"
        ],
        brands: ["Pedrollo", "DAB"],
        images: [
            "https://trojan-projects-zw.s3.amazonaws.com/in-house/water/one.jpg",
        ],
        rating: 4.5,
        reviewCount: 8,
    },
];

// User project requests
export type ProjectStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

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
    price: string;
    technician?: string;
}

// Mock user projects for display
export const userProjects: UserProject[] = [
    {
        id: "proj-001",
        serviceId: "3.5kva-solar-system",
        serviceName: "3.5 KVA Solar System",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
        status: "in-progress",
        requestDate: "2024-12-20",
        estimatedArrival: "2025-01-08",
        location: "Borrowdale, Harare",
        notes: "Installation scheduled for morning",
        price: "US$1,350.00",
        technician: "John M.",
    },
    {
        id: "proj-002",
        serviceId: "cctv-installation",
        serviceName: "CCTV 4-Camera System",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/cctv-installation/one.jpg",
        status: "completed",
        requestDate: "2024-12-01",
        completionDate: "2024-12-05",
        location: "Avondale, Harare",
        price: "US$480.00",
        technician: "Peter K.",
    },
    {
        id: "proj-003",
        serviceId: "10kva-solar-system",
        serviceName: "10 KVA Solar System",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
        status: "pending",
        requestDate: "2025-01-02",
        location: "Mt Pleasant, Harare",
        notes: "Awaiting site assessment",
        price: "US$4,200.00",
    },
    {
        id: "proj-004",
        serviceId: "1.5kva-solar-system",
        serviceName: "1.5 KVA Solar System",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/one.jpg",
        status: "cancelled",
        requestDate: "2024-11-15",
        location: "Greendale, Harare",
        notes: "Customer requested cancellation",
        price: "US$850.00",
    },
    {
        id: "proj-005",
        serviceId: "electrical-wiring",
        serviceName: "Electrical Rewiring",
        serviceImage: "https://trojan-projects-zw.s3.amazonaws.com/in-house/electrical/one.jpg",
        status: "confirmed",
        requestDate: "2025-01-03",
        estimatedArrival: "2025-01-10",
        location: "Highlands, Harare",
        price: "US$750.00",
        technician: "David T.",
    },
];
