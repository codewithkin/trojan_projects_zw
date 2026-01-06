"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// FAQ type
type FAQ = {
    id: string;
    question: string;
    answer: string;
    category: string;
    isPublished: boolean;
    views: number;
    helpful: number;
    createdAt: string;
    updatedAt: string;
};

// Mock data
const categories = [
    { id: "solar", name: "Solar Systems", count: 8 },
    { id: "cctv", name: "CCTV & Security", count: 5 },
    { id: "electrical", name: "Electrical", count: 4 },
    { id: "billing", name: "Billing & Payments", count: 6 },
    { id: "warranty", name: "Warranty & Support", count: 5 },
    { id: "general", name: "General", count: 3 },
];

const mockFAQs: FAQ[] = [
    {
        id: "1",
        question: "How long does a solar panel installation take?",
        answer: "A typical residential solar installation takes 1-3 days depending on the system size. Commercial installations may take longer. We'll provide a specific timeline during your consultation.",
        category: "solar",
        isPublished: true,
        views: 342,
        helpful: 289,
        createdAt: "2023-06-15",
        updatedAt: "2024-01-10",
    },
    {
        id: "2",
        question: "What warranty do you offer on solar systems?",
        answer: "We offer a 25-year performance warranty on solar panels, 10-year warranty on inverters, and 5-year warranty on batteries. Installation workmanship is covered for 2 years.",
        category: "warranty",
        isPublished: true,
        views: 256,
        helpful: 234,
        createdAt: "2023-06-15",
        updatedAt: "2023-12-20",
    },
    {
        id: "3",
        question: "Can I monitor my CCTV cameras from my phone?",
        answer: "Yes! All our CCTV systems come with mobile app access. You can view live feeds, playback recordings, and receive motion alerts directly on your smartphone or tablet.",
        category: "cctv",
        isPublished: true,
        views: 189,
        helpful: 167,
        createdAt: "2023-07-20",
        updatedAt: "2023-11-15",
    },
    {
        id: "4",
        question: "What payment methods do you accept?",
        answer: "We accept cash, bank transfer, EcoCash, and OneMoney. For larger installations, we offer flexible payment plans with up to 12 months to pay.",
        category: "billing",
        isPublished: true,
        views: 412,
        helpful: 398,
        createdAt: "2023-06-15",
        updatedAt: "2024-01-05",
    },
    {
        id: "5",
        question: "Do you provide maintenance services?",
        answer: "Yes, we offer annual maintenance packages for all our installations. This includes cleaning, inspection, and minor repairs to keep your system running optimally.",
        category: "warranty",
        isPublished: true,
        views: 178,
        helpful: 156,
        createdAt: "2023-08-10",
        updatedAt: "2023-08-10",
    },
    {
        id: "6",
        question: "How do electric fences work?",
        answer: "Electric fences deliver a non-lethal but deterrent shock to intruders. They're connected to an energizer that pulses electricity through the wires. Our systems include backup batteries for power outages.",
        category: "electrical",
        isPublished: false,
        views: 45,
        helpful: 38,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
    },
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const filteredFAQs = mockFAQs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || categoryId;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        FAQ Management
                    </h1>
                    <p className="text-gray-500">Manage frequently asked questions</p>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add FAQ
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New FAQ</DialogTitle>
                            <DialogDescription>
                                Create a new frequently asked question entry.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Question</Label>
                                <Input placeholder="Enter the question..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Answer</Label>
                                <textarea
                                    className="w-full min-h-[150px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter the answer..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                Cancel
                            </Button>
                            <Button style={{ backgroundColor: TROJAN_NAVY }}>Save FAQ</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Categories Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <button
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                                    selectedCategory === "all" && "bg-gray-50"
                                )}
                                onClick={() => setSelectedCategory("all")}
                            >
                                <span className="text-sm font-medium">All FAQs</span>
                                <Badge variant="secondary">{mockFAQs.length}</Badge>
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors border-t border-gray-100",
                                        selectedCategory === category.id && "bg-gray-50"
                                    )}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    <span className="text-sm">{category.name}</span>
                                    <Badge variant="secondary">
                                        {mockFAQs.filter((f) => f.category === category.id).length}
                                    </Badge>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ List */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search FAQs..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-3">
                        {filteredFAQs.map((faq) => (
                            <Card
                                key={faq.id}
                                className={cn(
                                    "transition-all",
                                    !faq.isPublished && "opacity-60"
                                )}
                            >
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <HelpCircle
                                                size={20}
                                                className="mt-0.5 shrink-0"
                                                style={{ color: TROJAN_GOLD }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {getCategoryName(faq.category)}
                                                    </Badge>
                                                    {!faq.isPublished && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <EyeOff size={10} className="mr-1" />
                                                            Draft
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-gray-400">
                                                        {faq.views} views • {faq.helpful} found helpful
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                            {expandedId === faq.id ? (
                                                <ChevronUp size={20} className="text-gray-400" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    {expandedId === faq.id && (
                                        <div className="mt-4 pl-8">
                                            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                                <span className="text-xs text-gray-400">
                                                    Created: {faq.createdAt}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Updated: {faq.updatedAt}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="ml-auto"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {faq.isPublished ? (
                                                        <>
                                                            <EyeOff size={14} className="mr-1" />
                                                            Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye size={14} className="mr-1" />
                                                            Publish
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {filteredFAQs.length === 0 && (
                            <Card className="p-12 text-center">
                                <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                                <p className="text-gray-500">
                                    {searchQuery
                                        ? "Try adjusting your search query"
                                        : "Get started by adding your first FAQ"}
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
