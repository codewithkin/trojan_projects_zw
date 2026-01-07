import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";
import { registerPushToken, removePushToken } from "../lib/push-notifications";

const pushRoute = new Hono()
  // POST /api/push/register - Register a push token
  .post("/register", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const body = await c.req.json();
      const { token, platform, deviceId } = body;

      if (!token || !platform) {
        return c.json({ error: "Token and platform are required" }, 400);
      }

      const pushToken = await registerPushToken({
        userId: user.id,
        token,
        platform,
        deviceId,
      });

      return c.json({
        success: true,
        pushToken: {
          id: pushToken.id,
          platform: pushToken.platform,
        },
      });
    } catch (error) {
      console.error("Error registering push token:", error);
      if (error instanceof Error && error.message === "Invalid Expo push token") {
        return c.json({ error: "Invalid push token format" }, 400);
      }
      return c.json({ error: "Failed to register push token" }, 500);
    }
  })
  // DELETE /api/push/unregister - Unregister a push token
  .delete("/unregister", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const body = await c.req.json();
      const { token } = body;

      if (!token) {
        return c.json({ error: "Token is required" }, 400);
      }

      await removePushToken(token);

      return c.json({ success: true, message: "Push token unregistered" });
    } catch (error) {
      console.error("Error unregistering push token:", error);
      return c.json({ error: "Failed to unregister push token" }, 500);
    }
  })
  // GET /api/push/tokens - Get user's push tokens (for debugging)
  .get("/tokens", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const tokens = await db.pushToken.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          platform: true,
          createdAt: true,
        },
      });

      return c.json({ tokens });
    } catch (error) {
      console.error("Error fetching push tokens:", error);
      return c.json({ error: "Failed to fetch push tokens" }, 500);
    }
  });

export default pushRoute;
