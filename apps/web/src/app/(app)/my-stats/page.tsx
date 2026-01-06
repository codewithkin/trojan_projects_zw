"use client";

import {
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  Calendar,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock data
const monthlyPerformance = [
  { month: "Aug", projects: 4, target: 5, rating: 4.6 },
  { month: "Sep", projects: 5, target: 5, rating: 4.7 },
  { month: "Oct", projects: 6, target: 5, rating: 4.8 },
  { month: "Nov", projects: 5, target: 5, rating: 4.7 },
  { month: "Dec", projects: 7, target: 6, rating: 4.9 },
  { month: "Jan", projects: 4, target: 6, rating: 4.8 },
];

const skillMetrics = [
  { skill: "Technical", value: 92, fullMark: 100 },
  { skill: "Punctuality", value: 88, fullMark: 100 },
  { skill: "Communication", value: 85, fullMark: 100 },
  { skill: "Quality", value: 95, fullMark: 100 },
  { skill: "Speed", value: 82, fullMark: 100 },
  { skill: "Safety", value: 98, fullMark: 100 },
];

const recentReviews = [
  {
    id: 1,
    customer: "John Mukamuri",
    project: "5KVA Solar Installation",
    rating: 5,
    comment: "Excellent work! Very professional and completed ahead of schedule.",
    date: "2024-01-12",
  },
  {
    id: 2,
    customer: "Sarah Dziva",
    project: "Inverter 3KVA",
    rating: 5,
    comment: "Great job explaining everything. System works perfectly.",
    date: "2024-01-08",
  },
  {
    id: 3,
    customer: "Peter Moyo",
    project: "Electric Fence Repair",
    rating: 4,
    comment: "Good work, just took a bit longer than expected.",
    date: "2024-01-05",
  },
];

const achievements = [
  {
    id: 1,
    title: "Top Performer",
    description: "Highest rated technician in December 2023",
    icon: Award,
    color: TROJAN_GOLD,
    date: "Dec 2023",
  },
  {
    id: 2,
    title: "100% On-Time",
    description: "Completed all projects on time for 3 months",
    icon: Clock,
    color: "#10B981",
    date: "Nov 2023",
  },
  {
    id: 3,
    title: "5-Star Streak",
    description: "10 consecutive 5-star reviews",
    icon: Star,
    color: "#F59E0B",
    date: "Oct 2023",
  },
];

const chartConfig: ChartConfig = {
  projects: { label: "Projects", color: TROJAN_NAVY },
  target: { label: "Target", color: "#E5E7EB" },
  rating: { label: "Rating", color: TROJAN_GOLD },
};

export default function MyStatsPage() {
  const totalProjects = monthlyPerformance.reduce((sum, m) => sum + m.projects, 0);
  const avgRating = (
    monthlyPerformance.reduce((sum, m) => sum + m.rating, 0) / monthlyPerformance.length
  ).toFixed(1);
  const onTimeRate = 92;
  const satisfactionRate = 96;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
          My Performance
        </h1>
        <p className="text-gray-500">Track your performance metrics and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={totalProjects}
          change="Last 6 months"
          changeType="neutral"
          icon={CheckCircle}
          iconColor={TROJAN_NAVY}
          iconBgColor="#E0E7FF"
        />
        <StatsCard
          title="Average Rating"
          value={avgRating}
          change="out of 5.0"
          changeType="positive"
          icon={Star}
          iconColor="#F59E0B"
          iconBgColor="#FEF3C7"
        />
        <StatsCard
          title="On-Time Rate"
          value={`${onTimeRate}%`}
          change="+2% from last month"
          changeType="positive"
          icon={Clock}
          iconColor="#10B981"
          iconBgColor="#D1FAE5"
        />
        <StatsCard
          title="Satisfaction Rate"
          value={`${satisfactionRate}%`}
          change="Customer feedback"
          changeType="positive"
          icon={ThumbsUp}
          iconColor="#3B82F6"
          iconBgColor="#DBEAFE"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Projects completed vs targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="projects" fill={TROJAN_NAVY} name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Based on reviews and evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillMetrics}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke={TROJAN_NAVY}
                    fill={TROJAN_NAVY}
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Customer feedback on your work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{review.customer}</p>
                      <p className="text-sm text-gray-500">{review.project}</p>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">&ldquo;{review.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Recognition for outstanding work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    <achievement.icon size={24} style={{ color: achievement.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                  <Badge variant="secondary">{achievement.date}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Target Progress */}
      <Card>
        <CardHeader>
          <CardTitle>This Month&apos;s Goals</CardTitle>
          <CardDescription>January 2024 targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Projects Completed</span>
                <span className="text-sm font-medium">4/6</span>
              </div>
              <Progress value={67} className="h-3" />
              <p className="text-xs text-gray-400">2 more to reach target</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">On-Time Delivery</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-3" />
              <p className="text-xs text-gray-400">Target: 90%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Customer Rating</span>
                <span className="text-sm font-medium">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-3" />
              <p className="text-xs text-gray-400">Target: 4.5/5.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
