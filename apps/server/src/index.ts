import { env } from "@trojan_projects_zw/env/server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { db } from "@trojan_projects_zw/db";

import authRoute from "./routes/auth";
import preferencesRoute from "./routes/preferences";
import servicesRoute from "./routes/services";
import quotesRoute from "./routes/quotes";
import projectsRoute from "./routes/projects";
import aiRoute from "./routes/ai";
import usersRoute from "./routes/users";
import uploadRoute from "./routes/upload";
import notificationsRoute from "./routes/notifications";
import pushRoute from "./routes/push";
import chatRoute from "./routes/chat";
import { pushNewMessage } from "./lib/push-notifications";
import { notifyNewMessage } from "./lib/notifications";

const app = new Hono();

// CORS middleware - must be first
app.use("/*", async (c, next) => {
  // Handle preflight OPTIONS requests
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  
  await next();
  
  // Add CORS headers to all responses
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
});

app.use(logger());

app.route("/api/auth", authRoute);
app.route("/api/preferences", preferencesRoute);
app.route("/api/services", servicesRoute);
app.route("/api/quotes", quotesRoute);
app.route("/api/projects", projectsRoute);
app.route("/api/ai", aiRoute);
app.route("/api/users", usersRoute);
app.route("/api/upload", uploadRoute);
app.route("/api/notifications", notificationsRoute);
app.route("/api/push", pushRoute);
app.route("/api/chat", chatRoute);

app.get("/", (c) => {
  return c.text("OK");
});

interface ChatMessage {
  type: "message" | "join" | "leave" | "typing" | "system";
  roomId: string;
  userId: string;
  userName: string;
  userRole: string;
  content?: string;
  timestamp: string;
}

interface WebSocketData {
  roomId: string;
  userId: string;
  userName: string;
  userRole: string;
}

// Track active users per room for presence awareness
const roomActiveUsers = new Map<string, Set<string>>();

function getActiveUsersInRoom(roomId: string): string[] {
  const users = roomActiveUsers.get(roomId);
  return users ? Array.from(users) : [];
}

function addUserToRoom(roomId: string, userId: string) {
  if (!roomActiveUsers.has(roomId)) {
    roomActiveUsers.set(roomId, new Set());
  }
  roomActiveUsers.get(roomId)!.add(userId);
}

function removeUserFromRoom(roomId: string, userId: string) {
  const users = roomActiveUsers.get(roomId);
  if (users) {
    users.delete(userId);
    if (users.size === 0) {
      roomActiveUsers.delete(roomId);
    }
  }
}

// Start server with WebSocket support
const server = Bun.serve<WebSocketData>({
  port: 3000,
  fetch(req, server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrade for /ws endpoint
    if (url.pathname === "/ws") {
      const roomId = url.searchParams.get("roomId");
      const userId = url.searchParams.get("userId");
      const userName = url.searchParams.get("userName");
      const userRole = url.searchParams.get("userRole");

      if (!roomId || !userId || !userName || !userRole) {
        return new Response("Missing required parameters", { status: 400 });
      }

      const upgraded = server.upgrade(req, {
        data: { roomId, userId, userName, userRole } as WebSocketData,
      });

      if (upgraded) {
        return undefined;
      }

      return new Response("WebSocket upgrade failed", { status: 500 });
    }

    // Regular HTTP requests handled by Hono
    return app.fetch(req, { env });
  },
  websocket: {
    async open(ws) {
      const { roomId, userId, userName, userRole } = ws.data;
      
      // Subscribe to the room topic
      ws.subscribe(roomId);
      
      // Track active user
      addUserToRoom(roomId, userId);
      
      console.log(`WebSocket opened: ${userName} joined room ${roomId}`);
      
      // Check if this is a staff member joining
      const isStaff = ["staff", "support", "admin"].includes(userRole);
      
      // Save join message to database if staff is joining
      if (isStaff) {
        try {
          // Check if room exists and add system message
          const room = await db.chatRoom.findUnique({ where: { id: roomId } });
          if (room) {
            await db.chatMessage.create({
              data: {
                roomId,
                userId,
                userName,
                userRole,
                content: `${userName} joined the chat`,
                type: "join",
              },
            });
          }
        } catch (error) {
          console.error("Error saving join message:", error);
        }
      }
      
      // Notify others in the room
      const joinMessage: ChatMessage = {
        type: "join",
        roomId: ws.data.roomId,
        userId: ws.data.userId,
        userName: ws.data.userName,
        userRole: ws.data.userRole,
        timestamp: new Date().toISOString(),
      };
      
      ws.publish(roomId, JSON.stringify(joinMessage));
    },
    
    async message(ws, message) {
      const { roomId, userId, userName, userRole } = ws.data;
      
      try {
        const data: ChatMessage = JSON.parse(message.toString());
        
        // Validate message metadata
        if (data.roomId !== roomId || data.userId !== userId) {
          console.error("Invalid message metadata");
          return;
        }
        
        // Add timestamp if not present
        if (!data.timestamp) {
          data.timestamp = new Date().toISOString();
        }
        
        // Save message to database (only for actual messages, not typing indicators)
        if (data.type === "message" && data.content) {
          try {
            // Check if room exists
            const room = await db.chatRoom.findUnique({
              where: { id: roomId },
              include: { members: true },
            });
            
            if (room) {
              // Save the message
              await db.chatMessage.create({
                data: {
                  roomId,
                  userId,
                  userName,
                  userRole,
                  content: data.content,
                  type: "message",
                },
              });
              
              // Get active users in the room to exclude from push notifications
              const activeUserIds = getActiveUsersInRoom(roomId);
              
              // Get project info for notification
              const project = await db.project.findFirst({
                where: { id: room.projectId },
                include: { service: { select: { name: true } } },
              });
              
              // Send push notifications to staff not in the chat
              await pushNewMessage(
                roomId,
                project?.service.name || "Chat",
                userName,
                data.content,
                activeUserIds
              );
              
              // Create dashboard notification for new message
              await notifyNewMessage(
                roomId,
                userName,
                data.content,
                project?.service.name || "Chat"
              );
            }
          } catch (error) {
            console.error("Error saving message to database:", error);
          }
        }
        
        // Broadcast to all subscribers in the room (including sender)
        ws.publish(roomId, JSON.stringify(data));
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    
    close(ws) {
      const { roomId, userId, userName } = ws.data;
      
      // Remove user from active tracking
      removeUserFromRoom(roomId, userId);
      
      console.log(`WebSocket closed: ${userName} left room ${roomId}`);
      
      // Notify others in the room
      const leaveMessage: ChatMessage = {
        type: "leave",
        roomId: ws.data.roomId,
        userId: ws.data.userId,
        userName: ws.data.userName,
        userRole: ws.data.userRole,
        timestamp: new Date().toISOString(),
      };
      
      ws.publish(roomId, JSON.stringify(leaveMessage));
      
      // Unsubscribe from room
      ws.unsubscribe(roomId);
    },
  },
});

console.log(`Server running on http://localhost:${server.port}`);
console.log(`WebSocket available at ws://localhost:${server.port}/ws`);

export default app;



