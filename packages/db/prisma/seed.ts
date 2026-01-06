import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.js";
import dotenv from "dotenv";

dotenv.config({
  path: "../../apps/server/.env",
});

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing services data
  await prisma.serviceRequest.deleteMany();
  await prisma.serviceLike.deleteMany();
  await prisma.serviceRating.deleteMany();
  await prisma.service.deleteMany();

  console.log("📦 Creating services...");

  // Solar Services
  const solarServices = [
    {
      slug: "10kva-solar-system",
      name: "10 KVA Solar System",
      price: 3950.00,
      description: "Full-power 10 KVA system for heavy loads: Borehole pumps, AC units, full house. Includes high-capacity inverter, batteries, and panels. Very reliable and backed by 1 Year Warranty.",
      category: "solar" as const,
      specifications: {
        inverter: "10 kVA hybrid inverter",
        battery: "10.24 kWh lithium-ion",
        panels: "12 x 550W monocrystalline",
        protectionKit: true,
      },
      supports: [
        "Lights",
        "Washing machine",
        "Borehole pump",
        "Fridge/Freezer",
        "TV",
        "AC Unit",
        "Full house"
      ],
      brands: ["MUST", "GROWART", "SUMRY", "SAKO"],
      images: [
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/one.jpg",
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/two.jpg",
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/10-kva-solar-system/three.jpg",
      ],
      featured: true,
    },
    {
      slug: "3.5kva-solar-system",
      name: "3.5 KVA Solar System",
      price: 1350.00,
      description: "Our Most Popular Deal! Ideal for Lights, TVs, Fridges, and Small Freezers. Great value for mid-size homes. Very reliable and backed by 1 Year Warranty.",
      category: "solar" as const,
      specifications: {
        inverter: "3.5 kVA hybrid inverter",
        battery: "5.12 kWh lithium-ion",
        panels: "4 x 550W monocrystalline",
        protectionKit: true,
      },
      supports: [
        "Lights",
        "TV",
        "Fridge/Freezer (Small)",
        "Phone charging",
        "Laptop"
      ],
      brands: ["MUST", "GROWART", "SUMRY", "SAKO"],
      images: [
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/one.jpg",
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/two.jpg",
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/3.5-kva-solar-system/three.jpg",
      ],
      featured: true,
    },
    {
      slug: "1.5kva-solar-system",
      name: "1.5 KVA Solar System",
      price: 800.00,
      description: "Budget-friendly solar for lights, phone charging, and small appliances. Perfect starter system. Very reliable and backed by 1 Year Warranty.",
      category: "solar" as const,
      specifications: {
        inverter: "1.5 kVA hybrid inverter",
        battery: "2.56 kWh lithium-ion",
        panels: "2 x 550W monocrystalline",
        protectionKit: true,
      },
      supports: [
        "Lights",
        "Phone charging",
        "Small TV",
        "Laptop"
      ],
      brands: ["MUST", "GROWART", "SUMRY", "SAKO"],
      images: [
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/one.jpg",
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/two.jpg",
        "https://trojan-projects-zw.s3.amazonaws.com/in-house/1.5-kva-solar-system/three.jpg",
      ],
      featured: false,
    },
  ];

  // CCTV Service
  const cctvServices = [
    {
      slug: "cctv-installation",
      name: "CCTV Installation",
      price: 150.00,
      description: "HD cameras with DVR/NVR setup, night vision & remote phone viewing. Depending on Number and Type of Cameras. WiFi cams from $30.",
      category: "cctv" as const,
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
      featured: true,
    },
  ];

  // Electrical Service
  const electricalServices = [
    {
      slug: "electrical-wiring",
      name: "Electrical Wiring",
      price: 200.00,
      description: "Complete electrical wiring for homes and offices. New installations and rewiring services.",
      category: "electrical" as const,
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
      featured: false,
    },
  ];

  // Water Service
  const waterServices = [
    {
      slug: "borehole-pump",
      name: "Borehole Pump Installation",
      price: 350.00,
      description: "Complete borehole pump installation including submersible pumps, pressure tanks, and piping.",
      category: "water" as const,
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
      featured: false,
    },
  ];

  // Create all services
  const allServices = [
    ...solarServices,
    ...cctvServices,
    ...electricalServices,
    ...waterServices,
  ];

  for (const serviceData of allServices) {
    const service = await prisma.service.create({
      data: serviceData,
    });
    console.log(`  ✅ Created: ${service.name}`);
  }

  // Add some mock ratings for featured services
  console.log("\n⭐ Adding service ratings...");
  
  const services = await prisma.service.findMany({ where: { featured: true } });
  
  // Create mock ratings (we don't have users yet, so we'll skip this for now)
  // When users exist, you can add ratings like:
  // await prisma.serviceRating.create({
  //   data: {
  //     serviceId: service.id,
  //     userId: user.id,
  //     rating: 5,
  //     comment: "Great service!",
  //   },
  // });

  console.log("\n✨ Seeding completed successfully!");
  console.log(`   Total services created: ${allServices.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
