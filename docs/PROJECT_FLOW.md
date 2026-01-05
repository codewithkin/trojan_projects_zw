# Project Status Flow Documentation

This document outlines the complete project lifecycle from request to completion, including status transitions and the actions available to both users and the Trojan team.

## Project Statuses

| Status | Description | Who Sets It |
|--------|-------------|-------------|
| `pending` | Project has been requested but not yet started | System (on creation) |
| `underway` | Project is actively being worked on | Trojan Team |
| `completed` | Project work has been finished and verified | User |

---

## Status Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PROJECT LIFECYCLE                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

   USER                                                           TROJAN TEAM
     │                                                                  │
     │  1. Creates Project Request                                      │
     ▼                                                                  │
┌─────────────┐                                                         │
│             │                                                         │
│   PENDING   │◄────────────────── New Project Created ─────────────────┤
│             │                                                         │
└──────┬──────┘                                                         │
       │                                                                │
       │                                                                ▼
       │                                               ┌──────────────────────────┐
       │                                               │ Reviews project request  │
       │                                               │ Assigns team members     │
       │                                               │ Prepares resources       │
       │                                               └───────────┬──────────────┘
       │                                                           │
       │                          Team presses "Start Project"     │
       │                          ─────────────────────────────────┤
       ▼                                                           ▼
┌─────────────┐                                         ┌──────────────────────────┐
│             │                                         │ Works on project         │
│  UNDERWAY   │◄────────────────────────────────────────│ Updates progress         │
│             │                                         │ Communicates with user   │
└──────┬──────┘                                         └───────────┬──────────────┘
       │                                                           │
       │                          Team presses "Mark Ready"        │
       │                          ─────────────────────────────────┤
       │                                                           ▼
       │                                         ┌─────────────────────────────────┐
       │                                         │ Notifies user project is ready  │
       │                                         │ for completion verification     │
       │                                         └─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ User reviews completed work     │
│ Verifies everything is correct  │
│ Presses "Complete Project"      │
└──────────────┬──────────────────┘
               │
               ▼
       ┌─────────────┐
       │             │
       │  COMPLETED  │
       │             │
       └─────────────┘
```

---

## Detailed Status Descriptions

### 1. PENDING Status

**Entry Condition:** User submits a new project request

**User View:**
- Can view project details
- Can edit project request (before team starts)
- Can cancel project request
- Sees "Waiting for team to start"

**Team View:**
- Can view all pending projects
- Can assign team members
- Button: **"Start Project"** → transitions to `underway`
- Can reject project (with reason)

**Available Actions:**

| Role | Action | Button Text | Result |
|------|--------|-------------|--------|
| User | Cancel Request | "Cancel Project" | Project deleted/archived |
| User | Edit Details | "Edit Project" | Update project info |
| Team | Begin Work | "Start Project" | Status → `underway` |
| Team | Reject | "Reject Project" | Project archived with reason |

---

### 2. UNDERWAY Status

**Entry Condition:** Team presses "Start Project"

**User View:**
- Can view project details and progress
- Can view team notes/updates
- Can add comments/questions
- Sees "Project in Progress"
- Cannot edit project details

**Team View:**
- Can update progress notes
- Can upload work photos/documentation
- Can communicate with user
- Button: **"Mark Ready"** → notifies user for completion
- Can pause project (if needed)

**Available Actions:**

| Role | Action | Button Text | Result |
|------|--------|-------------|--------|
| User | Add Comment | "Add Comment" | Post message to team |
| User | View Progress | - | See progress updates |
| Team | Update Progress | "Add Update" | Post progress note |
| Team | Upload Media | "Add Photos" | Attach images/docs |
| Team | Signal Completion | "Mark Ready" | Notify user to verify |
| Team | Pause | "Pause Project" | Temporarily halt work |

---

### 3. COMPLETED Status

**Entry Condition:** User presses "Complete Project" after verifying work

**User View:**
- Can view full project history
- Can leave review/rating
- Can request follow-up service
- Sees "Project Completed" with completion date

**Team View:**
- Can view project archive
- Can view user review
- Can export project summary

**Available Actions:**

| Role | Action | Button Text | Result |
|------|--------|-------------|--------|
| User | Rate Service | "Leave Review" | Submit rating & feedback |
| User | Request Follow-up | "Request Follow-up" | Create new related project |
| Team | Archive | "Archive" | Move to archived projects |
| Team | Export | "Export Summary" | Generate project report |

---

## Status Transition Rules

### Allowed Transitions

```
pending  ──► underway  (Team: Start Project)
pending  ──► cancelled (User: Cancel Project)
pending  ──► rejected  (Team: Reject Project)

underway ──► completed (User: Complete Project)
underway ──► paused    (Team: Pause Project)

paused   ──► underway  (Team: Resume Project)
```

### Not Allowed

- User cannot mark project as `underway` (only team can start)
- Team cannot mark project as `completed` (only user can complete)
- Cannot skip from `pending` directly to `completed`
- Cannot reopen `completed` projects (create new instead)

---

## API Endpoints

### Status Transition Endpoints

```typescript
// Team starts a project
POST /api/projects/:id/start
Body: { teamMemberId: string, notes?: string }
Result: status → "underway"

// Team marks project ready for completion
POST /api/projects/:id/ready
Body: { completionNotes: string }
Result: Sends notification to user

// User completes project
POST /api/projects/:id/complete
Body: { rating?: number, feedback?: string }
Result: status → "completed"

// Team rejects project
POST /api/projects/:id/reject
Body: { reason: string }
Result: status → "rejected"

// User cancels project (only in pending)
DELETE /api/projects/:id
Result: Project cancelled/archived
```

---

## UI Components Needed

### User Interface

1. **ProjectStatusBadge** - Visual indicator of current status
2. **ProjectTimeline** - Shows status history and updates
3. **CompleteProjectModal** - Confirmation with optional rating
4. **ProjectProgressCard** - Shows current progress and team updates

### Team/Admin Interface

1. **PendingProjectsQueue** - List of projects awaiting start
2. **StartProjectModal** - Assign team and add notes
3. **ProjectUpdateForm** - Add progress updates
4. **MarkReadyButton** - Signal user for completion verification

---

## Notifications

| Event | Recipient | Message |
|-------|-----------|---------|
| New project created | Team | "New project request from [User]" |
| Project started | User | "Your project has been started by [Team Member]" |
| Progress update | User | "New update on your project" |
| Project ready | User | "Your project is ready for review - please verify completion" |
| Project completed | Team | "[User] has marked project as completed" |
| Review received | Team | "[User] left a review on project [Project]" |

---

## Database Schema Changes

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      ProjectStatus @default(PENDING)
  
  // User who requested
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Assigned team member (when underway)
  assignedToId String?
  assignedTo   User?   @relation("AssignedProjects", fields: [assignedToId], references: [id])
  
  // Timestamps
  createdAt   DateTime @default(now())
  startedAt   DateTime?
  completedAt DateTime?
  
  // User feedback
  rating      Int?     @db.SmallInt
  feedback    String?
  
  // Project updates/timeline
  updates     ProjectUpdate[]
  
  @@map("projects")
}

enum ProjectStatus {
  PENDING
  UNDERWAY
  COMPLETED
  CANCELLED
  REJECTED
  PAUSED
}

model ProjectUpdate {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  
  type      UpdateType
  content   String
  
  createdAt DateTime @default(now())
  
  @@map("project_updates")
}

enum UpdateType {
  NOTE
  STATUS_CHANGE
  PHOTO
  DOCUMENT
  COMMENT
}
```

---

## Implementation Priority

1. **Phase 1: Basic Flow**
   - Add status field to projects
   - Implement status transition endpoints
   - Add status badges to project cards

2. **Phase 2: Team Actions**
   - Create team dashboard
   - Implement "Start Project" and "Mark Ready" buttons
   - Add progress update functionality

3. **Phase 3: User Completion**
   - Add "Complete Project" button for users
   - Implement rating system
   - Add completion confirmation modal

4. **Phase 4: Notifications**
   - Set up push notifications
   - Add email notifications
   - Create in-app notification center

5. **Phase 5: Timeline & History**
   - Implement project update timeline
   - Add photo/document uploads
   - Create project history view
