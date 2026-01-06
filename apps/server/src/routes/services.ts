import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { auth } from "@trojan_projects_zw/auth";

const servicesRoute = new Hono()
  // GET /api/services - Get all services (public)
  .get("/", async (c) => {
    const category = c.req.query("category");
    const featured = c.req.query("featured");

    try {
      const where: Record<string, unknown> = {};
      
      if (category && category !== "all") {
        where.category = category;
      }
      
      if (featured === "true") {
        where.featured = true;
      }

      const services = await db.service.findMany({
        where,
        orderBy: { createdAt: "desc" },
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
          createdAt: service.createdAt,
        };
      });

      return c.json({ services: transformedServices });
    } catch (error) {
      console.error("Error fetching services:", error);
      return c.json({ error: "Failed to fetch services" }, 500);
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
  .post("/:slug/like", async (c) => {
    const slug = c.req.param("slug");
    
    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    
    if (!session) {
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
            userId: session.user.id,
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
            userId: session.user.id,
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
  .post("/:slug/request", async (c) => {
    const slug = c.req.param("slug");
    
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    
    if (!session) {
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
          userId: session.user.id,
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
  .get("/user/requests", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const requests = await db.serviceRequest.findMany({
        where: { userId: session.user.id },
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
  .post("/:slug/rate", async (c) => {
    const slug = c.req.param("slug");
    
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    
    if (!session) {
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
            userId: session.user.id,
          },
        },
        update: {
          rating,
          comment,
        },
        create: {
          serviceId: service.id,
          userId: session.user.id,
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
