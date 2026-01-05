"use client";

import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Profile Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                {/* Avatar */}
                                <div className="text-center mb-6">
                                    <div
                                        className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                                        style={{ backgroundColor: `${TROJAN_GOLD}30` }}
                                    >
                                        <User size={40} style={{ color: TROJAN_NAVY }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="mt-4 rounded-full"
                                    >
                                        Change Photo
                                    </Button>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Member Since</span>
                                        <span className="text-sm font-medium">Jan 2026</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Projects</span>
                                        <span className="text-sm font-medium">2</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Total Spent</span>
                                        <span className="text-sm font-medium">US$4,050</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User size={20} />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="John" className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Doe" className="mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail size={14} />
                                        Email Address
                                    </Label>
                                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone size={14} />
                                        Phone Number
                                    </Label>
                                    <Input id="phone" defaultValue="+263 77 123 4567" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="address" className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        Address
                                    </Label>
                                    <Input id="address" defaultValue="Greendale, Harare" className="mt-1" />
                                </div>
                                <Button
                                    className="rounded-full"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    <Save size={16} className="mr-2" />
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Preferences */}
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
                                        <p className="font-medium text-gray-900">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive updates about your projects</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">Quote Updates</p>
                                        <p className="text-sm text-gray-500">Get notified when quotes are ready</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">Marketing Emails</p>
                                        <p className="text-sm text-gray-500">Special offers and promotions</p>
                                    </div>
                                    <input type="checkbox" className="w-4 h-4" />
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
                                    <Input id="currentPassword" type="password" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" className="mt-1" />
                                </div>
                                <Button variant="outline" className="rounded-full">
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Payment Methods
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-4">
                                    Manage your saved payment methods for faster checkout
                                </p>
                                <Button variant="outline" className="rounded-full">
                                    Add Payment Method
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
