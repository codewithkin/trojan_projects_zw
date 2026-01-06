"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Clock, CheckCircle2, XCircle, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const mockQuotes = [
    {
        id: 1,
        service: "3.5 KVA Solar System",
        amount: "US$1,250",
        status: "pending",
        date: "2 days ago",
        image: "https://picsum.photos/seed/solar2/400/400",
    },
    {
        id: 2,
        service: "CCTV 4-Camera Installation",
        amount: "US$850",
        status: "approved",
        date: "1 week ago",
        image: "https://picsum.photos/seed/cctv1/400/400",
    },
    {
        id: 3,
        service: "10 KVA Solar System",
        amount: "US$3,200",
        status: "rejected",
        date: "2 weeks ago",
        image: "https://picsum.photos/seed/solar3/400/400",
    },
];

const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" },
    approved: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Approved" },
    rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Rejected" },
};

export default function QuotesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Quote Requests
                        </h1>
                        <p className="text-gray-500 mt-1">Manage your service quotes and estimates</p>
                    </div>
                    <Link href="/quotes/new">
                        <Button
                            size="lg"
                            className="rounded-full"
                            style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                        >
                            <Plus size={20} className="mr-2" />
                            New Quote
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Quotes</p>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>3</p>
                                </div>
                                <FileText size={32} className="text-gray-300" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">1</p>
                                </div>
                                <Clock size={32} className="text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Approved</p>
                                    <p className="text-2xl font-bold text-green-600">1</p>
                                </div>
                                <CheckCircle2 size={32} className="text-green-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quotes List */}
                <div className="space-y-4">
                    {mockQuotes.map((quote) => {
                        const status = statusConfig[quote.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;

                        return (
                            <Card key={quote.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-6">
                                        {/* Image */}
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={quote.image}
                                                alt={quote.service}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {quote.service}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">Requested {quote.date}</p>
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg}`}>
                                                <StatusIcon size={14} className={status.color} />
                                                <span className={`text-xs font-medium ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount & Action */}
                                        <div className="text-right">
                                            <p className="text-2xl font-bold mb-2" style={{ color: TROJAN_NAVY }}>
                                                {quote.amount}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                View Details
                                                <ArrowRight size={14} className="ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State (if no quotes) */}
                {mockQuotes.length === 0 && (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
                            <p className="text-gray-500 mb-6">Start by requesting a quote for your project</p>
                            <Link href="/services">
                                <Button
                                    size="lg"
                                    className="rounded-full"
                                    style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                >
                                    Browse Services
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
