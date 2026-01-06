"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Search,
  HelpCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock data - in real app, fetch from API
const openTickets = [
  {
    id: "TKT-001",
    subject: "Solar panel not charging",
    customer: "John Mukamuri",
    email: "john@example.com",
    priority: "high",
    status: "open",
    createdAt: "2 hours ago",
    lastResponse: "Awaiting response",
  },
  {
    id: "TKT-002",
    subject: "CCTV camera offline",
    customer: "Mary Chigumba",
    email: "mary@example.com",
    priority: "medium",
    status: "in_progress",
    createdAt: "5 hours ago",
    lastResponse: "Technician assigned",
  },
  {
    id: "TKT-003",
    subject: "Billing inquiry",
    customer: "Peter Moyo",
    email: "peter@example.com",
    priority: "low",
    status: "open",
    createdAt: "1 day ago",
    lastResponse: "Pending review",
  },
  {
    id: "TKT-004",
    subject: "Installation reschedule request",
    customer: "Sarah Dziva",
    email: "sarah@example.com",
    priority: "medium",
    status: "open",
    createdAt: "1 day ago",
    lastResponse: "New request",
  },
];

const recentChats = [
  {
    id: 1,
    customer: "Gift Ncube",
    avatar: null,
    message: "Hi, I need help with my inverter settings",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    customer: "Brian Chikwanha",
    avatar: null,
    message: "Thank you for the quick response!",
    time: "5 min ago",
    unread: false,
  },
  {
    id: 3,
    customer: "Tendai Moyo",
    avatar: null,
    message: "When will my installation be completed?",
    time: "15 min ago",
    unread: true,
  },
];

const quickResponses = [
  "Thank you for contacting Trojan Projects. How can I help you today?",
  "I'll look into this right away and get back to you shortly.",
  "A technician has been assigned to your case.",
  "Your request has been escalated to our technical team.",
];

export function SupportDashboard() {
  const stats = useMemo(
    () => ({
      openTickets: openTickets.filter((t) => t.status === "open").length,
      inProgress: openTickets.filter((t) => t.status === "in_progress").length,
      resolvedToday: 12,
      avgResponseTime: "15 min",
    }),
    []
  );

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      high: { variant: "destructive", label: "High" },
      medium: { variant: "default", label: "Medium" },
      low: { variant: "secondary", label: "Low" },
    };
    const style = styles[priority] || styles.medium;
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Open Tickets"
          value={stats.openTickets}
          change="2 new today"
          changeType="neutral"
          icon={Ticket}
          iconColor="#F59E0B"
          iconBgColor="#FEF3C7"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          iconColor="#3B82F6"
          iconBgColor="#DBEAFE"
        />
        <StatsCard
          title="Resolved Today"
          value={stats.resolvedToday}
          change="+4 from yesterday"
          changeType="positive"
          icon={CheckCircle}
          iconColor="#10B981"
          iconBgColor="#D1FAE5"
        />
        <StatsCard
          title="Avg. Response Time"
          value={stats.avgResponseTime}
          change="2 min faster"
          changeType="positive"
          icon={MessageSquare}
          iconColor="#8B5CF6"
          iconBgColor="#EDE9FE"
        />
      </div>

      {/* Customer Lookup */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Lookup</CardTitle>
          <CardDescription>Search for customer information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name, email, or phone..." className="pl-10" />
            </div>
            <Button style={{ backgroundColor: TROJAN_NAVY }}>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Open Tickets</CardTitle>
              <CardDescription>Tickets requiring attention</CardDescription>
            </div>
            <Link href="/tickets">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{ticket.id}</span>
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <span className="text-xs text-gray-500">{ticket.createdAt}</span>
                  </div>
                  <h4 className="font-medium mb-1">{ticket.subject}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{ticket.customer}</span>
                      <span>•</span>
                      <span>{ticket.email}</span>
                    </div>
                    <span className="text-xs text-gray-500">{ticket.lastResponse}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Active conversations</CardDescription>
            </div>
            <Badge variant="secondary">
              {recentChats.filter((c) => c.unread).length} new
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <Link key={chat.id} href={`/chat?customer=${chat.id}`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.avatar || undefined} />
                      <AvatarFallback style={{ backgroundColor: chat.unread ? TROJAN_GOLD : "#E5E7EB" }}>
                        {chat.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{chat.customer}</p>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.message}</p>
                    </div>
                    {chat.unread && (
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ backgroundColor: TROJAN_GOLD }}
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/chat">
              <Button variant="outline" className="w-full mt-4">
                Open Chat Console
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Responses */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Responses</CardTitle>
            <CardDescription>Click to copy to clipboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => navigator.clipboard.writeText(response)}
                >
                  {response}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Support Resources</CardTitle>
            <CardDescription>Quick access to common resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/faq">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <HelpCircle size={24} style={{ color: TROJAN_NAVY }} />
                  <span>FAQ Database</span>
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Search size={24} style={{ color: TROJAN_NAVY }} />
                  <span>Service Catalog</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Phone size={24} style={{ color: TROJAN_NAVY }} />
                <span>Call Customer</span>
              </Button>
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Mail size={24} style={{ color: TROJAN_NAVY }} />
                <span>Send Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
