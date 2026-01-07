import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";
import { notifyQuoteCreated, notifyQuoteApproved, notifyQuoteRejected } from "../lib/notifications";
import { pushNewQuote } from "../lib/push-notifications";

const quotesRoute = new Hono()
  // GET /api/quotes - Get user's quotes
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
      const totalCount = await db.quote.count({ where });

      const quotes = await db.quote.findMany({
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
          project: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const transformedQuotes = quotes.map((quote) => ({
        id: quote.id,
        status: quote.status,
        location: quote.location,
        notes: quote.notes,
        estimatedPrice: quote.estimatedPrice ? Number(quote.estimatedPrice) : null,
        staffNotes: quote.staffNotes,
        service: quote.service,
        user: quote.user,
        hasProject: !!quote.project,
        project: quote.project,
        createdAt: quote.createdAt,
        updatedAt: quote.updatedAt,
      }));

      return c.json({ 
        quotes: transformedQuotes,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page < Math.ceil(totalCount / limit),
        }
      });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return c.json({ error: "Failed to fetch quotes" }, 500);
    }
  })
  // POST /api/quotes - Create a new quote request
  .post("/", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const body = await c.req.json();
      const { serviceId, location, notes } = body;

      if (!serviceId || !location) {
        return c.json({ error: "Service ID and location are required" }, 400);
      }

      // Verify service exists
      const service = await db.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }

      const quote = await db.quote.create({
        data: {
          serviceId,
          userId: user.id,
          location,
          notes: notes || null,
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      // Create notification for admin dashboard
      try {
        await notifyQuoteCreated({
          id: quote.id,
          service: { name: quote.service.name },
          user: { name: user.name },
          location: quote.location,
        });
        
        // Send push notification to all staff
        await pushNewQuote(
          quote.id,
          quote.service.name,
          user.name,
          quote.location
        );
      } catch (notifyError) {
        console.error("Failed to create notification:", notifyError);
      }

      return c.json({ 
        quote: {
          id: quote.id,
          status: quote.status,
          location: quote.location,
          notes: quote.notes,
          service: quote.service,
          createdAt: quote.createdAt,
        },
        message: "Quote request submitted successfully",
      }, 201);
    } catch (error) {
      console.error("Error creating quote:", error);
      return c.json({ error: "Failed to create quote" }, 500);
    }
  })
  // PATCH /api/quotes/:id - Update quote (staff only for approval/rejection)
  .patch("/:id", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const quoteId = c.req.param("id");

    try {
      const quote = await db.quote.findUnique({
        where: { id: quoteId },
        include: { project: true },
      });

      if (!quote) {
        return c.json({ error: "Quote not found" }, 404);
      }

      const isStaff = user.role === "staff" || user.role === "support";
      const isOwner = quote.userId === user.id;

      if (!isStaff && !isOwner) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const body = await c.req.json();
      const { status, estimatedPrice, staffNotes } = body;

      // Only staff can approve/reject
      if ((status === "approved" || status === "rejected") && !isStaff) {
        return c.json({ error: "Only staff can approve or reject quotes" }, 403);
      }

      const updateData: Record<string, unknown> = {};

      if (status) {
        updateData.status = status;
      }
      if (estimatedPrice !== undefined) {
        updateData.estimatedPrice = estimatedPrice;
      }
      if (staffNotes !== undefined) {
        updateData.staffNotes = staffNotes;
      }

      const updatedQuote = await db.quote.update({
        where: { id: quoteId },
        data: updateData,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Create notification for status change
      if (status === "approved" || status === "rejected") {
        try {
          if (status === "approved") {
            await notifyQuoteApproved({
              id: updatedQuote.id,
              service: { name: updatedQuote.service.name },
              user: { name: updatedQuote.user.name },
              estimatedPrice: updatedQuote.estimatedPrice ? Number(updatedQuote.estimatedPrice) : null,
            });
          } else {
            await notifyQuoteRejected({
              id: updatedQuote.id,
              service: { name: updatedQuote.service.name },
              user: { name: updatedQuote.user.name },
            });
          }
        } catch (notifyError) {
          console.error("Failed to create notification:", notifyError);
        }
      }

      return c.json({ 
        quote: updatedQuote,
        message: `Quote ${status || "updated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating quote:", error);
      return c.json({ error: "Failed to update quote" }, 500);
    }
  })
  // POST /api/quotes/:id/promote - Promote approved quote to project (user only)
  .post("/:id/promote", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const quoteId = c.req.param("id");

    try {
      const quote = await db.quote.findUnique({
        where: { id: quoteId },
        include: { project: true },
      });

      if (!quote) {
        return c.json({ error: "Quote not found" }, 404);
      }

      if (quote.userId !== user.id) {
        return c.json({ error: "You can only promote your own quotes" }, 403);
      }

      if (quote.status !== "approved") {
        return c.json({ error: "Only approved quotes can be promoted to projects" }, 400);
      }

      if (quote.project) {
        return c.json({ error: "This quote has already been promoted to a project" }, 400);
      }

      // Create the project
      const project = await db.project.create({
        data: {
          quoteId: quote.id,
          status: "pending",
          finalPrice: quote.estimatedPrice,
        },
        include: {
          quote: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      return c.json({ 
        project: {
          id: project.id,
          status: project.status,
          finalPrice: project.finalPrice ? Number(project.finalPrice) : null,
          service: project.quote.service,
          location: project.quote.location,
          createdAt: project.createdAt,
        },
        message: "Quote promoted to project successfully",
      }, 201);
    } catch (error) {
      console.error("Error promoting quote:", error);
      return c.json({ error: "Failed to promote quote" }, 500);
    }
  });

export default quotesRoute;
