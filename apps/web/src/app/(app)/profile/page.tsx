"use client";

import { User, Mail, Phone, MapPin, Bell, Shield, Save, Package, CheckCircle2, Clock, LogOut, Camera, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { userProjects } from "@/data/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    // Calculate user stats from projects
    const completedProjects = userProjects.filter(p => p.status === "completed").length;
    const activeProjects = userProjects.filter(p => ["pending", "confirmed", "in-progress"].includes(p.status)).length;
    const totalSpent = userProjects
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.price, 0);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: TROJAN_GOLD }} />
            </div>
        );
    }

    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "user@example.com";
    const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                            My Profile
                        </h1>
                        <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleSignOut}
                    >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden">
                            {/* Header Banner */}
                            <div 
                                className="h-24"
                                style={{ backgroundColor: TROJAN_NAVY }}
                            />
                            <CardContent className="pt-0 relative">
                                {/* Avatar */}
                                <div className="text-center -mt-12 mb-4">
                                    <div className="relative inline-block">
                                        <div
                                            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 border-white text-2xl font-bold"
                                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                        >
                                            {userInitials}
                                        </div>
                                        <button 
                                            className="absolute bottom-0 right-0 p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
                                        >
                                            <Camera size={14} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-3">{userName}</h3>
                                    <p className="text-sm text-gray-500">{userEmail}</p>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100">
                                    <div className="text-center">
                                        <div 
                                            className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center"
                                            style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                        >
                                            <Package size={18} style={{ color: TROJAN_GOLD }} />
                                        </div>
                                        <p className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>{userProjects.length}</p>
                                        <p className="text-xs text-gray-500">Total</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center bg-blue-100">
                                            <Clock size={18} className="text-blue-600" />
                                        </div>
                                        <p className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>{activeProjects}</p>
                                        <p className="text-xs text-gray-500">Active</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center bg-green-100">
                                            <CheckCircle2 size={18} className="text-green-600" />
                                        </div>
                                        <p className="text-lg font-bold" style={{ color: TROJAN_NAVY }}>{completedProjects}</p>
                                        <p className="text-xs text-gray-500">Done</p>
                                    </div>
                                </div>

                                {/* Total Spent */}
                                <div 
                                    className="rounded-xl p-4 mt-2"
                                    style={{ backgroundColor: `${TROJAN_NAVY}08` }}
                                >
                                    <p className="text-xs text-gray-500 mb-1">Total Invested</p>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        US${totalSpent.toLocaleString()}
                                    </p>
                                </div>

                                {/* Quick Link */}
                                <Link href="/projects">
                                    <Button 
                                        className="w-full mt-4 rounded-full"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    >
                                        View My Projects
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <User size={20} />
                                    Personal Information
                                </CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-gray-500"
                                >
                                    <Edit3 size={16} className="mr-1" />
                                    {isEditing ? "Cancel" : "Edit"}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input 
                                            id="firstName" 
                                            defaultValue={userName.split(" ")[0]} 
                                            className="mt-1" 
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input 
                                            id="lastName" 
                                            defaultValue={userName.split(" ")[1] || ""} 
                                            className="mt-1" 
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail size={14} />
                                        Email Address
                                    </Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        defaultValue={userEmail} 
                                        className="mt-1" 
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone size={14} />
                                        Phone Number
                                    </Label>
                                    <Input 
                                        id="phone" 
                                        defaultValue="+263 77 123 4567" 
                                        className="mt-1" 
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address" className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        Address
                                    </Label>
                                    <Input 
                                        id="address" 
                                        defaultValue="Harare, Zimbabwe" 
                                        className="mt-1" 
                                        disabled={!isEditing}
                                    />
                                </div>
                                {isEditing && (
                                    <Button
                                        className="rounded-full"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Changes
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notification Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell size={20} />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Project Updates</p>
                                        <p className="text-sm text-gray-500">Get notified when your project status changes</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-yellow-500" />
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Technician Assignments</p>
                                        <p className="text-sm text-gray-500">Know when a technician is assigned to your project</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-yellow-500" />
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Promotional Emails</p>
                                        <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 rounded accent-yellow-500" />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">SMS Notifications</p>
                                        <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield size={20} />
                                    Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" placeholder="••••••••" className="mt-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" placeholder="••••••••" className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" placeholder="••••••••" className="mt-1" />
                                    </div>
                                </div>
                                <Button variant="outline" className="rounded-full">
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Delete Account</p>
                                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                                    </div>
                                    <Button variant="outline" className="rounded-full text-red-600 border-red-200 hover:bg-red-50">
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
