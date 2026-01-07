import { env } from "@trojan_projects_zw/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import authRoute from "./routes/auth";
import preferencesRoute from "./routes/preferences";
import servicesRoute from "./routes/services";
import quotesRoute from "./routes/quotes";
import projectsRoute from "./routes/projects";
import aiRoute from "./routes/ai";
import usersRoute from "./routes/users";
import uploadRoute from "./routes/upload";
import notificationsRoute from "./routes/notifications";

const app = new Hono();

// Log CORS info for debugging
console.log("CORS middleware configured to allow all origins dynamically");

app.use(logger());
app.use(
  "/*",
  cors({
    origin: (origin) => {
      console.log("CORS request from origin:", origin);
      return origin || "*";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.route("/api/auth", authRoute);
app.route("/api/preferences", preferencesRoute);
app.route("/api/services", servicesRoute);
app.route("/api/quotes", quotesRoute);
app.route("/api/projects", projectsRoute);
app.route("/api/ai", aiRoute);
app.route("/api/users", usersRoute);
app.route("/api/upload", uploadRoute);
app.route("/api/notifications", notificationsRoute);

app.get("/", (c) => {
  return c.text("OK");
});

interface ChatMessage {
  type: "message" | "join" | "leave" | "typing";
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
    open(ws) {
      const { roomId, userName } = ws.data;
      
      // Subscribe to the room topic
      ws.subscribe(roomId);
      
      console.log(`WebSocket opened: ${userName} joined room ${roomId}`);
      
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
    
    message(ws, message) {
      const { roomId, userId } = ws.data;
      
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
        
        // Broadcast to all subscribers in the room (including sender)
        ws.publish(roomId, JSON.stringify(data));
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    
    close(ws) {
      const { roomId, userName } = ws.data;
      
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



