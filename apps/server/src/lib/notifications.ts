import { db } from "@trojan_projects_zw/db";

type NotificationType = 
  | "user_created"
  | "user_invited"
  | "role_updated"
  | "project_created"
  | "project_updated"
  | "project_accepted"
  | "project_completed"
  | "quote_created"
  | "quote_approved"
  | "quote_rejected"
  | "message_received"
  | "system";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification in the database
 */
export async function createNotification(params: CreateNotificationParams) {
  const { type, title, message, link, metadata } = params;

  try {
    const notification = await db.notification.create({
      data: {
        type,
        title,
        message,
        link: link || null,
        metadata: metadata || null,
      },
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// ============================================
// USER NOTIFICATIONS
// ============================================

export async function notifyUserCreated(user: { id: string; name: string; email: string }) {
  return createNotification({
    type: "user_created",
    title: "New User Registered",
    message: `${user.name} (${user.email}) has created an account`,
    link: `/staff/${user.id}`,
    metadata: { userId: user.id },
  });
}

export async function notifyUserInvited(user: { id: string; name: string; email: string; role: string }, invitedBy: string) {
  return createNotification({
    type: "user_invited",
    title: "New Team Member Invited",
    message: `${user.name} (${user.email}) was invited as ${user.role} by ${invitedBy}`,
    link: `/staff/${user.id}`,
    metadata: { userId: user.id, role: user.role, invitedBy },
  });
}

export async function notifyRoleUpdated(user: { id: string; name: string }, oldRole: string, newRole: string, updatedBy: string) {
  return createNotification({
    type: "role_updated",
    title: "User Role Updated",
    message: `${user.name}'s role changed from ${oldRole} to ${newRole} by ${updatedBy}`,
    link: `/staff/${user.id}`,
    metadata: { userId: user.id, oldRole, newRole, updatedBy },
  });
}

// ============================================
// PROJECT NOTIFICATIONS
// ============================================

export async function notifyProjectCreated(project: { 
  id: string; 
  service: { name: string }; 
  user: { name: string } 
}) {
  return createNotification({
    type: "project_created",
    title: "New Project Created",
    message: `${project.user.name} requested a new project for ${project.service.name}`,
    link: `/projects/${project.id}`,
    metadata: { projectId: project.id },
  });
}

export async function notifyProjectAccepted(project: { 
  id: string; 
  service: { name: string }; 
  user: { name: string } 
}, acceptedBy: string) {
  return createNotification({
    type: "project_accepted",
    title: "Project Accepted",
    message: `Project for ${project.service.name} was accepted by ${acceptedBy}`,
    link: `/projects/${project.id}`,
    metadata: { projectId: project.id, acceptedBy },
  });
}

export async function notifyProjectStatusUpdate(project: { 
  id: string; 
  service: { name: string }; 
  status: string 
}) {
  const statusLabels: Record<string, string> = {
    pending: "Pending",
    starting: "Starting",
    in_progress: "In Progress",
    waiting_for_review: "Waiting for Review",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return createNotification({
    type: "project_updated",
    title: "Project Status Updated",
    message: `Project for ${project.service.name} is now ${statusLabels[project.status] || project.status}`,
    link: `/projects/${project.id}`,
    metadata: { projectId: project.id, status: project.status },
  });
}

export async function notifyProjectCompleted(project: { 
  id: string; 
  service: { name: string }; 
  user: { name: string };
  finalPrice?: number | null;
}) {
  return createNotification({
    type: "project_completed",
    title: "Project Completed",
    message: `Project for ${project.service.name} has been completed for ${project.user.name}${project.finalPrice ? ` ($${project.finalPrice})` : ""}`,
    link: `/projects/${project.id}`,
    metadata: { projectId: project.id },
  });
}

// ============================================
// QUOTE NOTIFICATIONS
// ============================================

export async function notifyQuoteCreated(quote: { 
  id: string; 
  service: { name: string }; 
  user: { name: string };
  location: string;
}) {
  return createNotification({
    type: "quote_created",
    title: "New Quote Request",
    message: `${quote.user.name} requested a quote for ${quote.service.name} in ${quote.location}`,
    link: `/quotes/${quote.id}`,
    metadata: { quoteId: quote.id },
  });
}

export async function notifyQuoteApproved(quote: { 
  id: string; 
  service: { name: string }; 
  user: { name: string };
  estimatedPrice?: number | null;
}) {
  return createNotification({
    type: "quote_approved",
    title: "Quote Approved",
    message: `Quote for ${quote.service.name} has been approved${quote.estimatedPrice ? ` at $${quote.estimatedPrice}` : ""}`,
    link: `/quotes/${quote.id}`,
    metadata: { quoteId: quote.id },
  });
}

export async function notifyQuoteRejected(quote: { 
  id: string; 
  service: { name: string }; 
  user: { name: string };
}) {
  return createNotification({
    type: "quote_rejected",
    title: "Quote Rejected",
    message: `Quote for ${quote.service.name} from ${quote.user.name} was rejected`,
    link: `/quotes/${quote.id}`,
    metadata: { quoteId: quote.id },
  });
}

// ============================================
// MESSAGE NOTIFICATIONS
// ============================================

export async function notifyNewMessage(params: {
  roomId: string;
  projectId: string;
  senderName: string;
  messagePreview: string;
}) {
  return createNotification({
    type: "message_received",
    title: "New Message",
    message: `${params.senderName}: ${params.messagePreview.substring(0, 50)}${params.messagePreview.length > 50 ? "..." : ""}`,
    link: `/projects/${params.projectId}/chat`,
    metadata: { roomId: params.roomId, projectId: params.projectId },
  });
}

// ============================================
// SYSTEM NOTIFICATIONS
// ============================================

export async function notifySystem(title: string, message: string) {
  return createNotification({
    type: "system",
    title,
    message,
  });
}
