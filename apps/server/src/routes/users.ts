import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";

// Define valid roles (will include admin after migration)
type Role = "user" | "staff" | "support" | "admin";
const validRoles: Role[] = ["user", "staff", "support", "admin"];

const usersRoute = new Hono()
  /**
   * GET /api/users - List users (with optional role filter)
   * 
   * Query params:
   * - roles: comma-separated list of roles to filter by
   * - page: page number (default: 1)
   * - limit: items per page (default: 50)
   */
  .get("/", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only admin/staff/support can list users
    const allowedRoles: Role[] = ["admin", "staff", "support"];
    if (!allowedRoles.includes(user.role as Role)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    try {
      const rolesParam = c.req.query("roles")?.split(",").filter(Boolean) || [];
      const page = parseInt(c.req.query("page") || "1");
      const limit = parseInt(c.req.query("limit") || "50");
      const skip = (page - 1) * limit;

      // Filter to only valid roles and cast to the expected type
      const roles = rolesParam.filter((r): r is Role => validRoles.includes(r as Role));

      // Build where clause - use any to avoid Prisma type issues before migration
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = roles.length > 0 ? { role: { in: roles } } : {};

      // Get users
      const users = await db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      // Get total count of all users (regardless of filter)
      const totalUsers = await db.user.count({
        where: { role: "user" },
      });

      // Get filtered count
      const totalFiltered = await db.user.count({ where });

      return c.json({
        users,
        totalUsers,
        totalFiltered,
        page,
        limit,
        totalPages: Math.ceil(totalFiltered / limit),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  })

  /**
   * GET /api/users/:id - Get a single user by ID
   */
  .get("/:id", authMiddleware, async (c) => {
    const requestingUser = c.get("user");
    const userId = c.req.param("id");

    if (!requestingUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Users can view their own profile, admin/staff can view any
    const allowedRoles: Role[] = ["admin", "staff", "support"];
    if (requestingUser.id !== userId && !allowedRoles.includes(requestingUser.role as Role)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  })

  /**
   * DELETE /api/users/:id - Delete a user (admin only)
   */
  .delete("/:id", authMiddleware, async (c) => {
    const requestingUser = c.get("user");
    const userId = c.req.param("id");

    if (!requestingUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only admin can delete users
    if ((requestingUser.role as Role) !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Can't delete yourself
    if (requestingUser.id === userId) {
      return c.json({ error: "Cannot delete your own account" }, 400);
    }

    try {
      // Check if user exists
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Delete related records first (sessions, accounts, etc.)
      await db.session.deleteMany({ where: { userId } });
      await db.account.deleteMany({ where: { userId } });
      
      // Delete the user
      await db.user.delete({ where: { id: userId } });

      return c.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return c.json({ error: "Failed to delete user" }, 500);
    }
  });

export default usersRoute;
