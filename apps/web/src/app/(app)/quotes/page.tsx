"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function QuotesPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
          Quotes
        </h1>
        <p className="text-gray-600 mt-1">Request and view your quotes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request a Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Get a free, no-obligation quote for your project</p>
            <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
              New Quote Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">No quotes yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
