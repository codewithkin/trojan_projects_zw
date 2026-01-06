import { auth } from "@trojan_projects_zw/auth";
import { env } from "@trojan_projects_zw/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import preferencesRoute from "./routes/preferences";
import servicesRoute from "./routes/services";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow configured web origins
      const allowedOrigins = [
        env.CORS_ORIGIN,
        "http://localhost:3001",
        "http://10.255.235.15:3001",
        "http://localhost:8081",
        "http://10.255.235.15:8081"
      ];
      
      if (allowedOrigins.includes(origin)) return origin;
      
      // Allow custom app schemes
      if (origin.startsWith("trojan_projects_zw://")) return origin;
      if (origin.startsWith("exp://")) return origin;
      if (origin.startsWith("mybettertapp://")) return origin;
      
      return null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/preferences", preferencesRoute);
app.route("/api/services", servicesRoute);

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



