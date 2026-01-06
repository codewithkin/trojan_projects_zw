"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Event type
type CalendarEvent = {
  id: string;
  title: string;
  type: "installation" | "maintenance" | "consultation" | "meeting";
  customer?: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
};

// Mock events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "5KVA Solar Installation",
    type: "installation",
    customer: "John Mukamuri",
    location: "123 Greendale, Mutare",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "16:00",
    status: "scheduled",
  },
  {
    id: "2",
    title: "CCTV System Check",
    type: "maintenance",
    customer: "Mary Chigumba",
    location: "45 Dangamvura, Mutare",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "11:00",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Team Meeting",
    type: "meeting",
    location: "Office",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
  },
  {
    id: "4",
    title: "Solar Consultation",
    type: "consultation",
    customer: "Peter Moyo",
    location: "78 Chikanga, Mutare",
    date: "2024-01-16",
    startTime: "10:00",
    endTime: "11:30",
    status: "scheduled",
  },
  {
    id: "5",
    title: "Electric Fence Repair",
    type: "maintenance",
    customer: "Sarah Dziva",
    location: "22 Fairbridge, Mutare",
    date: "2024-01-17",
    startTime: "08:00",
    endTime: "12:00",
    status: "scheduled",
  },
  {
    id: "6",
    title: "Inverter Installation",
    type: "installation",
    customer: "James Banda",
    location: "99 Sakubva, Mutare",
    date: "2024-01-18",
    startTime: "09:00",
    endTime: "14:00",
    status: "scheduled",
  },
  {
    id: "7",
    title: "Weekly Review",
    type: "meeting",
    location: "Office",
    date: "2024-01-19",
    startTime: "16:00",
    endTime: "17:00",
    status: "scheduled",
  },
];

const eventTypeColors: Record<CalendarEvent["type"], { bg: string; text: string; border: string }> = {
  installation: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  maintenance: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  consultation: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  meeting: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)); // January 15, 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 0, 15));
  const [view, setView] = useState<"month" | "week">("week");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return mockEvents.filter((event) => event.date === dateKey);
  };

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const monthDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const navigatePrev = () => {
    if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const navigateNext = () => {
    if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
            Calendar
          </h1>
          <p className="text-gray-500">Manage your schedule and appointments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Schedule a new appointment or task.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">Event form will be implemented here</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button style={{ backgroundColor: TROJAN_NAVY }}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={navigatePrev}>
                <ChevronLeft size={16} />
              </Button>
              <h2 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button
                variant={view === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week View */}
            {view === "week" && (
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {weekDays.map((date) => {
                  const events = getEventsForDate(date);
                  const isSelected = selectedDate && formatDateKey(date) === formatDateKey(selectedDate);
                  const isToday = formatDateKey(date) === formatDateKey(new Date(2024, 0, 15));

                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "min-h-[120px] p-2 rounded-lg border cursor-pointer transition-colors",
                        isSelected ? "border-2 border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                        isToday && !isSelected && "bg-yellow-50"
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isToday && "text-blue-600"
                          )}
                        >
                          {date.getDate()}
                        </span>
                        {events.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {events.length}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1 rounded truncate",
                              eventTypeColors[event.type].bg,
                              eventTypeColors[event.type].text
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Month View */}
            {view === "month" && (
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {monthDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="p-2" />;
                  }

                  const events = getEventsForDate(date);
                  const isSelected = selectedDate && formatDateKey(date) === formatDateKey(selectedDate);

                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "p-2 rounded-lg cursor-pointer transition-colors min-h-[60px]",
                        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                      )}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="text-sm">{date.getDate()}</span>
                      {events.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {events.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "w-2 h-2 rounded-full",
                                eventTypeColors[event.type].bg
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm">No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-4 rounded-lg border-l-4",
                      eventTypeColors[event.type].bg,
                      eventTypeColors[event.type].border
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={eventTypeColors[event.type].text}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                    <h4 className="font-medium mb-2">{event.title}</h4>
                    {event.customer && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User size={14} />
                        {event.customer}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Type Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm font-medium text-gray-500">Event Types:</span>
            {Object.entries(eventTypeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", colors.bg)} />
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
