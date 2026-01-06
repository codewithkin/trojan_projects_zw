import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "bun";

interface ChatMessage {
  type: "message" | "join" | "leave" | "typing";
  roomId: string;
  userId: string;
  userName: string;
  userRole: string;
  content?: string;
  timestamp: string;
}

interface RoomClient {
  ws: WebSocket;
  userId: string;
  userName: string;
  userRole: string;
}

// Store rooms with their clients
const rooms = new Map<string, Set<RoomClient>>();

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws: WebSocket, roomId: string, userId: string, userName: string, userRole: string) => {
    console.log(`User ${userName} (${userId}) joined room ${roomId}`);

    const client: RoomClient = { ws, userId, userName, userRole };

    // Add client to room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    const room = rooms.get(roomId)!;
    room.add(client);

    // Notify room about new user
    const joinMessage: ChatMessage = {
      type: "join",
      roomId,
      userId,
      userName,
      userRole,
      timestamp: new Date().toISOString(),
    };
    broadcastToRoom(roomId, joinMessage, userId);

    // Handle incoming messages
    ws.on("message", (data: Buffer) => {
      try {
        const message: ChatMessage = JSON.parse(data.toString());

        // Validate message
        if (message.roomId !== roomId || message.userId !== userId) {
          console.error("Invalid message metadata");
          return;
        }

        // Broadcast to all clients in the room
        broadcastToRoom(roomId, message, userId);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // Handle disconnection
    ws.on("close", () => {
      console.log(`User ${userName} (${userId}) left room ${roomId}`);

      // Remove client from room
      room.delete(client);
      if (room.size === 0) {
        rooms.delete(roomId);
      }

      // Notify room about user leaving
      const leaveMessage: ChatMessage = {
        type: "leave",
        roomId,
        userId,
        userName,
        userRole,
        timestamp: new Date().toISOString(),
      };
      broadcastToRoom(roomId, leaveMessage, userId);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
    });
  });

  return wss;
}

// Broadcast message to all clients in a room
function broadcastToRoom(roomId: string, message: ChatMessage, senderId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);

  room.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      // Send to all clients (including sender for confirmation)
      client.ws.send(messageStr);
    }
  });
}

export { wss };
