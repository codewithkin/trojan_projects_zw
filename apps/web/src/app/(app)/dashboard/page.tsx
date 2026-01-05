"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome back!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Your projects and quotes will appear here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">No recent activity yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
