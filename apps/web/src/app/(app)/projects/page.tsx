"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";

export default function ProjectsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
          My Projects
        </h1>
        <p className="text-gray-600 mt-1">Track your ongoing installations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>No Projects Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Your requested projects and installations will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
