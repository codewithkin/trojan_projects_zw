"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import {
    Users,
    UserPlus,
    Shield,
    Headphones,
    Loader2,
    Eye,
    EyeOff,
    Upload,
    X,
    Mail,
    Calendar,
    MoreHorizontal,
    RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: "staff" | "support" | "admin";
    image: string | null;
    createdAt: string;
}

interface TeamStats {
    totalUsers: number;
    staffCount: number;
    supportCount: number;
    adminCount: number;
}

export default function StaffPage() {
    const { isAuthorized, isLoading } = useAdminGuard();
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [stats, setStats] = useState<TeamStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Invite form state
    const [inviteForm, setInviteForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [inviting, setInviting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading && isAuthorized) {
            fetchStaffData();
        }
    }, [isLoading, isAuthorized]);

    // Don't render if not authorized
    if (isLoading || !isAuthorized) {
        return null;
    }

    const fetchStaffData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");

            // Fetch staff members
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?roles=staff,support,admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStaffMembers(data.users || []);

                // Calculate stats
                const users = data.users || [];
                setStats({
                    totalUsers: data.totalUsers || 0,
                    staffCount: users.filter((u: StaffMember) => u.role === "staff").length,
                    supportCount: users.filter((u: StaffMember) => u.role === "support").length,
                    adminCount: users.filter((u: StaffMember) => u.role === "admin").length,
                });
            } else {
                toast.error("Failed to fetch staff data");
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Failed to fetch staff data");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inviteForm.email || !inviteForm.name || !inviteForm.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (inviteForm.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setInviting(true);
        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: inviteForm.name,
                    email: inviteForm.email,
                    password: inviteForm.password,
                    role: inviteForm.role,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Successfully invited ${inviteForm.name}`);
                setInviteForm({ name: "", email: "", password: "", role: "staff" });
                clearImage();
                setIsModalOpen(false);
                fetchStaffData();
            } else {
                toast.error(data.error || "Failed to send invitation");
            }
        } catch (error) {
            console.error("Error inviting user:", error);
            toast.error("Failed to send invitation");
        } finally {
            setInviting(false);
        }
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setInviteForm({ ...inviteForm, password });
        setShowPassword(true);
    };

    const getRoleBadge = (role: string) => {
        const config: Record<string, { bg: string; text: string; icon: typeof Shield }> = {
            admin: { bg: "bg-purple-100", text: "text-purple-700", icon: Shield },
            staff: { bg: "bg-blue-100", text: "text-blue-700", icon: Users },
            support: { bg: "bg-green-100", text: "text-green-700", icon: Headphones },
        };
        const { bg, text, icon: Icon } = config[role] || config.staff;
        return (
            <Badge variant="outline" className={`${bg} ${text} border-0 gap-1`}>
                <Icon size={12} />
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-ZW", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                        Staff Management
                    </h1>
                    <p className="text-gray-500">Manage your team and invite new members</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchStaffData} disabled={loading} className="flex items-center">
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }} className="flex items-center">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <UserPlus size={20} />
                                    Invite Team Member
                                </DialogTitle>
                                <DialogDescription>
                                    Create an account for a new staff, support, or admin member.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleInvite} className="space-y-4 mt-4">
                                {/* Image Upload */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div
                                            className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {imagePreview ? (
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload size={24} className="mx-auto text-gray-400" />
                                                    <span className="text-xs text-gray-400 mt-1">Trojan ID</span>
                                                </div>
                                            )}
                                        </div>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="invite-name">Full Name *</Label>
                                        <Input
                                            id="invite-name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={inviteForm.name}
                                            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="invite-role">Role *</Label>
                                        <Select
                                            value={inviteForm.role}
                                            onValueChange={(value) => value && setInviteForm({ ...inviteForm, role: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="staff">Staff (Technician)</SelectItem>
                                                <SelectItem value="support">Support</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="invite-email">Email Address *</Label>
                                    <Input
                                        id="invite-email"
                                        type="email"
                                        placeholder="team@trojanprojects.co.zw"
                                        value={inviteForm.email}
                                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="invite-password">Password *</Label>
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs"
                                            onClick={generatePassword}
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="invite-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min 6 characters"
                                            value={inviteForm.password}
                                            onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <DialogFooter className="mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}
                                        disabled={inviting}
                                    >
                                        {inviting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Inviting...
                                            </>
                                        ) : (
                                            "Send Invitation"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Customers</p>
                                    <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                                        {stats?.totalUsers || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${TROJAN_GOLD}20` }}>
                                    <Users size={24} style={{ color: TROJAN_NAVY }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Staff Members</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {stats?.staffCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                                    <Users size={24} className="text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Support Team</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {stats?.supportCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                                    <Headphones size={24} className="text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Admins</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {stats?.adminCount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                                    <Shield size={24} className="text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Staff List */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>All staff, support, and admin members</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    ) : staffMembers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No team members yet</p>
                            <p className="text-sm">Invite your first team member to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {staffMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={member.image || undefined} />
                                        <AvatarFallback style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{member.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1 truncate">
                                                <Mail size={12} />
                                                {member.email}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {getRoleBadge(member.role)}
                                        <span className="hidden lg:flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar size={12} />
                                            {formatDate(member.createdAt)}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                <MoreHorizontal size={16} />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Member</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Remove Member
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
