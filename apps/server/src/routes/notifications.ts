import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";

const notificationsRoute = new Hono()
  // GET /api/notifications - Get all notifications (admin only)
  .get("/", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || (user.role !== "admin" && user.role !== "staff" && user.role !== "support")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const unreadOnly = c.req.query("unread") === "true";
    const skip = (page - 1) * limit;

    try {
      const where = unreadOnly ? { read: false } : {};
      
      const [notifications, total, unreadCount] = await Promise.all([
        db.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.notification.count({ where }),
        db.notification.count({ where: { read: false } }),
      ]);

      return c.json({
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page < Math.ceil(total / limit),
        },
        unreadCount,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return c.json({ error: "Failed to fetch notifications" }, 500);
    }
  })
  // POST /api/notifications - Create a notification
  .post("/", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const body = await c.req.json();
      const { type, title, message, link, metadata } = body;

      if (!type || !title || !message) {
        return c.json({ error: "Type, title, and message are required" }, 400);
      }

      const notification = await db.notification.create({
        data: {
          type,
          title,
          message,
          link: link || null,
          metadata: metadata || null,
        },
      });

      return c.json({ notification }, 201);
    } catch (error) {
      console.error("Error creating notification:", error);
      return c.json({ error: "Failed to create notification" }, 500);
    }
  })
  // PATCH /api/notifications/:id/read - Mark notification as read
  .patch("/:id/read", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || (user.role !== "admin" && user.role !== "staff" && user.role !== "support")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");

    try {
      const notification = await db.notification.update({
        where: { id },
        data: { read: true },
      });

      return c.json({ notification });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return c.json({ error: "Failed to mark notification as read" }, 500);
    }
  })
  // PATCH /api/notifications/read-all - Mark all notifications as read
  .patch("/read-all", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || (user.role !== "admin" && user.role !== "staff" && user.role !== "support")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      await db.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });

      return c.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return c.json({ error: "Failed to mark notifications as read" }, 500);
    }
  })
  // DELETE /api/notifications/:id - Delete a notification
  .delete("/:id", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || user.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");

    try {
      await db.notification.delete({
        where: { id },
      });

      return c.json({ success: true, message: "Notification deleted" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      return c.json({ error: "Failed to delete notification" }, 500);
    }
  });

export default notificationsRoute;
