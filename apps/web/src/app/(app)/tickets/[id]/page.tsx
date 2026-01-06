"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Send,
  Paperclip,
  Phone,
  Mail,
  ShoppingCart,
  ExternalLink,
  Edit,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock ticket data
const ticketData = {
  id: "TKT-2024-001",
  subject: "Inverter showing error code E04",
  status: "open",
  priority: "high",
  category: "Technical Support",
  createdAt: "2024-01-10 09:30 AM",
  updatedAt: "2024-01-10 02:15 PM",
  customer: {
    name: "John Mukamuri",
    email: "john.mukamuri@example.com",
    phone: "+263 77 123 4567",
    avatar: "",
    initials: "JM",
  },
  relatedOrder: {
    id: "ORD-2023-089",
    service: "3KVA Inverter System",
    date: "2023-11-20",
    status: "completed",
  },
  assignedTo: {
    name: "Support Agent",
    avatar: "",
    initials: "SA",
  },
};

const messages = [
  {
    id: 1,
    sender: "customer",
    senderName: "John Mukamuri",
    content:
      "Hi, my inverter has been showing error code E04 since this morning. The display keeps flashing and it's not charging the batteries properly.",
    timestamp: "2024-01-10 09:30 AM",
    avatar: "",
    initials: "JM",
  },
  {
    id: 2,
    sender: "agent",
    senderName: "Support Agent",
    content:
      "Hello John, I'm sorry to hear about the issue with your inverter. Error code E04 typically indicates a battery voltage issue. Can you please check if all battery connections are secure?",
    timestamp: "2024-01-10 09:45 AM",
    avatar: "",
    initials: "SA",
  },
  {
    id: 3,
    sender: "customer",
    senderName: "John Mukamuri",
    content:
      "I checked the connections and they all seem tight. The batteries were replaced 6 months ago.",
    timestamp: "2024-01-10 10:15 AM",
    avatar: "",
    initials: "JM",
  },
  {
    id: 4,
    sender: "agent",
    senderName: "Support Agent",
    content:
      "Thank you for checking. Based on the information, it could be a battery cell issue or an inverter sensor problem. I'll schedule a technician visit to diagnose the problem. Would tomorrow between 9 AM - 12 PM work for you?",
    timestamp: "2024-01-10 10:30 AM",
    avatar: "",
    initials: "SA",
  },
  {
    id: 5,
    sender: "customer",
    senderName: "John Mukamuri",
    content: "Yes, tomorrow morning works. Please send the technician as early as possible.",
    timestamp: "2024-01-10 02:15 PM",
    avatar: "",
    initials: "JM",
  },
];

const internalNotes = [
  {
    id: 1,
    author: "Support Agent",
    content: "Customer has a 3KVA inverter installed in Nov 2023. Still under warranty.",
    timestamp: "2024-01-10 09:40 AM",
  },
  {
    id: 2,
    author: "Support Agent",
    content: "Scheduled technician Tendai Moyo for site visit tomorrow 9 AM.",
    timestamp: "2024-01-10 10:35 AM",
  },
];

const statusColors: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  open: { bg: "#FEF3C7", text: "#D97706", icon: AlertTriangle },
  "in-progress": { bg: "#DBEAFE", text: "#2563EB", icon: Clock },
  resolved: { bg: "#D1FAE5", text: "#059669", icon: CheckCircle },
  closed: { bg: "#E5E7EB", text: "#6B7280", icon: XCircle },
};

const priorityColors: Record<string, { bg: string; text: string }> = {
  high: { bg: "#FEE2E2", text: "#DC2626" },
  medium: { bg: "#FEF3C7", text: "#D97706" },
  low: { bg: "#E5E7EB", text: "#6B7280" },
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState(ticketData.status);
  const [priority, setPriority] = useState(ticketData.priority);
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [messagesList, setMessagesList] = useState(messages);
  const [notesList, setNotesList] = useState(internalNotes);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messagesList.length + 1,
      sender: "agent",
      senderName: "Support Agent",
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      avatar: "",
      initials: "SA",
    };

    setMessagesList([...messagesList, message]);
    setNewMessage("");
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: notesList.length + 1,
      author: "Support Agent",
      content: newNote,
      timestamp: new Date().toLocaleString(),
    };

    setNotesList([...notesList, note]);
    setNewNote("");
  };

  const StatusIcon = statusColors[status]?.icon || AlertTriangle;

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold" style={{ color: TROJAN_NAVY }}>
                {ticketData.id}
              </h1>
              <Badge
                style={{
                  backgroundColor: statusColors[status]?.bg,
                  color: statusColors[status]?.text,
                }}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
              </Badge>
              <Badge
                style={{
                  backgroundColor: priorityColors[priority]?.bg,
                  color: priorityColors[priority]?.text,
                }}
              >
                {priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-gray-500 text-sm">{ticketData.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Conversation */}
        <Card className="lg:col-span-2 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === "agent" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="text-xs">{msg.initials}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[70%] ${msg.sender === "agent" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{msg.senderName}</span>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.sender === "agent"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        style={msg.sender === "agent" ? { backgroundColor: TROJAN_NAVY } : {}}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t flex-shrink-0">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your response..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[80px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{ backgroundColor: TROJAN_NAVY }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6 overflow-y-auto">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={ticketData.customer.avatar} />
                  <AvatarFallback>{ticketData.customer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{ticketData.customer.name}</p>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{ticketData.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{ticketData.customer.phone}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Related Order */}
          {ticketData.relatedOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Related Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{ticketData.relatedOrder.id}</span>
                    <Badge variant="secondary">
                      {ticketData.relatedOrder.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{ticketData.relatedOrder.service}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Completed: {ticketData.relatedOrder.date}
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  View Order
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span>{ticketData.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{ticketData.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span>{ticketData.updatedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Assigned To</span>
                  <span>{ticketData.assignedTo.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {notesList.map((note) => (
                  <div key={note.id} className="p-2 rounded bg-yellow-50 text-sm">
                    <p className="text-gray-700">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {note.author} • {note.timestamp}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-sm"
                  onKeyPress={(e) => e.key === "Enter" && addNote()}
                />
                <Button size="sm" variant="outline" onClick={addNote}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
