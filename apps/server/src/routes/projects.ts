import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";
import { 
  notifyProjectCreated, 
  notifyProjectAccepted, 
  notifyProjectStatusUpdate, 
  notifyProjectCompleted 
} from "../lib/notifications";

const projectsRoute = new Hono()
  // POST /api/projects - Create a new project
  .post("/", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const body = await c.req.json();
      const { serviceId, location, price, scheduledDate, notes } = body;

      if (!serviceId || !location) {
        return c.json(
          { error: "Service and location are required" },
          400
        );
      }

      // Verify service exists
      const service = await db.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }

      // Create the project
      const project = await db.project.create({
        data: {
          serviceId,
          userId: user.id,
          location,
          notes: notes || null,
          finalPrice: price ? price.toString() : null,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
          status: "pending",
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              images: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create notification for admin dashboard
      try {
        await notifyProjectCreated({
          id: project.id,
          service: { name: project.service.name },
          user: { name: project.user.name },
        });
      } catch (notifyError) {
        console.error("Failed to create notification:", notifyError);
      }

      return c.json(
        {
          message: "Project created successfully",
          project: {
            id: project.id,
            status: project.status,
            finalPrice: project.finalPrice
              ? Number(project.finalPrice)
              : null,
            scheduledDate: project.scheduledDate,
            location: project.location,
            notes: project.notes,
            service: project.service,
            user: project.user,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          },
        },
        201
      );
    } catch (error) {
      console.error("Error creating project:", error);
      return c.json({ error: "Failed to create project" }, 500);
    }
  })
  // GET /api/projects - Get user's projects
  .get("/", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const skip = (page - 1) * limit;

    try {
      const isStaff = user.role === "staff" || user.role === "support";
      const where = isStaff ? {} : { userId: user.id };
      
      // Get total count
      const totalCount = await db.project.count({ where });

      const projects = await db.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              images: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const transformedProjects = projects.map((project) => ({
        id: project.id,
        status: project.status,
        finalPrice: project.finalPrice ? Number(project.finalPrice) : null,
        scheduledDate: project.scheduledDate,
        startedAt: project.startedAt,
        completedAt: project.completedAt,
        technicianName: project.technicianName,
        technicianPhone: project.technicianPhone,
        userRating: project.userRating,
        userReview: project.userReview,
        service: project.service,
        location: project.location,
        notes: project.notes,
        user: project.user,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }));

      return c.json({ 
        projects: transformedProjects,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page < Math.ceil(totalCount / limit),
        }
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      return c.json({ error: "Failed to fetch projects" }, 500);
    }
  })
  // GET /api/projects/:id - Get single project
  .get("/:id", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = c.req.param("id");

    try {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
              images: true,
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const isStaff = user.role === "staff" || user.role === "support";
      const isOwner = project.userId === user.id;

      if (!isStaff && !isOwner) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      return c.json({ 
        project: {
          id: project.id,
          status: project.status,
          finalPrice: project.finalPrice ? Number(project.finalPrice) : null,
          scheduledDate: project.scheduledDate,
          startedAt: project.startedAt,
          completedAt: project.completedAt,
          technicianName: project.technicianName,
          technicianPhone: project.technicianPhone,
          userRating: project.userRating,
          userReview: project.userReview,
          service: project.service,
          location: project.location,
          notes: project.notes,
          user: project.user,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      return c.json({ error: "Failed to fetch project" }, 500);
    }
  })
  // PATCH /api/projects/:id/status - Update project status
  .patch("/:id/status", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = c.req.param("id");

    try {
      const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          userId: true,
          status: true,
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const isStaff = user.role === "staff" || user.role === "support";
      const isOwner = project.userId === user.id;

      if (!isStaff && !isOwner) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const body = await c.req.json();
      const { status, technicianName, technicianPhone, scheduledDate, userRating, userReview } = body;

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
      
      if (status && !validTransitions[currentStatus]?.includes(status)) {
        return c.json({ 
          error: `Cannot transition from ${currentStatus} to ${status}` 
        }, 400);
      }

      // Role-based restrictions
      // Staff: can set starting, in_progress, waiting_for_review
      // User: can set completed (with review)
      const staffStatuses = ["starting", "in_progress", "waiting_for_review"];

      if (status && staffStatuses.includes(status) && !isStaff) {
        return c.json({ error: "Only staff can update to this status" }, 403);
      }

      if (status === "completed" && !isOwner) {
        return c.json({ error: "Only the project owner can mark as completed" }, 403);
      }

      const updateData: Record<string, unknown> = {};

      if (status) {
        updateData.status = status;
        
        // Set timestamps based on status
        if (status === "starting" || status === "in_progress") {
          updateData.startedAt = new Date();
        }
        if (status === "completed") {
          updateData.completedAt = new Date();
        }
      }

      if (technicianName !== undefined) {
        updateData.technicianName = technicianName;
      }
      if (technicianPhone !== undefined) {
        updateData.technicianPhone = technicianPhone;
      }
      if (scheduledDate !== undefined) {
        updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
      }
      if (userRating !== undefined) {
        updateData.userRating = userRating;
      }
      if (userReview !== undefined) {
        updateData.userReview = userReview;
      }

      const updatedProject = await db.project.update({
        where: { id: projectId },
        data: updateData,
        include: {
          service: {
            select: { name: true },
          },
          user: {
            select: { name: true },
          },
        },
      });

      // Create notification for status update
      if (status) {
        try {
          if (status === "completed") {
            await notifyProjectCompleted({
              id: updatedProject.id,
              service: { name: updatedProject.service.name },
              user: { name: updatedProject.user.name },
              finalPrice: updatedProject.finalPrice ? Number(updatedProject.finalPrice) : null,
            });
          } else if (status === "starting") {
            // "starting" means staff accepted the project
            await notifyProjectAccepted(
              {
                id: updatedProject.id,
                service: { name: updatedProject.service.name },
                user: { name: updatedProject.user.name },
              },
              user.name
            );
          } else {
            await notifyProjectStatusUpdate({
              id: updatedProject.id,
              service: { name: updatedProject.service.name },
              status,
            });
          }
        } catch (notifyError) {
          console.error("Failed to create notification:", notifyError);
        }
      }

      // Status messages
      const statusMessages: Record<string, string> = {
        pending: "Project is pending",
        starting: "Team is on their way!",
        in_progress: "Project is now in progress",
        waiting_for_review: "Project is waiting for your review",
        completed: "Project completed successfully!",
        cancelled: "Project has been cancelled",
      };

      return c.json({ 
        project: updatedProject,
        message: status ? statusMessages[status] : "Project updated successfully",
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      return c.json({ error: "Failed to update project status" }, 500);
    }
  })
  // POST /api/projects/:id/review - Submit user review
  .post("/:id/review", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = c.req.param("id");

    try {
      const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          userId: true,
          status: true,
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      if (project.userId !== user.id) {
        return c.json({ error: "You can only review your own projects" }, 403);
      }

      if (project.status !== "waiting_for_review") {
        return c.json({ error: "Project must be in 'waiting for review' status to submit a review" }, 400);
      }

      const body = await c.req.json();
      const { rating, review } = body;

      if (!rating || rating < 1 || rating > 5) {
        return c.json({ error: "Rating must be between 1 and 5" }, 400);
      }

      const updatedProject = await db.project.update({
        where: { id: projectId },
        data: {
          status: "completed",
          userRating: rating,
          userReview: review || null,
          completedAt: new Date(),
        },
      });

      return c.json({ 
        project: updatedProject,
        message: "Thank you for your review! Project marked as completed.",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      return c.json({ error: "Failed to submit review" }, 500);
    }
  })
  // GET /api/projects/stats - Get project statistics (admin only)
  .get("/stats", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only staff/support can view stats
    if (user.role !== "staff" && user.role !== "support") {
      return c.json({ error: "Forbidden" }, 403);
    }

    try {
      // Get counts by status
      const [
        totalProjects,
        pendingCount,
        startingCount,
        inProgressCount,
        waitingReviewCount,
        completedCount,
        cancelledCount,
        recentProjects,
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
        db.project.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            service: { select: { id: true, name: true, category: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        }),
        db.project.aggregate({
          _sum: { finalPrice: true },
          where: { status: "completed" },
        }),
        db.user.count({ where: { role: "user" } }),
      ]);

      // Get projects by category (from service relation)
      const projectsByCategory = await db.project.groupBy({
        by: ["serviceId"],
        _count: true,
      });

      // Get service categories for the groupBy results
      const serviceIds = projectsByCategory.map((p) => p.serviceId).filter(Boolean) as string[];
      const services = await db.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, category: true },
      });

      const categoryMap = new Map(services.map((s) => [s.id, s.category]));
      const categoryCounts: Record<string, number> = {};
      
      for (const p of projectsByCategory) {
        const category = categoryMap.get(p.serviceId || "") || "other";
        categoryCounts[category] = (categoryCounts[category] || 0) + p._count;
      }

      return c.json({
        stats: {
          totalProjects,
          pendingCount,
          startingCount,
          inProgressCount,
          waitingReviewCount,
          completedCount,
          cancelledCount,
          totalRevenue: totalRevenue._sum.finalPrice ? Number(totalRevenue._sum.finalPrice) : 0,
          activeCustomers,
        },
        categoryCounts,
        recentProjects: recentProjects.map((p) => ({
          id: p.id,
          status: p.status,
          finalPrice: p.finalPrice ? Number(p.finalPrice) : null,
          location: p.location,
          service: p.service,
          user: p.user,
          createdAt: p.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching project stats:", error);
      return c.json({ error: "Failed to fetch stats" }, 500);
    }
  });

export default projectsRoute;
