import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";

const projectsRoute = new Hono()
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
      const where = isStaff ? {} : { quote: { userId: user.id } };
      
      // Get total count
      const totalCount = await db.project.count({ where });

      const projects = await db.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          quote: {
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
        service: project.quote.service,
        location: project.quote.location,
        notes: project.quote.notes,
        user: project.quote.user,
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
          quote: {
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
          },
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const isStaff = user.role === "staff" || user.role === "support";
      const isOwner = project.quote.userId === user.id;

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
          service: {
            ...project.quote.service,
            price: Number(project.quote.service.price),
          },
          location: project.quote.location,
          notes: project.quote.notes,
          user: project.quote.user,
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
        include: {
          quote: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const isStaff = user.role === "staff" || user.role === "support";
      const isOwner = project.quote.userId === user.id;

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
      });

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
        include: {
          quote: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      if (project.quote.userId !== user.id) {
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
  });

export default projectsRoute;
