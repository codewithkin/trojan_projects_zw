"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Star,
  Briefcase,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Staff type
type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "support";
  department: string;
  status: "active" | "inactive" | "on_leave";
  projectsCompleted: number;
  rating: number;
  joinDate: string;
};

// Mock data
const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Tendai Moyo",
    email: "tendai@trojanprojects.co.zw",
    phone: "+263 77 111 2222",
    role: "staff",
    department: "Solar Installation",
    status: "active",
    projectsCompleted: 24,
    rating: 4.9,
    joinDate: "2022-03-15",
  },
  {
    id: "2",
    name: "Gift Ncube",
    email: "gift@trojanprojects.co.zw",
    phone: "+263 77 222 3333",
    role: "staff",
    department: "Electrical",
    status: "active",
    projectsCompleted: 21,
    rating: 4.8,
    joinDate: "2022-06-20",
  },
  {
    id: "3",
    name: "Brian Chikwanha",
    email: "brian@trojanprojects.co.zw",
    phone: "+263 77 333 4444",
    role: "staff",
    department: "CCTV & Security",
    status: "active",
    projectsCompleted: 18,
    rating: 4.7,
    joinDate: "2022-09-10",
  },
  {
    id: "4",
    name: "Rumbidzai Kachingwe",
    email: "rumbi@trojanprojects.co.zw",
    phone: "+263 77 444 5555",
    role: "support",
    department: "Customer Support",
    status: "active",
    projectsCompleted: 0,
    rating: 4.6,
    joinDate: "2023-01-05",
  },
  {
    id: "5",
    name: "Tapiwa Zimuto",
    email: "tapiwa@trojanprojects.co.zw",
    phone: "+263 77 555 6666",
    role: "admin",
    department: "Management",
    status: "active",
    projectsCompleted: 45,
    rating: 5.0,
    joinDate: "2021-01-10",
  },
  {
    id: "6",
    name: "Farai Mutendi",
    email: "farai@trojanprojects.co.zw",
    phone: "+263 77 666 7777",
    role: "staff",
    department: "Solar Installation",
    status: "on_leave",
    projectsCompleted: 15,
    rating: 4.5,
    joinDate: "2023-04-15",
  },
];

const getRoleBadge = (role: Staff["role"]) => {
  const config: Record<Staff["role"], { variant: "default" | "secondary" | "destructive"; icon: typeof Shield; label: string }> = {
    admin: { variant: "destructive", icon: Shield, label: "Admin" },
    staff: { variant: "default", icon: Briefcase, label: "Staff" },
    support: { variant: "secondary", icon: Phone, label: "Support" },
  };
  const { variant, icon: Icon, label } = config[role];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon size={12} />
      {label}
    </Badge>
  );
};

const getStatusBadge = (status: Staff["status"]) => {
  const config: Record<Staff["status"], { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
    inactive: { bg: "bg-gray-100", text: "text-gray-700", label: "Inactive" },
    on_leave: { bg: "bg-yellow-100", text: "text-yellow-700", label: "On Leave" },
  };
  const { bg, text, label } = config[status];
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Staff Member",
    cell: ({ row }) => {
      const staff = row.original;
      const initials = staff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{staff.name}</p>
            <p className="text-sm text-gray-500">{staff.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => getRoleBadge(row.getValue("role")),
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "projectsCompleted",
    header: "Projects",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("projectsCompleted")}</span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;
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
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Staff
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Staff
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredStaff =
    activeTab === "all"
      ? mockStaff
      : mockStaff.filter((s) => s.role === activeTab);

  const stats = {
    total: mockStaff.length,
    active: mockStaff.filter((s) => s.status === "active").length,
    avgRating: (
      mockStaff.reduce((sum, s) => sum + s.rating, 0) / mockStaff.length
    ).toFixed(1),
    totalProjects: mockStaff.reduce((sum, s) => sum + s.projectsCompleted, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
            Staff
          </h1>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new team member to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">Staff form will be implemented here</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button style={{ backgroundColor: TROJAN_NAVY }}>Add Staff</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
              {stats.total}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                {stats.avgRating}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
              {stats.totalProjects}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({mockStaff.length})</TabsTrigger>
          <TabsTrigger value="admin">
            Admins ({mockStaff.filter((s) => s.role === "admin").length})
          </TabsTrigger>
          <TabsTrigger value="staff">
            Staff ({mockStaff.filter((s) => s.role === "staff").length})
          </TabsTrigger>
          <TabsTrigger value="support">
            Support ({mockStaff.filter((s) => s.role === "support").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredStaff}
            searchKey="name"
            searchPlaceholder="Search staff..."
            exportFileName="staff"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
