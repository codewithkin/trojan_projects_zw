"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";

export default function ProfilePage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                    Profile
                </h1>
                <p className="text-gray-600 mt-1">Manage your account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Your account details will appear here.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Manage your service preferences and location.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
