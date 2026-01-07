import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@trojan_projects_zw/db";

/**
 * Tool to get overall project statistics
 */
export const getProjectStatsTool = createTool({
  id: "get-project-stats",
  description:
    "Fetches comprehensive project statistics including total counts, status breakdown, revenue, and customer metrics. Use this to understand the overall state of the business.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalProjects: z.number(),
    pendingCount: z.number(),
    startingCount: z.number(),
    inProgressCount: z.number(),
    waitingReviewCount: z.number(),
    completedCount: z.number(),
    cancelledCount: z.number(),
    totalRevenue: z.number(),
    activeCustomers: z.number(),
    completionRate: z.number(),
  }),
  execute: async () => {
    const [
      totalProjects,
      pendingCount,
      startingCount,
      inProgressCount,
      waitingReviewCount,
      completedCount,
      cancelledCount,
      totalRevenue,
      activeCustomers,
    ] = await Promise.all([
      db.project.count(),
      db.project.count({ where: { status: "pending" } }),
      db.project.count({ where: { status: "starting" } }),
      db.project.count({ where: { status: "in_progress" } }),
      db.project.count({ where: { status: "waiting_for_review" } }),
      db.project.count({ where: { status: "completed" } }),
      db.project.count({ where: { status: "cancelled" } }),
      db.project.aggregate({
        _sum: { finalPrice: true },
        where: { status: "completed" },
      }),
      db.user.count({ where: { role: "user" } }),
    ]);

    const completionRate =
      totalProjects > 0 ? Math.round((completedCount / totalProjects) * 100) : 0;

    return {
      totalProjects,
      pendingCount,
      startingCount,
      inProgressCount,
      waitingReviewCount,
      completedCount,
      cancelledCount,
      totalRevenue: totalRevenue._sum.finalPrice
        ? Number(totalRevenue._sum.finalPrice)
        : 0,
      activeCustomers,
      completionRate,
    };
  },
});

/**
 * Tool to get projects by status
 */
export const getProjectsByStatusTool = createTool({
  id: "get-projects-by-status",
  description:
    "Fetches a list of projects filtered by status. Use this to see specific projects that are pending, in progress, completed, etc.",
  inputSchema: z.object({
    status: z
      .enum([
        "pending",
        "starting",
        "in_progress",
        "waiting_for_review",
        "completed",
        "cancelled",
      ])
      .describe("The project status to filter by"),
    limit: z.number().optional().default(10).describe("Maximum number of projects to return"),
  }),
  outputSchema: z.object({
    projects: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        finalPrice: z.number().nullable(),
        location: z.string().nullable(),
        serviceName: z.string().nullable(),
        serviceCategory: z.string().nullable(),
        customerName: z.string().nullable(),
        customerEmail: z.string().nullable(),
        createdAt: z.string(),
        scheduledDate: z.string().nullable(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const { status, limit } = context;

    const projects = await db.project.findMany({
      where: { status },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true, category: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return {
      projects: projects.map((p) => ({
        id: p.id,
        status: p.status,
        finalPrice: p.finalPrice ? Number(p.finalPrice) : null,
        location: p.location,
        serviceName: p.service?.name || null,
        serviceCategory: p.service?.category || null,
        customerName: p.user?.name || null,
        customerEmail: p.user?.email || null,
        createdAt: p.createdAt.toISOString(),
        scheduledDate: p.scheduledDate?.toISOString() || null,
      })),
      count: projects.length,
    };
  },
});

/**
 * Tool to get revenue analytics
 */
export const getRevenueAnalyticsTool = createTool({
  id: "get-revenue-analytics",
  description:
    "Fetches revenue data including total revenue, average project value, and revenue breakdown by category and time period.",
  inputSchema: z.object({
    period: z
      .enum(["week", "month", "quarter", "year", "all"])
      .optional()
      .default("month")
      .describe("Time period for revenue analysis"),
  }),
  outputSchema: z.object({
    totalRevenue: z.number(),
    projectCount: z.number(),
    averageProjectValue: z.number(),
    revenueByCategory: z.record(z.number()),
    period: z.string(),
  }),
  execute: async ({ context }) => {
    const { period } = context;

    // Calculate date filter based on period
    const now = new Date();
    let dateFilter: Date | undefined;

    switch (period) {
      case "week":
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = undefined;
    }

    const whereClause: { status: string; completedAt?: { gte: Date } } = {
      status: "completed",
    };
    if (dateFilter) {
      whereClause.completedAt = { gte: dateFilter };
    }

    // Get completed projects with revenue
    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        service: { select: { category: true } },
      },
    });

    // Calculate metrics
    let totalRevenue = 0;
    const revenueByCategory: Record<string, number> = {};

    for (const project of projects) {
      const price = project.finalPrice ? Number(project.finalPrice) : 0;
      totalRevenue += price;

      const category = project.service?.category || "uncategorized";
      revenueByCategory[category] = (revenueByCategory[category] || 0) + price;
    }

    const projectCount = projects.length;
    const averageProjectValue =
      projectCount > 0 ? Math.round(totalRevenue / projectCount) : 0;

    return {
      totalRevenue,
      projectCount,
      averageProjectValue,
      revenueByCategory,
      period,
    };
  },
});

/**
 * Tool to get customer insights
 */
export const getCustomerInsightsTool = createTool({
  id: "get-customer-insights",
  description:
    "Fetches customer analytics including total customers, top customers by project count, and customer engagement metrics.",
  inputSchema: z.object({
    limit: z.number().optional().default(10).describe("Maximum number of top customers to return"),
  }),
  outputSchema: z.object({
    totalCustomers: z.number(),
    customersWithProjects: z.number(),
    topCustomers: z.array(
      z.object({
        name: z.string(),
        email: z.string(),
        projectCount: z.number(),
        totalSpent: z.number(),
      })
    ),
    newCustomersThisMonth: z.number(),
  }),
  execute: async ({ context }) => {
    const { limit } = context;

    // Get total customers
    const totalCustomers = await db.user.count({ where: { role: "user" } });

    // Get customers with at least one project
    const customersWithProjects = await db.user.count({
      where: {
        role: "user",
        projects: { some: {} },
      },
    });

    // Get new customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newCustomersThisMonth = await db.user.count({
      where: {
        role: "user",
        createdAt: { gte: startOfMonth },
      },
    });

    // Get top customers by project count
    const topCustomersData = await db.user.findMany({
      where: {
        role: "user",
        projects: { some: {} },
      },
      select: {
        name: true,
        email: true,
        projects: {
          select: {
            finalPrice: true,
          },
        },
      },
      take: limit,
    });

    // Sort by project count and calculate totals
    const topCustomers = topCustomersData
      .map((customer) => ({
        name: customer.name,
        email: customer.email,
        projectCount: customer.projects.length,
        totalSpent: customer.projects.reduce(
          (sum, p) => sum + (p.finalPrice ? Number(p.finalPrice) : 0),
          0
        ),
      }))
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, limit);

    return {
      totalCustomers,
      customersWithProjects,
      topCustomers,
      newCustomersThisMonth,
    };
  },
});

/**
 * Tool to get service performance
 */
export const getServicePerformanceTool = createTool({
  id: "get-service-performance",
  description:
    "Fetches performance metrics for services including popularity, revenue contribution, and ratings.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    services: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        projectCount: z.number(),
        completedCount: z.number(),
        totalRevenue: z.number(),
        averageRating: z.number().nullable(),
      })
    ),
    topCategories: z.array(
      z.object({
        category: z.string(),
        projectCount: z.number(),
        revenue: z.number(),
      })
    ),
  }),
  execute: async () => {
    // Get all services with their projects
    const services = await db.service.findMany({
      include: {
        projects: {
          select: {
            status: true,
            finalPrice: true,
            userRating: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate service metrics
    const serviceMetrics = services.map((service) => {
      const projectCount = service.projects.length;
      const completedCount = service.projects.filter(
        (p) => p.status === "completed"
      ).length;
      const totalRevenue = service.projects
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + (p.finalPrice ? Number(p.finalPrice) : 0), 0);

      // Calculate average rating from ratings
      const ratings = service.ratings.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : null;

      return {
        id: service.id,
        name: service.name,
        category: service.category,
        projectCount,
        completedCount,
        totalRevenue,
        averageRating,
      };
    });

    // Calculate category metrics
    const categoryMap: Record<string, { projectCount: number; revenue: number }> = {};

    for (const service of serviceMetrics) {
      if (!categoryMap[service.category]) {
        categoryMap[service.category] = { projectCount: 0, revenue: 0 };
      }
      categoryMap[service.category].projectCount += service.projectCount;
      categoryMap[service.category].revenue += service.totalRevenue;
    }

    const topCategories = Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        projectCount: data.projectCount,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.projectCount - a.projectCount);

    return {
      services: serviceMetrics.sort((a, b) => b.projectCount - a.projectCount),
      topCategories,
    };
  },
});

/**
 * Tool to search projects
 */
export const searchProjectsTool = createTool({
  id: "search-projects",
  description:
    "Search for projects by customer name, email, location, or service. Use this when looking for specific projects or customers.",
  inputSchema: z.object({
    query: z.string().describe("Search term to match against customer name, email, location, or service name"),
    limit: z.number().optional().default(10),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        finalPrice: z.number().nullable(),
        location: z.string().nullable(),
        serviceName: z.string().nullable(),
        customerName: z.string().nullable(),
        customerEmail: z.string().nullable(),
        createdAt: z.string(),
      })
    ),
    totalFound: z.number(),
  }),
  execute: async ({ context }) => {
    const { query, limit } = context;

    const projects = await db.project.findMany({
      where: {
        OR: [
          { location: { contains: query, mode: "insensitive" } },
          { user: { name: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } },
          { service: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return {
      results: projects.map((p) => ({
        id: p.id,
        status: p.status,
        finalPrice: p.finalPrice ? Number(p.finalPrice) : null,
        location: p.location,
        serviceName: p.service?.name || null,
        customerName: p.user?.name || null,
        customerEmail: p.user?.email || null,
        createdAt: p.createdAt.toISOString(),
      })),
      totalFound: projects.length,
    };
  },
});

/**
 * Tool to get recent activity
 */
export const getRecentActivityTool = createTool({
  id: "get-recent-activity",
  description:
    "Fetches recent business activity including new projects, status changes, and customer activity in the last few days.",
  inputSchema: z.object({
    days: z.number().optional().default(7).describe("Number of days to look back"),
  }),
  outputSchema: z.object({
    newProjects: z.number(),
    completedProjects: z.number(),
    newCustomers: z.number(),
    recentProjects: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        serviceName: z.string().nullable(),
        customerName: z.string().nullable(),
        createdAt: z.string(),
      })
    ),
    period: z.string(),
  }),
  execute: async ({ context }) => {
    const { days } = context;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [newProjects, completedProjects, newCustomers, recentProjects] =
      await Promise.all([
        db.project.count({
          where: { createdAt: { gte: since } },
        }),
        db.project.count({
          where: {
            status: "completed",
            completedAt: { gte: since },
          },
        }),
        db.user.count({
          where: {
            role: "user",
            createdAt: { gte: since },
          },
        }),
        db.project.findMany({
          where: { createdAt: { gte: since } },
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            service: { select: { name: true } },
            user: { select: { name: true } },
          },
        }),
      ]);

    return {
      newProjects,
      completedProjects,
      newCustomers,
      recentProjects: recentProjects.map((p) => ({
        id: p.id,
        status: p.status,
        serviceName: p.service?.name || null,
        customerName: p.user?.name || null,
        createdAt: p.createdAt.toISOString(),
      })),
      period: `Last ${days} days`,
    };
  },
});
