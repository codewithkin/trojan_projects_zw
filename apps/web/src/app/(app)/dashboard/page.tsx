"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Bell, UserPlus, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function DashboardPage() {
    const [email, setEmail] = useState("");
    const [inviting, setInviting] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        setInviting(true);
        // TODO: Implement actual invite API call
        setTimeout(() => {
            toast.success(`Invitation sent to ${email}`);
            setEmail("");
            setInviting(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Manage your business operations</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>24</p>
                            </div>
                            <ShoppingCart size={32} className="text-gray-300" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-600">8</p>
                            </div>
                            <Package size={32} className="text-yellow-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Notifications</p>
                                <p className="text-2xl font-bold text-blue-600">12</p>
                            </div>
                            <Bell size={32} className="text-blue-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Solar Installation - Harare</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    Pending
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">CCTV Setup - Bulawayo</p>
                                    <p className="text-sm text-gray-500">5 hours ago</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    Completed
                                </span>
                            </div>
                        </div>
                        <Link href="/orders">
                            <Button variant="outline" className="w-full mt-4">
                                View All Orders
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Invite Team Members */}
                <Card id="invite">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus size={20} />
                            Invite Team Members
                        </CardTitle>
                        <CardDescription>
                            Send invitations to staff and support team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-email">Email Address</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="team@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                disabled={inviting}
                            >
                                {inviting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            Team members will receive an email with login instructions and can access the mobile app.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
