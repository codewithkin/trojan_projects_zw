"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  CheckCircle,
  Calendar,
  Star,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/stats-card";
import { Badge } from "@/components/ui/badge";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock data - in real app, fetch from API based on current user
const assignedProjects = [
  {
    id: "PRJ-001",
    title: "5KVA Solar Installation",
    customer: "John Mukamuri",
    location: "Greendale, Mutare",
    dueDate: "2024-01-20",
    status: "in_progress",
    progress: 65,
    priority: "high",
  },
  {
    id: "PRJ-002",
    title: "CCTV 8-Camera Setup",
    customer: "Mary Chigumba",
    location: "Dangamvura, Mutare",
    dueDate: "2024-01-22",
    status: "pending",
    progress: 0,
    priority: "medium",
  },
  {
    id: "PRJ-003",
    title: "Electric Fence Repair",
    customer: "Peter Moyo",
    location: "Chikanga, Mutare",
    dueDate: "2024-01-18",
    status: "in_progress",
    progress: 80,
    priority: "high",
  },
  {
    id: "PRJ-004",
    title: "Inverter Maintenance",
    customer: "Sarah Dziva",
    location: "Fairbridge, Mutare",
    dueDate: "2024-01-25",
    status: "pending",
    progress: 0,
    priority: "low",
  },
];

const upcomingSchedule = [
  { time: "09:00 AM", title: "Solar Panel Inspection", customer: "John M.", location: "Greendale" },
  { time: "11:30 AM", title: "CCTV Site Survey", customer: "Mary C.", location: "Dangamvura" },
  { time: "02:00 PM", title: "Team Meeting", customer: "", location: "Office" },
  { time: "04:00 PM", title: "Electric Fence Completion", customer: "Peter M.", location: "Chikanga" },
];

const performanceMetrics = {
  projectsCompleted: 24,
  projectsTarget: 30,
  rating: 4.8,
  onTimeDelivery: 92,
  customerSatisfaction: 96,
};

export function StaffDashboard() {
  const stats = useMemo(
    () => ({
      assignedProjects: assignedProjects.length,
      inProgress: assignedProjects.filter((p) => p.status === "in_progress").length,
      pendingStart: assignedProjects.filter((p) => p.status === "pending").length,
      completedThisMonth: 8,
    }),
    []
  );

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      high: { variant: "destructive", label: "High Priority" },
      medium: { variant: "default", label: "Medium" },
      low: { variant: "secondary", label: "Low" },
    };
    const style = styles[priority] || styles.medium;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      in_progress: "#3B82F6",
      pending: "#F59E0B",
      completed: "#10B981",
    };
    return colors[status] || "#6B7280";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
            Good morning! 👋
          </h2>
          <p className="text-gray-500">Here&apos;s your work overview for today</p>
        </div>
        <Link href="/calendar">
          <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Assigned Projects"
          value={stats.assignedProjects}
          icon={Briefcase}
          iconColor={TROJAN_NAVY}
          iconBgColor="#E0E7FF"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          iconColor="#3B82F6"
          iconBgColor="#DBEAFE"
        />
        <StatsCard
          title="Pending Start"
          value={stats.pendingStart}
          icon={Target}
          iconColor="#F59E0B"
          iconBgColor="#FEF3C7"
        />
        <StatsCard
          title="Completed This Month"
          value={stats.completedThisMonth}
          change="+3 from last month"
          changeType="positive"
          icon={CheckCircle}
          iconColor="#10B981"
          iconBgColor="#D1FAE5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Assigned Projects</CardTitle>
              <CardDescription>Projects requiring your attention</CardDescription>
            </div>
            <Link href="/my-work">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{project.title}</h4>
                        {getPriorityBadge(project.priority)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {project.customer} • {project.location}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">Due: {project.dueDate}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress
                      value={project.progress}
                      className="h-2"
                      style={
                        {
                          "--progress-foreground": getStatusColor(project.status),
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-sm text-gray-500 w-20 shrink-0">{item.time}</div>
                  <div className="flex-1 border-l-2 border-gray-200 pl-4 pb-4">
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.customer && (
                      <p className="text-xs text-gray-500">
                        {item.customer} • {item.location}
                      </p>
                    )}
                    {!item.customer && <p className="text-xs text-gray-500">{item.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
          <CardDescription>Monthly performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Projects Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Monthly Target</span>
                <span className="text-sm font-medium">
                  {performanceMetrics.projectsCompleted}/{performanceMetrics.projectsTarget}
                </span>
              </div>
              <Progress
                value={(performanceMetrics.projectsCompleted / performanceMetrics.projectsTarget) * 100}
                className="h-3"
              />
              <p className="text-xs text-gray-500">
                {performanceMetrics.projectsTarget - performanceMetrics.projectsCompleted} more to reach target
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{performanceMetrics.rating}</p>
                <p className="text-xs text-gray-500">Avg. Rating</p>
              </div>
            </div>

            {/* On-time Delivery */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{performanceMetrics.onTimeDelivery}%</p>
                <p className="text-xs text-gray-500">On-time Delivery</p>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{performanceMetrics.customerSatisfaction}%</p>
                <p className="text-xs text-gray-500">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
