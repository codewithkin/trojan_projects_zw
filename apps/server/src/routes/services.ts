import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware, requireAuth } from "../lib/auth/middleware";

const servicesRoute = new Hono()
  // GET /api/services - Get all services (public)
  .get("/", async (c) => {
    const category = c.req.query("category");
    const featured = c.req.query("featured");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const skip = (page - 1) * limit;

    try {
      const where: Record<string, unknown> = {};
      
      if (category && category !== "all") {
        where.category = category;
      }
      
      if (featured === "true") {
        where.featured = true;
      }

      // Get total count for pagination
      const totalCount = await db.service.count({ where });

      const services = await db.service.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          ratings: {
            select: {
              rating: true,
            },
          },
          likes: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              requests: true,
              likes: true,
              projects: true,
              quotes: true,
            },
          },
        },
      });

      // Transform to add computed fields
      const transformedServices = services.map((service) => {
        const ratings = service.ratings;
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
          : 0;
        
        return {
          id: service.id,
          slug: service.slug,
          name: service.name,
          price: Number(service.price),
          priceFormatted: `US$${Number(service.price).toFixed(2)}`,
          description: service.description,
          category: service.category,
          specifications: service.specifications,
          supports: service.supports,
          brands: service.brands,
          images: service.images,
          featured: service.featured,
          rating: avgRating,
          reviewCount: ratings.length,
          likesCount: service._count.likes,
          requestsCount: service._count.requests,
          projectsCount: service._count.projects,
          quotesCount: service._count.quotes,
          createdAt: service.createdAt,
        };
      });

      return c.json({ 
        services: transformedServices,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page < Math.ceil(totalCount / limit),
        }
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      return c.json({ error: "Failed to fetch services" }, 500);
    }
  })
  // POST /api/services - Create a new service (admin only)
  .post("/", authMiddleware, async (c) => {
    const user = c.get("user");
    
    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    try {
      const body = await c.req.json();
      const { name, description, price, priceRange, category, featured, images, brands, supports, specifications } = body;

      if (!name || !description || !price || !category) {
        return c.json({ error: "Name, description, price, and category are required" }, 400);
      }

      // Validate category
      const validCategories = ["solar", "cctv", "electrical", "water", "welding"];
      if (!validCategories.includes(category)) {
        return c.json({ error: `Category must be one of: ${validCategories.join(", ")}` }, 400);
      }

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
        return c.json({ error: "A service with a similar name already exists" }, 409);
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
          images: images || [],
          brands: brands || [],
          supports: supports || [],
          specifications: specifications || null,
        },
      });

      return c.json({
        success: true,
        service: {
          id: service.id,
          slug: service.slug,
          name: service.name,
          price: Number(service.price),
          category: service.category,
          featured: service.featured,
          createdAt: service.createdAt,
        },
      }, 201);
    } catch (error) {
      console.error("Error creating service:", error);
      return c.json({ error: "Failed to create service" }, 500);
    }
  })
  // PUT /api/services/:id - Update a service (admin only)
  .put("/:id", authMiddleware, async (c) => {
    const user = c.get("user");
    
    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const id = c.req.param("id");

    try {
      const existingService = await db.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return c.json({ error: "Service not found" }, 404);
      }

      const body = await c.req.json();
      const { name, description, price, priceRange, category, featured, images, brands, supports, specifications } = body;

      // If name is changing, update slug
      let slug = existingService.slug;
      if (name && name !== existingService.name) {
        slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        // Check if new slug conflicts with another service
        const slugConflict = await db.service.findFirst({
          where: { slug, id: { not: id } },
        });

        if (slugConflict) {
          return c.json({ error: "A service with a similar name already exists" }, 409);
        }
      }

      // Validate category if provided
      if (category) {
        const validCategories = ["solar", "cctv", "electrical", "water", "welding"];
        if (!validCategories.includes(category)) {
          return c.json({ error: `Category must be one of: ${validCategories.join(", ")}` }, 400);
        }
      }

      const service = await db.service.update({
        where: { id },
        data: {
          ...(name && { name, slug }),
          ...(description && { description }),
          ...(price && { price }),
          ...(priceRange !== undefined && { priceRange }),
          ...(category && { category }),
          ...(featured !== undefined && { featured }),
          ...(images && { images }),
          ...(brands && { brands }),
          ...(supports && { supports }),
          ...(specifications !== undefined && { specifications }),
        },
      });

      return c.json({
        success: true,
        service: {
          id: service.id,
          slug: service.slug,
          name: service.name,
          price: Number(service.price),
          category: service.category,
          featured: service.featured,
          updatedAt: service.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating service:", error);
      return c.json({ error: "Failed to update service" }, 500);
    }
  })
  // DELETE /api/services/:id - Delete a service (admin only)
  .delete("/:id", authMiddleware, async (c) => {
    const user = c.get("user");
    
    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const id = c.req.param("id");

    try {
      const existingService = await db.service.findUnique({
        where: { id },
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
        return c.json({ error: "Service not found" }, 404);
      }

      // Warn if service has associated data
      if (existingService._count.projects > 0 || existingService._count.quotes > 0) {
        return c.json({
          error: "Cannot delete service with existing projects or quotes. Consider marking it as unfeatured instead.",
          details: {
            projects: existingService._count.projects,
            quotes: existingService._count.quotes,
          },
        }, 400);
      }

      await db.service.delete({
        where: { id },
      });

      return c.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      return c.json({ error: "Failed to delete service" }, 500);
    }
  })
  // GET /api/services/:slug - Get single service by slug (public)
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");

    try {
      const service = await db.service.findUnique({
        where: { slug },
        include: {
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              requests: true,
              likes: true,
            },
          },
        },
      });

      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }

      const ratings = service.ratings;
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;

      const transformed = {
        id: service.id,
        slug: service.slug,
        name: service.name,
        price: Number(service.price),
        priceFormatted: `US$${Number(service.price).toFixed(2)}`,
        description: service.description,
        category: service.category,
        specifications: service.specifications,
        supports: service.supports,
        brands: service.brands,
        images: service.images,
        featured: service.featured,
        rating: avgRating,
        reviewCount: ratings.length,
        likesCount: service._count.likes,
        requestsCount: service._count.requests,
        ratings: ratings.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          user: r.user,
        })),
        likedBy: service.likes.map((l) => l.userId),
        createdAt: service.createdAt,
      };

      return c.json({ service: transformed });
    } catch (error) {
      console.error("Error fetching service:", error);
      return c.json({ error: "Failed to fetch service" }, 500);
    }
  })
  // POST /api/services/:slug/like - Like a service (authenticated)
  .post("/:slug/like", authMiddleware, async (c) => {
    const slug = c.req.param("slug");
    
    // Get user from context (set by authMiddleware)
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const service = await db.service.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }

      // Check if already liked
      const existingLike = await db.serviceLike.findUnique({
        where: {
          serviceId_userId: {
            serviceId: service.id,
            userId: user.id,
          },
        },
      });

      if (existingLike) {
        // Unlike
        await db.serviceLike.delete({
          where: { id: existingLike.id },
        });
        return c.json({ liked: false });
      } else {
        // Like
        await db.serviceLike.create({
          data: {
            serviceId: service.id,
            userId: user.id,
          },
        });
        return c.json({ liked: true });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      return c.json({ error: "Failed to toggle like" }, 500);
    }
  })
  // POST /api/services/:slug/request - Request a service (authenticated)
  .post("/:slug/request", authMiddleware, async (c) => {
    const slug = c.req.param("slug");
    
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { location, notes } = body;

    if (!location) {
      return c.json({ error: "Location is required" }, 400);
    }

    try {
      const service = await db.service.findUnique({
        where: { slug },
        select: { id: true, price: true },
      });

      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }

      const request = await db.serviceRequest.create({
        data: {
          serviceId: service.id,
          userId: user.id,
          location,
          notes,
          estimatedPrice: service.price,
        },
      });

      return c.json({ 
        success: true, 
        request: {
          id: request.id,
          status: request.status,
          createdAt: request.createdAt,
        },
      });
    } catch (error) {
      console.error("Error creating request:", error);
      return c.json({ error: "Failed to create request" }, 500);
    }
  })
  // GET /api/services/user/requests - Get user's requests (authenticated)
  .get("/user/requests", authMiddleware, async (c) => {
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const requests = await db.serviceRequest.findMany({
        where: { userId: user.id },
        include: {
          service: {
            select: {
              id: true,
              slug: true,
              name: true,
              images: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return c.json({
        requests: requests.map((r) => ({
          id: r.id,
          status: r.status,
          location: r.location,
          notes: r.notes,
          estimatedPrice: r.estimatedPrice ? Number(r.estimatedPrice) : null,
          finalPrice: r.finalPrice ? Number(r.finalPrice) : null,
          technicianName: r.technicianName,
          confirmedDate: r.confirmedDate,
          completedDate: r.completedDate,
          createdAt: r.createdAt,
          service: r.service,
        })),
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      return c.json({ error: "Failed to fetch requests" }, 500);
    }
  })
  // POST /api/services/:slug/rate - Rate a service (authenticated)
  .post("/:slug/rate", authMiddleware, async (c) => {
    const slug = c.req.param("slug");
    
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }

    try {
      const service = await db.service.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!service) {
        return c.json({ error: "Service not found" }, 404);
      }

      // Upsert rating - one rating per user per service
      const serviceRating = await db.serviceRating.upsert({
        where: {
          serviceId_userId: {
            serviceId: service.id,
            userId: user.id,
          },
        },
        update: {
          rating,
          comment,
        },
        create: {
          serviceId: service.id,
          userId: user.id,
          rating,
          comment,
        },
      });

      return c.json({ 
        success: true, 
        rating: {
          id: serviceRating.id,
          rating: serviceRating.rating,
          comment: serviceRating.comment,
        },
      });
    } catch (error) {
      console.error("Error rating service:", error);
      return c.json({ error: "Failed to rate service" }, 500);
    }
  });

export default servicesRoute;
