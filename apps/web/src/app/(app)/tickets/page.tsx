"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/input";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Ticket type
type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  customer: string;
  email: string;
  category: "technical" | "billing" | "general" | "complaint";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  assignedTo: string | null;
  createdAt: string;
  lastUpdated: string;
  messages: number;
};

// Mock data
const mockTickets: Ticket[] = [
  {
    id: "1",
    ticketNumber: "TKT-2024-001",
    subject: "Solar panel not charging properly",
    customer: "John Mukamuri",
    email: "john@example.com",
    category: "technical",
    priority: "high",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-15 09:30",
    lastUpdated: "2024-01-15 09:30",
    messages: 1,
  },
  {
    id: "2",
    ticketNumber: "TKT-2024-002",
    subject: "Invoice discrepancy",
    customer: "Mary Chigumba",
    email: "mary@example.com",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Rumbidzai K.",
    createdAt: "2024-01-14 14:22",
    lastUpdated: "2024-01-15 08:15",
    messages: 4,
  },
  {
    id: "3",
    ticketNumber: "TKT-2024-003",
    subject: "CCTV camera offline after power outage",
    customer: "Peter Moyo",
    email: "peter@example.com",
    category: "technical",
    priority: "urgent",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-15 11:45",
    lastUpdated: "2024-01-15 11:45",
    messages: 1,
  },
  {
    id: "4",
    ticketNumber: "TKT-2024-004",
    subject: "Request for installation reschedule",
    customer: "Sarah Dziva",
    email: "sarah@example.com",
    category: "general",
    priority: "low",
    status: "waiting",
    assignedTo: "Rumbidzai K.",
    createdAt: "2024-01-13 16:00",
    lastUpdated: "2024-01-14 10:30",
    messages: 3,
  },
  {
    id: "5",
    ticketNumber: "TKT-2024-005",
    subject: "Delayed installation complaint",
    customer: "James Banda",
    email: "james@example.com",
    category: "complaint",
    priority: "high",
    status: "in_progress",
    assignedTo: "Rumbidzai K.",
    createdAt: "2024-01-12 09:15",
    lastUpdated: "2024-01-14 16:45",
    messages: 6,
  },
  {
    id: "6",
    ticketNumber: "TKT-2024-006",
    subject: "Warranty claim for inverter",
    customer: "Grace Mutasa",
    email: "grace@example.com",
    category: "technical",
    priority: "medium",
    status: "resolved",
    assignedTo: "Rumbidzai K.",
    createdAt: "2024-01-10 11:30",
    lastUpdated: "2024-01-13 14:20",
    messages: 5,
  },
];

const getPriorityBadge = (priority: Ticket["priority"]) => {
  const config: Record<Ticket["priority"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    low: { variant: "secondary", label: "Low" },
    medium: { variant: "outline", label: "Medium" },
    high: { variant: "default", label: "High" },
    urgent: { variant: "destructive", label: "Urgent" },
  };
  const { variant, label } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
};

const getStatusBadge = (status: Ticket["status"]) => {
  const config: Record<Ticket["status"], { bg: string; text: string; icon: typeof Clock; label: string }> = {
    open: { bg: "bg-blue-100", text: "text-blue-700", icon: AlertTriangle, label: "Open" },
    in_progress: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "In Progress" },
    waiting: { bg: "bg-purple-100", text: "text-purple-700", icon: Clock, label: "Waiting" },
    resolved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Resolved" },
    closed: { bg: "bg-gray-100", text: "text-gray-700", icon: CheckCircle, label: "Closed" },
  };
  const { bg, text, icon: Icon, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

const getCategoryBadge = (category: Ticket["category"]) => {
  const config: Record<Ticket["category"], { color: string; label: string }> = {
    technical: { color: "#3B82F6", label: "Technical" },
    billing: { color: "#10B981", label: "Billing" },
    general: { color: "#6B7280", label: "General" },
    complaint: { color: "#EF4444", label: "Complaint" },
  };
  const { color, label } = config[category];
  return (
    <span
      className="px-2 py-1 rounded text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
};

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "ticketNumber",
    header: "Ticket #",
    cell: ({ row }) => (
      <span className="font-medium" style={{ color: TROJAN_NAVY }}>
        {row.getValue("ticketNumber")}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <p className="font-medium truncate">{row.getValue("subject")}</p>
        <p className="text-sm text-gray-500">{row.original.customer}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => getCategoryBadge(row.getValue("category")),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => getPriorityBadge(row.getValue("priority")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignee = row.getValue("assignedTo") as string | null;
      if (!assignee) {
        return <span className="text-gray-400">Unassigned</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs" style={{ backgroundColor: TROJAN_GOLD }}>
              {assignee.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{assignee}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "messages",
    header: "Messages",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MessageSquare size={14} className="text-gray-400" />
        <span>{row.getValue("messages")}</span>
      </div>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => <span className="text-sm text-gray-500">{row.getValue("lastUpdated")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Ticket
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Assign
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Resolved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const getFilteredTickets = () => {
    switch (activeTab) {
      case "open":
        return mockTickets.filter((t) => t.status === "open");
      case "my_tickets":
        return mockTickets.filter((t) => t.assignedTo === "Rumbidzai K.");
      case "unassigned":
        return mockTickets.filter((t) => !t.assignedTo);
      case "resolved":
        return mockTickets.filter((t) => t.status === "resolved" || t.status === "closed");
      default:
        return mockTickets;
    }
  };

  const stats = {
    all: mockTickets.length,
    open: mockTickets.filter((t) => t.status === "open").length,
    inProgress: mockTickets.filter((t) => t.status === "in_progress").length,
    unassigned: mockTickets.filter((t) => !t.assignedTo).length,
    urgent: mockTickets.filter((t) => t.priority === "urgent").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
            Support Tickets
          </h1>
          <p className="text-gray-500">Manage customer support requests</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>
                Create a ticket on behalf of a customer.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">Ticket form will be implemented here</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button style={{ backgroundColor: TROJAN_NAVY }}>Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
              {stats.all}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Unassigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unassigned}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tickets ({stats.all})</TabsTrigger>
          <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
          <TabsTrigger value="my_tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned ({stats.unassigned})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={getFilteredTickets()}
            searchPlaceholder="Search tickets..."
            exportFileName="support_tickets"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
