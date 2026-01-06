"use client";

import { useState } from "react";
import { MessageSquare, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadAppButton } from "@/components/download-app-button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function ChatPage() {
    const [activeTab, setActiveTab] = useState("projects");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: TROJAN_NAVY }}>
                        <MessageSquare className="h-6 w-6" />
                        Chat
                    </h1>
                    <p className="text-gray-500">Communicate with your team and support</p>
                </div>
                <DownloadAppButton />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="projects">My Projects</TabsTrigger>
                    <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>

                {/* My Projects Tab */}
                <TabsContent value="projects" className="mt-6">
                    <Card className="border-2" style={{ borderColor: TROJAN_GOLD }}>
                        <CardHeader className="text-center pb-8">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="rounded-full p-6"
                                    style={{ backgroundColor: `${TROJAN_GOLD}20` }}
                                >
                                    <MessageSquare className="h-16 w-16" style={{ color: TROJAN_GOLD }} />
                                </div>
                            </div>
                            <CardTitle className="text-2xl" style={{ color: TROJAN_NAVY }}>
                                Project Chat Available on Mobile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Chat with your assigned staff members about your active projects. Each project has
                                its own dedicated chat room for seamless communication.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        <span>Real-time messaging</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Project-specific rooms</span>
                                    </div>
                                </div>
                                <DownloadAppButton size="lg" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Support Tab */}
                <TabsContent value="support" className="mt-6">
                    <Card className="border-2" style={{ borderColor: TROJAN_NAVY }}>
                        <CardHeader className="text-center pb-8">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="rounded-full p-6"
                                    style={{ backgroundColor: `${TROJAN_NAVY}20` }}
                                >
                                    <MessageSquare className="h-16 w-16" style={{ color: TROJAN_NAVY }} />
                                </div>
                            </div>
                            <CardTitle className="text-2xl" style={{ color: TROJAN_NAVY }}>
                                Support Chat Available on Mobile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Get instant help from our support team. Download our mobile app to chat with
                                support agents in real-time about your inquiries and issues.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        <span>Live support chat</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Quick responses</span>
                                    </div>
                                </div>
                                <DownloadAppButton size="lg" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Real-time Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Get instant notifications and responses from your team and support staff
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Project Collaboration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Discuss project details, share updates, and coordinate with staff members
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">24/7 Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Access support team anytime for assistance with your inquiries
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
