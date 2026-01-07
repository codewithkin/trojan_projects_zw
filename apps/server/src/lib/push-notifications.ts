import { db } from "@trojan_projects_zw/db";
import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

// Create a new Expo SDK client
const expo = new Expo();

// ============================================
// PUSH TOKEN MANAGEMENT
// ============================================

/**
 * Register a push token for a user
 */
export async function registerPushToken(params: {
  userId: string;
  token: string;
  platform: string;
  deviceId?: string;
}) {
  const { userId, token, platform, deviceId } = params;

  // Validate the token format
  if (!Expo.isExpoPushToken(token)) {
    throw new Error("Invalid Expo push token");
  }

  try {
    // Upsert the token (update if exists, create if not)
    const pushToken = await db.pushToken.upsert({
      where: { token },
      update: {
        userId,
        platform,
        deviceId: deviceId || null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        token,
        platform,
        deviceId: deviceId || null,
      },
    });

    return pushToken;
  } catch (error) {
    console.error("Error registering push token:", error);
    throw error;
  }
}

/**
 * Remove a push token
 */
export async function removePushToken(token: string) {
  try {
    await db.pushToken.delete({
      where: { token },
    });
  } catch (error) {
    // Token might not exist, that's ok
    console.error("Error removing push token:", error);
  }
}

/**
 * Get all push tokens for a user
 */
export async function getUserPushTokens(userId: string) {
  return db.pushToken.findMany({
    where: { userId },
    select: { token: true, platform: true },
  });
}

/**
 * Get all push tokens for staff members
 */
export async function getStaffPushTokens() {
  // Get all staff/support/admin users
  const staffUsers = await db.user.findMany({
    where: {
      role: { in: ["staff", "support", "admin"] },
    },
    select: { id: true },
  });

  const userIds = staffUsers.map((u) => u.id);

  return db.pushToken.findMany({
    where: { userId: { in: userIds } },
    select: { token: true, userId: true, platform: true },
  });
}

// ============================================
// PUSH NOTIFICATION SENDING
// ============================================

interface SendPushParams {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  channelId?: string;
}

/**
 * Send push notifications to multiple tokens
 */
export async function sendPushNotifications(params: SendPushParams) {
  const { tokens, title, body, data, sound = "default", badge, channelId } = params;

  // Filter out invalid tokens
  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));

  if (validTokens.length === 0) {
    console.log("No valid push tokens to send to");
    return [];
  }

  // Create the messages
  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound,
    title,
    body,
    data,
    badge,
    channelId,
  }));

  // Send in chunks (Expo recommends max 100 per request)
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Error sending push notification chunk:", error);
    }
  }

  // Handle failed tickets (remove invalid tokens)
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    if (ticket.status === "error") {
      // If the error is related to device not registered, remove the token
      if (
        ticket.details?.error === "DeviceNotRegistered" ||
        ticket.details?.error === "InvalidCredentials"
      ) {
        const failedToken = validTokens[i];
        if (failedToken) {
          console.log(`Removing invalid push token: ${failedToken}`);
          await removePushToken(failedToken);
        }
      }
    }
  }

  return tickets;
}

// ============================================
// HIGH-LEVEL NOTIFICATION FUNCTIONS
// ============================================

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(params: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) {
  const tokens = await getUserPushTokens(params.userId);
  
  if (tokens.length === 0) {
    console.log(`No push tokens found for user ${params.userId}`);
    return;
  }

  return sendPushNotifications({
    tokens: tokens.map((t) => t.token),
    title: params.title,
    body: params.body,
    data: params.data,
  });
}

/**
 * Send push notification to all staff members
 */
export async function sendPushToStaff(params: {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  excludeUserIds?: string[];
}) {
  const allTokens = await getStaffPushTokens();
  
  // Filter out excluded users
  const tokens = params.excludeUserIds
    ? allTokens.filter((t) => !params.excludeUserIds!.includes(t.userId))
    : allTokens;

  if (tokens.length === 0) {
    console.log("No push tokens found for staff members");
    return;
  }

  return sendPushNotifications({
    tokens: tokens.map((t) => t.token),
    title: params.title,
    body: params.body,
    data: params.data,
    channelId: "staff-notifications",
  });
}

/**
 * Send push notification for new project
 */
export async function pushNewProject(project: {
  id: string;
  service: { name: string };
  user: { name: string };
  location: string;
}) {
  return sendPushToStaff({
    title: "New Project Request",
    body: `${project.user.name} requested ${project.service.name} in ${project.location}`,
    data: {
      type: "project",
      projectId: project.id,
    },
  });
}

/**
 * Send push notification for new quote
 */
export async function pushNewQuote(quote: {
  id: string;
  service: { name: string };
  user: { name: string };
  location: string;
}) {
  return sendPushToStaff({
    title: "New Quote Request",
    body: `${quote.user.name} wants a quote for ${quote.service.name} in ${quote.location}`,
    data: {
      type: "quote",
      quoteId: quote.id,
    },
  });
}

/**
 * Send push notification for new message
 * Only sends to staff members who are NOT currently in the chat
 */
export async function pushNewMessage(params: {
  roomId: string;
  projectId: string;
  senderName: string;
  senderUserId: string;
  messagePreview: string;
  activeUserIds: string[]; // Users currently in the chat
}) {
  const { roomId, projectId, senderName, senderUserId, messagePreview, activeUserIds } = params;

  // Get chat room members
  const members = await db.chatMember.findMany({
    where: { roomId },
    select: { userId: true },
  });

  // Get tokens for members who are:
  // 1. Staff members
  // 2. Not the sender
  // 3. Not currently active in the chat
  const staffUsers = await db.user.findMany({
    where: {
      id: { in: members.map((m) => m.userId) },
      role: { in: ["staff", "support", "admin"] },
    },
    select: { id: true },
  });

  const eligibleUserIds = staffUsers
    .map((u) => u.id)
    .filter((id) => id !== senderUserId && !activeUserIds.includes(id));

  if (eligibleUserIds.length === 0) {
    return;
  }

  const tokens = await db.pushToken.findMany({
    where: { userId: { in: eligibleUserIds } },
    select: { token: true },
  });

  if (tokens.length === 0) {
    return;
  }

  return sendPushNotifications({
    tokens: tokens.map((t) => t.token),
    title: `New message from ${senderName}`,
    body: messagePreview.substring(0, 100),
    data: {
      type: "message",
      roomId,
      projectId,
    },
    channelId: "messages",
  });
}
