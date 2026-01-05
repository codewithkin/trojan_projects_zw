import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@trojan_projects_zw/env/server";

import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export { prisma as db };
export default prisma;
