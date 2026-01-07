import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { db } from "@trojan_projects_zw/db";
import { hashPassword } from "../../lib/auth/password";
import { generateToken } from "../../lib/auth/jwt";
import { sendInviteEmail } from "../../lib/email";

// ====================
// SERVICE MANAGEMENT TOOLS
// ====================

/**
 * Tool to list all services
 */
export const listServicesTool = createTool({
  id: "list-services",
  description:
    "List all services with their details. Use this to see what services are available.",
  inputSchema: z.object({
    category: z
      .enum(["solar", "cctv", "electrical", "water", "welding", "all"])
      .optional()
      .default("all")
      .describe("Filter by category"),
    limit: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of services to return"),
  }),
  outputSchema: z.object({
    services: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        category: z.string(),
        price: z.number(),
        featured: z.boolean(),
        projectsCount: z.number(),
        quotesCount: z.number(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const { category, limit } = context;

    const where = category !== "all" ? { category } : {};

    const services = await db.service.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            projects: true,
            quotes: true,
          },
        },
      },
    });

    return {
      services: services.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        category: s.category,
        price: Number(s.price),
        featured: s.featured,
        projectsCount: s._count.projects,
        quotesCount: s._count.quotes,
      })),
      count: services.length,
    };
  },
});

/**
 * Tool to create a new service
 */
export const createServiceTool = createTool({
  id: "create-service",
  description:
    "Create a new service. Requires name, description, price, and category. The slug will be auto-generated from the name.",
  inputSchema: z.object({
    name: z.string().describe("Service name"),
    description: z.string().describe("Service description"),
    price: z.number().describe("Service price in USD"),
    category: z
      .enum(["solar", "cctv", "electrical", "water", "welding"])
      .describe("Service category"),
    featured: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether the service is featured"),
    priceRange: z
      .string()
      .optional()
      .describe("Price range text (e.g., '$100 - $500')"),
    brands: z
      .array(z.string())
      .optional()
      .default([])
      .describe("Supported brands"),
    supports: z
      .array(z.string())
      .optional()
      .default([])
      .describe("What the service supports"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    service: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        category: z.string(),
        price: z.number(),
        featured: z.boolean(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { name, description, price, category, featured, priceRange, brands, supports } = context;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug exists
    const existingService = await db.service.findUnique({
      where: { slug },
    });

    if (existingService) {
      return {
        success: false,
        error: `A service with slug "${slug}" already exists`,
      };
    }

    const service = await db.service.create({
      data: {
        name,
        slug,
        description,
        price,
        priceRange: priceRange || null,
        category,
        featured: featured ?? false,
        images: [],
        brands: brands || [],
        supports: supports || [],
      },
    });

    return {
      success: true,
      service: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: service.category,
        price: Number(service.price),
        featured: service.featured,
      },
    };
  },
});

/**
 * Tool to update a service
 */
export const updateServiceTool = createTool({
  id: "update-service",
  description:
    "Update an existing service. Provide the service ID and the fields to update.",
  inputSchema: z.object({
    serviceId: z.string().describe("The ID of the service to update"),
    name: z.string().optional().describe("New service name"),
    description: z.string().optional().describe("New service description"),
    price: z.number().optional().describe("New price in USD"),
    category: z
      .enum(["solar", "cctv", "electrical", "water", "welding"])
      .optional()
      .describe("New category"),
    featured: z.boolean().optional().describe("Whether service is featured"),
    priceRange: z.string().optional().describe("New price range text"),
    brands: z.array(z.string()).optional().describe("Updated brands list"),
    supports: z.array(z.string()).optional().describe("Updated supports list"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    service: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        category: z.string(),
        price: z.number(),
        featured: z.boolean(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { serviceId, name, description, price, category, featured, priceRange, brands, supports } = context;

    const existingService = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return {
        success: false,
        error: `Service with ID "${serviceId}" not found`,
      };
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
      // Update slug if name changes
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (featured !== undefined) updateData.featured = featured;
    if (priceRange !== undefined) updateData.priceRange = priceRange;
    if (brands !== undefined) updateData.brands = brands;
    if (supports !== undefined) updateData.supports = supports;

    const service = await db.service.update({
      where: { id: serviceId },
      data: updateData,
    });

    return {
      success: true,
      service: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: service.category,
        price: Number(service.price),
        featured: service.featured,
      },
    };
  },
});

/**
 * Tool to delete a service
 */
export const deleteServiceTool = createTool({
  id: "delete-service",
  description:
    "Delete a service. WARNING: This will also delete all associated quotes and projects!",
  inputSchema: z.object({
    serviceId: z.string().describe("The ID of the service to delete"),
    confirmDeletion: z
      .boolean()
      .describe("Must be true to confirm deletion of associated data"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    deletedProjectsCount: z.number().optional(),
    deletedQuotesCount: z.number().optional(),
  }),
  execute: async ({ context }) => {
    const { serviceId, confirmDeletion } = context;

    if (!confirmDeletion) {
      return {
        success: false,
        message: "Deletion not confirmed. Set confirmDeletion to true to proceed.",
      };
    }

    const existingService = await db.service.findUnique({
      where: { id: serviceId },
      include: {
        _count: {
          select: {
            projects: true,
            quotes: true,
          },
        },
      },
    });

    if (!existingService) {
      return {
        success: false,
        message: `Service with ID "${serviceId}" not found`,
      };
    }

    const projectsCount = existingService._count.projects;
    const quotesCount = existingService._count.quotes;

    // Delete the service (cascades to projects and quotes)
    await db.service.delete({
      where: { id: serviceId },
    });

    return {
      success: true,
      message: `Service "${existingService.name}" deleted successfully`,
      deletedProjectsCount: projectsCount,
      deletedQuotesCount: quotesCount,
    };
  },
});

// ====================
// PROJECT MANAGEMENT TOOLS
// ====================

/**
 * Tool to list all projects with filters
 */
export const listProjectsTool = createTool({
  id: "list-projects",
  description:
    "List all projects with optional filters by status, customer, or service.",
  inputSchema: z.object({
    status: z
      .enum([
        "pending",
        "starting",
        "in_progress",
        "waiting_for_review",
        "completed",
        "cancelled",
        "all",
      ])
      .optional()
      .default("all")
      .describe("Filter by project status"),
    limit: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of projects to return"),
  }),
  outputSchema: z.object({
    projects: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        location: z.string(),
        finalPrice: z.number().nullable(),
        serviceName: z.string(),
        serviceCategory: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        technicianName: z.string().nullable(),
        scheduledDate: z.string().nullable(),
        createdAt: z.string(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const { status, limit } = context;

    const where = status !== "all" ? { status } : {};

    const projects = await db.project.findMany({
      where,
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
        location: p.location,
        finalPrice: p.finalPrice ? Number(p.finalPrice) : null,
        serviceName: p.service?.name || "Unknown",
        serviceCategory: p.service?.category || "Unknown",
        customerName: p.user?.name || "Unknown",
        customerEmail: p.user?.email || "Unknown",
        technicianName: p.technicianName,
        scheduledDate: p.scheduledDate?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
      })),
      count: projects.length,
    };
  },
});

/**
 * Tool to create a new project
 */
export const createProjectTool = createTool({
  id: "create-project",
  description:
    "Create a new project for a customer. Requires service ID, user email, and location.",
  inputSchema: z.object({
    serviceId: z.string().describe("The ID of the service for this project"),
    userEmail: z.string().email().describe("The email of the customer"),
    location: z.string().describe("Project location/address"),
    notes: z.string().optional().describe("Additional notes for the project"),
    finalPrice: z.number().optional().describe("Final price in USD"),
    scheduledDate: z
      .string()
      .optional()
      .describe("Scheduled date in ISO format (YYYY-MM-DD)"),
    technicianName: z.string().optional().describe("Assigned technician name"),
    technicianPhone: z.string().optional().describe("Technician phone number"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    project: z
      .object({
        id: z.string(),
        status: z.string(),
        serviceName: z.string(),
        customerName: z.string(),
        location: z.string(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const {
      serviceId,
      userEmail,
      location,
      notes,
      finalPrice,
      scheduledDate,
      technicianName,
      technicianPhone,
    } = context;

    // Verify service exists
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return {
        success: false,
        error: `Service with ID "${serviceId}" not found`,
      };
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return {
        success: false,
        error: `User with email "${userEmail}" not found`,
      };
    }

    const project = await db.project.create({
      data: {
        serviceId,
        userId: user.id,
        location,
        notes: notes || null,
        finalPrice: finalPrice ? finalPrice.toString() : null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        technicianName: technicianName || null,
        technicianPhone: technicianPhone || null,
        status: "pending",
      },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return {
      success: true,
      project: {
        id: project.id,
        status: project.status,
        serviceName: project.service?.name || "Unknown",
        customerName: project.user?.name || "Unknown",
        location: project.location,
      },
    };
  },
});

/**
 * Tool to update project status
 */
export const updateProjectStatusTool = createTool({
  id: "update-project-status",
  description:
    "Update a project's status. Valid transitions: pending→starting→in_progress→waiting_for_review→completed. Can also cancel from pending/starting/in_progress.",
  inputSchema: z.object({
    projectId: z.string().describe("The ID of the project to update"),
    status: z
      .enum([
        "pending",
        "starting",
        "in_progress",
        "waiting_for_review",
        "completed",
        "cancelled",
      ])
      .describe("New status"),
    technicianName: z.string().optional().describe("Technician name to assign"),
    technicianPhone: z.string().optional().describe("Technician phone"),
    scheduledDate: z
      .string()
      .optional()
      .describe("Schedule date in ISO format"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    project: z
      .object({
        id: z.string(),
        oldStatus: z.string(),
        newStatus: z.string(),
        serviceName: z.string(),
        customerName: z.string(),
      })
      .optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { projectId, status, technicianName, technicianPhone, scheduledDate } = context;

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    if (!project) {
      return {
        success: false,
        error: `Project with ID "${projectId}" not found`,
      };
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      pending: ["starting", "cancelled"],
      starting: ["in_progress", "cancelled"],
      in_progress: ["waiting_for_review", "cancelled"],
      waiting_for_review: ["completed"],
      completed: [],
      cancelled: [],
    };

    const currentStatus = project.status;
    if (!validTransitions[currentStatus]?.includes(status)) {
      return {
        success: false,
        error: `Cannot transition from "${currentStatus}" to "${status}"`,
      };
    }

    const updateData: Record<string, unknown> = { status };

    // Set timestamps based on status
    if (status === "starting" || status === "in_progress") {
      updateData.startedAt = new Date();
    }
    if (status === "completed") {
      updateData.completedAt = new Date();
    }
    if (technicianName) updateData.technicianName = technicianName;
    if (technicianPhone) updateData.technicianPhone = technicianPhone;
    if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);

    await db.project.update({
      where: { id: projectId },
      data: updateData,
    });

    const statusMessages: Record<string, string> = {
      pending: "Project is pending",
      starting: "Team is on their way!",
      in_progress: "Project is now in progress",
      waiting_for_review: "Project is waiting for customer review",
      completed: "Project completed successfully!",
      cancelled: "Project has been cancelled",
    };

    return {
      success: true,
      project: {
        id: project.id,
        oldStatus: currentStatus,
        newStatus: status,
        serviceName: project.service?.name || "Unknown",
        customerName: project.user?.name || "Unknown",
      },
      message: statusMessages[status],
    };
  },
});

/**
 * Tool to update project details
 */
export const updateProjectTool = createTool({
  id: "update-project",
  description:
    "Update project details like price, location, notes, technician info.",
  inputSchema: z.object({
    projectId: z.string().describe("The ID of the project to update"),
    location: z.string().optional().describe("New location"),
    notes: z.string().optional().describe("Updated notes"),
    finalPrice: z.number().optional().describe("Updated final price"),
    technicianName: z.string().optional().describe("Technician name"),
    technicianPhone: z.string().optional().describe("Technician phone"),
    scheduledDate: z.string().optional().describe("Scheduled date"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    project: z
      .object({
        id: z.string(),
        status: z.string(),
        serviceName: z.string(),
        finalPrice: z.number().nullable(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const {
      projectId,
      location,
      notes,
      finalPrice,
      technicianName,
      technicianPhone,
      scheduledDate,
    } = context;

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { service: { select: { name: true } } },
    });

    if (!project) {
      return {
        success: false,
        error: `Project with ID "${projectId}" not found`,
      };
    }

    const updateData: Record<string, unknown> = {};
    if (location !== undefined) updateData.location = location;
    if (notes !== undefined) updateData.notes = notes;
    if (finalPrice !== undefined) updateData.finalPrice = finalPrice.toString();
    if (technicianName !== undefined) updateData.technicianName = technicianName;
    if (technicianPhone !== undefined) updateData.technicianPhone = technicianPhone;
    if (scheduledDate !== undefined)
      updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;

    const updated = await db.project.update({
      where: { id: projectId },
      data: updateData,
      include: { service: { select: { name: true } } },
    });

    return {
      success: true,
      project: {
        id: updated.id,
        status: updated.status,
        serviceName: updated.service?.name || "Unknown",
        finalPrice: updated.finalPrice ? Number(updated.finalPrice) : null,
      },
    };
  },
});

/**
 * Tool to delete a project
 */
export const deleteProjectTool = createTool({
  id: "delete-project",
  description: "Delete a project. Can only delete cancelled or pending projects.",
  inputSchema: z.object({
    projectId: z.string().describe("The ID of the project to delete"),
    confirmDeletion: z.boolean().describe("Must be true to confirm deletion"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { projectId, confirmDeletion } = context;

    if (!confirmDeletion) {
      return {
        success: false,
        message: "Deletion not confirmed. Set confirmDeletion to true to proceed.",
      };
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { service: { select: { name: true } } },
    });

    if (!project) {
      return {
        success: false,
        message: `Project with ID "${projectId}" not found`,
      };
    }

    // Only allow deleting cancelled or pending projects
    if (!["cancelled", "pending"].includes(project.status)) {
      return {
        success: false,
        message: `Cannot delete project in "${project.status}" status. Only pending or cancelled projects can be deleted.`,
      };
    }

    await db.project.delete({
      where: { id: projectId },
    });

    return {
      success: true,
      message: `Project for "${project.service?.name}" deleted successfully`,
    };
  },
});

// ====================
// QUOTE MANAGEMENT TOOLS
// ====================

/**
 * Tool to list all quotes
 */
export const listQuotesTool = createTool({
  id: "list-quotes",
  description: "List all quote requests with their status.",
  inputSchema: z.object({
    status: z
      .enum(["pending", "approved", "rejected", "all"])
      .optional()
      .default("all")
      .describe("Filter by quote status"),
    limit: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of quotes to return"),
  }),
  outputSchema: z.object({
    quotes: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        location: z.string(),
        notes: z.string().nullable(),
        estimatedPrice: z.number().nullable(),
        staffNotes: z.string().nullable(),
        serviceName: z.string(),
        serviceCategory: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
        createdAt: z.string(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const { status, limit } = context;

    const where = status !== "all" ? { status } : {};

    const quotes = await db.quote.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true, category: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return {
      quotes: quotes.map((q) => ({
        id: q.id,
        status: q.status,
        location: q.location,
        notes: q.notes,
        estimatedPrice: q.estimatedPrice ? Number(q.estimatedPrice) : null,
        staffNotes: q.staffNotes,
        serviceName: q.service?.name || "Unknown",
        serviceCategory: q.service?.category || "Unknown",
        customerName: q.user?.name || "Unknown",
        customerEmail: q.user?.email || "Unknown",
        createdAt: q.createdAt.toISOString(),
      })),
      count: quotes.length,
    };
  },
});

/**
 * Tool to approve a quote
 */
export const approveQuoteTool = createTool({
  id: "approve-quote",
  description:
    "Approve a pending quote and set an estimated price. The customer will be able to convert this to a project.",
  inputSchema: z.object({
    quoteId: z.string().describe("The ID of the quote to approve"),
    estimatedPrice: z.number().describe("The estimated price in USD"),
    staffNotes: z
      .string()
      .optional()
      .describe("Notes for the customer about the quote"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    quote: z
      .object({
        id: z.string(),
        status: z.string(),
        estimatedPrice: z.number(),
        serviceName: z.string(),
        customerName: z.string(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { quoteId, estimatedPrice, staffNotes } = context;

    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    if (!quote) {
      return {
        success: false,
        error: `Quote with ID "${quoteId}" not found`,
      };
    }

    if (quote.status !== "pending") {
      return {
        success: false,
        error: `Quote is already "${quote.status}". Can only approve pending quotes.`,
      };
    }

    const updated = await db.quote.update({
      where: { id: quoteId },
      data: {
        status: "approved",
        estimatedPrice: estimatedPrice.toString(),
        staffNotes: staffNotes || null,
      },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return {
      success: true,
      quote: {
        id: updated.id,
        status: updated.status,
        estimatedPrice: Number(updated.estimatedPrice),
        serviceName: updated.service?.name || "Unknown",
        customerName: updated.user?.name || "Unknown",
      },
    };
  },
});

/**
 * Tool to reject a quote
 */
export const rejectQuoteTool = createTool({
  id: "reject-quote",
  description: "Reject a pending quote with an explanation for the customer.",
  inputSchema: z.object({
    quoteId: z.string().describe("The ID of the quote to reject"),
    staffNotes: z
      .string()
      .describe("Explanation for why the quote is being rejected"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    quote: z
      .object({
        id: z.string(),
        status: z.string(),
        serviceName: z.string(),
        customerName: z.string(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { quoteId, staffNotes } = context;

    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    if (!quote) {
      return {
        success: false,
        error: `Quote with ID "${quoteId}" not found`,
      };
    }

    if (quote.status !== "pending") {
      return {
        success: false,
        error: `Quote is already "${quote.status}". Can only reject pending quotes.`,
      };
    }

    const updated = await db.quote.update({
      where: { id: quoteId },
      data: {
        status: "rejected",
        staffNotes,
      },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return {
      success: true,
      quote: {
        id: updated.id,
        status: updated.status,
        serviceName: updated.service?.name || "Unknown",
        customerName: updated.user?.name || "Unknown",
      },
    };
  },
});

/**
 * Tool to convert quote to project
 */
export const convertQuoteToProjectTool = createTool({
  id: "convert-quote-to-project",
  description:
    "Convert an approved quote into a project. The project will be created with the quote details.",
  inputSchema: z.object({
    quoteId: z.string().describe("The ID of the approved quote to convert"),
    scheduledDate: z
      .string()
      .optional()
      .describe("Scheduled date for the project"),
    technicianName: z.string().optional().describe("Assigned technician"),
    technicianPhone: z.string().optional().describe("Technician phone"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    project: z
      .object({
        id: z.string(),
        status: z.string(),
        serviceName: z.string(),
        customerName: z.string(),
        location: z.string(),
        finalPrice: z.number().nullable(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { quoteId, scheduledDate, technicianName, technicianPhone } = context;

    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    if (!quote) {
      return {
        success: false,
        error: `Quote with ID "${quoteId}" not found`,
      };
    }

    if (quote.status !== "approved") {
      return {
        success: false,
        error: `Quote must be approved before converting to project. Current status: "${quote.status}"`,
      };
    }

    // Check if quote already has a project
    const existingProject = await db.project.findUnique({
      where: { quoteId },
    });

    if (existingProject) {
      return {
        success: false,
        error: `Quote already converted to project (Project ID: ${existingProject.id})`,
      };
    }

    const project = await db.project.create({
      data: {
        serviceId: quote.serviceId,
        userId: quote.userId,
        quoteId: quote.id,
        location: quote.location,
        notes: quote.notes,
        finalPrice: quote.estimatedPrice,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        technicianName: technicianName || null,
        technicianPhone: technicianPhone || null,
        status: "pending",
      },
      include: {
        service: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return {
      success: true,
      project: {
        id: project.id,
        status: project.status,
        serviceName: project.service?.name || "Unknown",
        customerName: project.user?.name || "Unknown",
        location: project.location,
        finalPrice: project.finalPrice ? Number(project.finalPrice) : null,
      },
    };
  },
});

// ====================
// USER MANAGEMENT TOOLS
// ====================

/**
 * Tool to list all users
 */
export const listUsersTool = createTool({
  id: "list-users",
  description:
    "List all users with their roles, project counts, and activity info.",
  inputSchema: z.object({
    role: z
      .enum(["user", "staff", "support", "admin", "all"])
      .optional()
      .default("all")
      .describe("Filter by user role"),
    limit: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of users to return"),
  }),
  outputSchema: z.object({
    users: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
        emailVerified: z.boolean(),
        projectsCount: z.number(),
        quotesCount: z.number(),
        createdAt: z.string(),
      })
    ),
    count: z.number(),
  }),
  execute: async ({ context }) => {
    const { role, limit } = context;

    const where = role !== "all" ? { role } : {};

    const users = await db.user.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            projects: true,
            quotes: true,
          },
        },
      },
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        projectsCount: u._count.projects,
        quotesCount: u._count.quotes,
        createdAt: u.createdAt.toISOString(),
      })),
      count: users.length,
    };
  },
});

/**
 * Tool to invite a new team member
 */
export const inviteUserTool = createTool({
  id: "invite-user",
  description:
    "Invite a new team member. Creates their account and sends them an invitation email with credentials.",
  inputSchema: z.object({
    email: z.string().email().describe("Email address for the new user"),
    name: z.string().describe("Full name of the new user"),
    password: z
      .string()
      .min(6)
      .describe("Temporary password (at least 6 characters)"),
    role: z
      .enum(["user", "staff", "support", "admin"])
      .describe("Role to assign to the user"),
    phone: z.string().optional().describe("Phone number (optional)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
      })
      .optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { email, name, password, role, phone } = context;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: `User with email "${email}" already exists`,
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with verified email (invited users don't need to verify)
    const userId = generateToken(16);
    const user = await db.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: true, // Invited users are pre-verified
        role,
        phone: phone || null,
      },
    });

    // Create account with password
    const accountId = generateToken(16);
    await db.account.create({
      data: {
        id: accountId,
        accountId: email,
        providerId: "credentials",
        userId: user.id,
        password: hashedPassword,
      },
    });

    // Send invite email
    try {
      await sendInviteEmail(email, name, role, password);
    } catch (emailError) {
      console.error("Failed to send invite email:", emailError);
      // User created but email failed - continue anyway
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `Invitation sent to ${email}`,
    };
  },
});

/**
 * Tool to update a user's role
 */
export const updateUserRoleTool = createTool({
  id: "update-user-role",
  description: "Update a user's role (e.g., promote staff to admin).",
  inputSchema: z.object({
    userEmail: z.string().email().describe("Email of the user to update"),
    newRole: z
      .enum(["user", "staff", "support", "admin"])
      .describe("New role to assign"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        oldRole: z.string(),
        newRole: z.string(),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { userEmail, newRole } = context;

    const user = await db.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return {
        success: false,
        error: `User with email "${userEmail}" not found`,
      };
    }

    const oldRole = user.role;

    if (oldRole === newRole) {
      return {
        success: false,
        error: `User is already a "${newRole}"`,
      };
    }

    await db.user.update({
      where: { email: userEmail },
      data: { role: newRole },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        oldRole,
        newRole,
      },
    };
  },
});

/**
 * Tool to get user details
 */
export const getUserDetailsTool = createTool({
  id: "get-user-details",
  description:
    "Get detailed information about a specific user including their projects and quotes.",
  inputSchema: z.object({
    userEmail: z.string().email().describe("Email of the user to look up"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    user: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string().nullable(),
        role: z.string(),
        emailVerified: z.boolean(),
        projectsCount: z.number(),
        completedProjectsCount: z.number(),
        quotesCount: z.number(),
        pendingQuotesCount: z.number(),
        totalSpent: z.number(),
        createdAt: z.string(),
        recentProjects: z.array(
          z.object({
            id: z.string(),
            status: z.string(),
            serviceName: z.string(),
            finalPrice: z.number().nullable(),
          })
        ),
      })
      .optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { userEmail } = context;

    const user = await db.user.findUnique({
      where: { email: userEmail },
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { service: { select: { name: true } } },
        },
        _count: {
          select: {
            projects: true,
            quotes: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: `User with email "${userEmail}" not found`,
      };
    }

    // Calculate additional stats
    const completedProjects = await db.project.count({
      where: { userId: user.id, status: "completed" },
    });

    const pendingQuotes = await db.quote.count({
      where: { userId: user.id, status: "pending" },
    });

    const totalSpentResult = await db.project.aggregate({
      _sum: { finalPrice: true },
      where: { userId: user.id, status: "completed" },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        projectsCount: user._count.projects,
        completedProjectsCount: completedProjects,
        quotesCount: user._count.quotes,
        pendingQuotesCount: pendingQuotes,
        totalSpent: totalSpentResult._sum.finalPrice
          ? Number(totalSpentResult._sum.finalPrice)
          : 0,
        createdAt: user.createdAt.toISOString(),
        recentProjects: user.projects.map((p) => ({
          id: p.id,
          status: p.status,
          serviceName: p.service?.name || "Unknown",
          finalPrice: p.finalPrice ? Number(p.finalPrice) : null,
        })),
      },
    };
  },
});

// ====================
// DASHBOARD TOOLS
// ====================

/**
 * Tool to get admin dashboard summary
 */
export const getDashboardSummaryTool = createTool({
  id: "get-dashboard-summary",
  description:
    "Get a comprehensive admin dashboard summary with key metrics, pending actions, and recent activity.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    overview: z.object({
      totalProjects: z.number(),
      activeProjects: z.number(),
      totalRevenue: z.number(),
      totalCustomers: z.number(),
      totalServices: z.number(),
      totalStaff: z.number(),
    }),
    pendingActions: z.object({
      pendingQuotes: z.number(),
      pendingProjects: z.number(),
      waitingForReview: z.number(),
    }),
    recentActivity: z.object({
      newProjectsToday: z.number(),
      newQuotesToday: z.number(),
      completedToday: z.number(),
      revenueThisMonth: z.number(),
    }),
    topServices: z.array(
      z.object({
        name: z.string(),
        projectCount: z.number(),
        revenue: z.number(),
      })
    ),
  }),
  execute: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Overview metrics
    const [
      totalProjects,
      activeProjects,
      totalRevenueResult,
      totalCustomers,
      totalServices,
      totalStaff,
    ] = await Promise.all([
      db.project.count(),
      db.project.count({
        where: {
          status: { in: ["pending", "starting", "in_progress", "waiting_for_review"] },
        },
      }),
      db.project.aggregate({
        _sum: { finalPrice: true },
        where: { status: "completed" },
      }),
      db.user.count({ where: { role: "user" } }),
      db.service.count(),
      db.user.count({ where: { role: { in: ["staff", "support", "admin"] } } }),
    ]);

    // Pending actions
    const [pendingQuotes, pendingProjects, waitingForReview] = await Promise.all([
      db.quote.count({ where: { status: "pending" } }),
      db.project.count({ where: { status: "pending" } }),
      db.project.count({ where: { status: "waiting_for_review" } }),
    ]);

    // Recent activity
    const [newProjectsToday, newQuotesToday, completedToday, revenueThisMonthResult] =
      await Promise.all([
        db.project.count({ where: { createdAt: { gte: today } } }),
        db.quote.count({ where: { createdAt: { gte: today } } }),
        db.project.count({
          where: { status: "completed", completedAt: { gte: today } },
        }),
        db.project.aggregate({
          _sum: { finalPrice: true },
          where: { status: "completed", completedAt: { gte: startOfMonth } },
        }),
      ]);

    // Top services by project count
    const services = await db.service.findMany({
      include: {
        projects: {
          where: { status: "completed" },
          select: { finalPrice: true },
        },
        _count: { select: { projects: true } },
      },
      orderBy: { projects: { _count: "desc" } },
      take: 5,
    });

    return {
      overview: {
        totalProjects,
        activeProjects,
        totalRevenue: totalRevenueResult._sum.finalPrice
          ? Number(totalRevenueResult._sum.finalPrice)
          : 0,
        totalCustomers,
        totalServices,
        totalStaff,
      },
      pendingActions: {
        pendingQuotes,
        pendingProjects,
        waitingForReview,
      },
      recentActivity: {
        newProjectsToday,
        newQuotesToday,
        completedToday,
        revenueThisMonth: revenueThisMonthResult._sum.finalPrice
          ? Number(revenueThisMonthResult._sum.finalPrice)
          : 0,
      },
      topServices: services.map((s) => ({
        name: s.name,
        projectCount: s._count.projects,
        revenue: s.projects.reduce((sum, p) => sum + (p.finalPrice ? Number(p.finalPrice) : 0), 0),
      })),
    };
  },
});
