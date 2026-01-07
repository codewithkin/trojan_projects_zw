import { Hono } from "hono";
import { db } from "@trojan_projects_zw/db";
import { authMiddleware } from "../lib/auth/middleware";

const chatRoute = new Hono()
  // GET /api/chat/rooms - Get user's chat rooms
  .get("/rooms", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Get rooms where user is a member
      const memberships = await db.chatMember.findMany({
        where: { userId: user.id },
        include: {
          room: {
            include: {
              messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
              members: {
                include: {
                  // We don't have direct user relation, so we'll query separately
                },
              },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });

      // Get project info for each room
      const rooms = await Promise.all(
        memberships.map(async (membership) => {
          const project = await db.project.findFirst({
            where: { id: membership.room.projectId },
            include: {
              service: {
                select: { name: true, images: true },
              },
              user: {
                select: { id: true, name: true },
              },
            },
          });

          const lastMessage = membership.room.messages[0];
          const memberCount = membership.room.members.length;

          return {
            id: membership.room.id,
            projectId: membership.room.projectId,
            projectName: project?.service.name || "Unknown",
            projectImage: project?.service.images?.[0],
            customerName: project?.user.name,
            memberCount,
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content,
                  userName: lastMessage.userName,
                  createdAt: lastMessage.createdAt,
                }
              : null,
            joinedAt: membership.joinedAt,
          };
        })
      );

      return c.json({ rooms });
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return c.json({ error: "Failed to fetch chat rooms" }, 500);
    }
  })
  // GET /api/chat/rooms/:roomId - Get chat room details
  .get("/rooms/:roomId", authMiddleware, async (c) => {
    const user = c.get("user");
    const roomId = c.req.param("roomId");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Check if user is a member
      const membership = await db.chatMember.findFirst({
        where: { roomId, userId: user.id },
      });

      if (!membership) {
        return c.json({ error: "Not a member of this chat room" }, 403);
      }

      const room = await db.chatRoom.findUnique({
        where: { id: roomId },
        include: {
          members: true,
          messages: {
            orderBy: { createdAt: "asc" },
            take: 100, // Limit to last 100 messages
          },
        },
      });

      if (!room) {
        return c.json({ error: "Chat room not found" }, 404);
      }

      // Get project info
      const project = await db.project.findFirst({
        where: { id: room.projectId },
        include: {
          service: {
            select: { name: true, images: true },
          },
          user: {
            select: { id: true, name: true },
          },
        },
      });

      // Check if there's only one member (user waiting for staff)
      const staffMembers = await db.user.findMany({
        where: {
          id: { in: room.members.map((m) => m.userId) },
          role: { in: ["staff", "support", "admin"] },
        },
      });

      const isWaitingForStaff = staffMembers.length === 0 && room.members.length === 1;

      return c.json({
        room: {
          id: room.id,
          projectId: room.projectId,
          projectName: project?.service.name,
          customerName: project?.user.name,
          members: room.members,
          messages: room.messages,
          isWaitingForStaff,
          createdAt: room.createdAt,
        },
      });
    } catch (error) {
      console.error("Error fetching chat room:", error);
      return c.json({ error: "Failed to fetch chat room" }, 500);
    }
  })
  // GET /api/chat/rooms/:roomId/messages - Get messages with pagination
  .get("/rooms/:roomId/messages", authMiddleware, async (c) => {
    const user = c.get("user");
    const roomId = c.req.param("roomId");
    const before = c.req.query("before"); // Cursor for pagination
    const limit = parseInt(c.req.query("limit") || "50");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Check if user is a member
      const membership = await db.chatMember.findFirst({
        where: { roomId, userId: user.id },
      });

      if (!membership) {
        return c.json({ error: "Not a member of this chat room" }, 403);
      }

      const messages = await db.chatMessage.findMany({
        where: {
          roomId,
          ...(before ? { createdAt: { lt: new Date(before) } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return c.json({
        messages: messages.reverse(), // Return in chronological order
        hasMore: messages.length === limit,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return c.json({ error: "Failed to fetch messages" }, 500);
    }
  })
  // POST /api/chat/rooms/:roomId/messages - Save a message (for persistence)
  .post("/rooms/:roomId/messages", authMiddleware, async (c) => {
    const user = c.get("user");
    const roomId = c.req.param("roomId");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Check if user is a member
      const membership = await db.chatMember.findFirst({
        where: { roomId, userId: user.id },
      });

      if (!membership) {
        return c.json({ error: "Not a member of this chat room" }, 403);
      }

      const body = await c.req.json();
      const { content, type = "message" } = body;

      if (!content) {
        return c.json({ error: "Content is required" }, 400);
      }

      const message = await db.chatMessage.create({
        data: {
          roomId,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          content,
          type,
        },
      });

      // Update last seen for the user
      await db.chatMember.update({
        where: { id: membership.id },
        data: { lastSeen: new Date() },
      });

      return c.json({ message }, 201);
    } catch (error) {
      console.error("Error saving message:", error);
      return c.json({ error: "Failed to save message" }, 500);
    }
  })
  // POST /api/chat/rooms/:roomId/join - Join a chat room (for staff)
  .post("/rooms/:roomId/join", authMiddleware, async (c) => {
    const user = c.get("user");
    const roomId = c.req.param("roomId");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only staff can join rooms
    if (!["staff", "support", "admin"].includes(user.role)) {
      return c.json({ error: "Only staff members can join rooms" }, 403);
    }

    try {
      // Check if room exists
      const room = await db.chatRoom.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return c.json({ error: "Chat room not found" }, 404);
      }

      // Check if already a member
      const existingMember = await db.chatMember.findFirst({
        where: { roomId, userId: user.id },
      });

      if (existingMember) {
        return c.json({ message: "Already a member" });
      }

      // Add as member
      await db.chatMember.create({
        data: {
          roomId,
          userId: user.id,
        },
      });

      // Add a system message that staff joined
      await db.chatMessage.create({
        data: {
          roomId,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          content: `${user.name} joined the chat`,
          type: "join",
        },
      });

      return c.json({ success: true, message: `${user.name} joined the chat room` });
    } catch (error) {
      console.error("Error joining chat room:", error);
      return c.json({ error: "Failed to join chat room" }, 500);
    }
  });

export default chatRoute;
