import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";

const preferencesRoute = new Hono()
  .post("/", async (c) => {
    const body = await c.req.json();
    const { userId, interests, location } = body;

    if (!userId || !interests || !location) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    try {
      const preference = await db.userPreference.upsert({
        where: { userId },
        update: {
          interests,
          location,
        },
        create: {
          userId,
          interests,
          location,
        },
      });

      return c.json({ success: true, preference });
    } catch (error) {
      console.error("Error saving preferences:", error);
      return c.json({ error: "Failed to save preferences" }, 500);
    }
  })
  .get("/:userId", async (c) => {
    const userId = c.req.param("userId");

    try {
      const preference = await db.userPreference.findUnique({
        where: { userId },
      });

      if (!preference) {
        return c.json({ error: "Preferences not found" }, 404);
      }

      return c.json({ preference });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return c.json({ error: "Failed to fetch preferences" }, 500);
    }
  });

export default preferencesRoute;
