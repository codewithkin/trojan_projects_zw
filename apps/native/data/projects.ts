export interface Project {
    id: string;
    name: string;
    price: string;
    priceRange: string;
    description: string;
    inverter: string;
    battery: string;
    panels: string;
    protectionKit: boolean;
    supports: string[];
    brands: string[];
    images: string[];
}

export const projects: Project[] = [
    {
        id: "10kva-solar-system",
        name: "10 KVA Solar System",
        price: "US$3,950.00",
        priceRange: "$3,900 - $4,800",
        description: "Full-power 10 KVA system for large homes & businesses. Depending on Brand, Number of Panels and Batteries.",
        inverter: "5 KVA Hybrid Inverter (x2 or equivalent configuration)",
        battery: "48V / 200Ah Lithium Battery (1)",
        panels: "450W Solar Panels (10)",
        protectionKit: true,
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
            "https://trojan-projects.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/10-kva-solar-system/two.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/10-kva-solar-system/three.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/10-kva-solar-system/four.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/10-kva-solar-system/five.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/10-kva-solar-system/six.jpg"
        ]
    },
    {
        id: "1.5kva-solar-system",
        name: "1.5 KVA Solar System",
        price: "US$750.00",
        priceRange: "$750 - $900",
        description: "Complete 1.5 KVA hybrid system. Price depending on number of panels and battery type.",
        inverter: "1.5 KVA Hybrid Inverter",
        battery: "12.5V Lithium Battery (1)",
        panels: "400W Solar Panel (max of 2)",
        protectionKit: true,
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
            "https://trojan-projects.s3.amazonaws.com/in-house/1.5-kva-solar-system/one.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/1.5-kva-solar-system/two.jpg"
        ]
    },
    {
        id: "3.5kva-solar-system",
        name: "3.5 KVA Solar System",
        price: "US$1,250.00",
        priceRange: "$1,250 - $1,400",
        description: "Full 3.2 KVA system suitable for home & office backup. Depending on Brand.",
        inverter: "3.2 KVA Hybrid Inverter",
        battery: "24V Lithium Battery (1)",
        panels: "450W Solar Panels (4)",
        protectionKit: true,
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
            "https://trojan-projects.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/3.5-kva-solar-system/two.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/3.5-kva-solar-system/three.jpg"
        ]
    },
    {
        id: "cctv-installation",
        name: "CCTVs Installation",
        price: "US$120.00",
        priceRange: "$120 - $650",
        description: "HD cameras with DVR/NVR setup, night vision & remote phone viewing. Depending on Number and Type of Cameras. WiFi cams from $30.",
        inverter: "",
        battery: "",
        panels: "",
        protectionKit: false,
        supports: [
            "HD cameras",
            "DVR/NVR setup",
            "Night vision",
            "Remo
            "https://trojan-projects.s3.amazonaws.com/in-house/cctv-installation/one.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/cctv-installation/two.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/cctv-installation/three.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/cctv-installation/four.jpg",
            "https://trojan-projects.s3.amazonaws.com/in-house/cctv-installation/five.jpg"
        te phone viewing",
            "WiFi cams"
        ],
        brands: [],
        images: []
    }
];