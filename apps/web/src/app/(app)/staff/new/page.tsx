"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Shield,
    Briefcase,
    Calendar,
    Save,
    Send,
    Plus,
    X,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/dialog";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const roles = [
    {
        id: "staff",
        name: "Staff",
        description: "Field technicians who handle installations and maintenance",
        permissions: ["View assigned projects", "Update project status", "View services", "View own stats"],
    },
    {
        id: "support",
        name: "Support",
        description: "Customer support team handling inquiries and tickets",
        permissions: ["Manage tickets", "Live chat", "Customer lookup", "View FAQs"],
    },
];

const departments = ["Solar Installation", "Electrical", "Security Systems", "Water Systems", "Customer Support"];
const positions = [
    "Junior Technician",
    "Technician",
    "Senior Technician",
    "Lead Technician",
    "Support Agent",
    "Senior Support Agent",
];

const skillOptions = [
    "Solar Installation",
    "Inverters",
    "Battery Systems",
    "Electrical",
    "Electric Fencing",
    "Gate Motors",
    "CCTV",
    "Borehole",
    "Customer Support",
];

export default function AddStaffPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"invite" | "create">("invite");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        position: "",
        startDate: "",
        notes: "",
    });
    const [skills, setSkills] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const toggleSkill = (skill: string) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter((s) => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.role) {
            newErrors.role = "Please select a role";
        }

        if (mode === "create") {
            if (!formData.firstName.trim()) {
                newErrors.firstName = "First name is required";
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = "Last name is required";
            }
            if (!formData.phone.trim()) {
                newErrors.phone = "Phone number is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // In real app, submit to API
        console.log({ ...formData, skills, mode });
        setShowSuccessDialog(true);
    };

    const selectedRole = roles.find((r) => r.id === formData.role);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                            Add Team Member
                        </h1>
                        <p className="text-gray-500">Invite or create a new staff account</p>
                    </div>
                </div>
                <Button onClick={handleSubmit} style={{ backgroundColor: TROJAN_NAVY }}>
                    {mode === "invite" ? (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Invite
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Account
                        </>
                    )}
                </Button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-4">
                <Button
                    variant={mode === "invite" ? "default" : "outline"}
                    onClick={() => setMode("invite")}
                    style={mode === "invite" ? { backgroundColor: TROJAN_NAVY } : {}}
                >
                    <Mail className="mr-2 h-4 w-4" />
                    Invite via Email
                </Button>
                <Button
                    variant={mode === "create" ? "default" : "outline"}
                    onClick={() => setMode("create")}
                    style={mode === "create" ? { backgroundColor: TROJAN_NAVY } : {}}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Account
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {mode === "invite" ? "Invite Details" : "Staff Details"}
                            </CardTitle>
                            <CardDescription>
                                {mode === "invite"
                                    ? "Enter the email address to send an invitation"
                                    : "Enter the full details for the new staff member"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mode === "create" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>
                                            First Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => handleChange("firstName", e.target.value)}
                                            placeholder="Enter first name"
                                            className={errors.firstName ? "border-red-500" : ""}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-red-500">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            Last Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => handleChange("lastName", e.target.value)}
                                            placeholder="Enter last name"
                                            className={errors.lastName ? "border-red-500" : ""}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="staff@trojanprojects.co.zw"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {mode === "create" && (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        Phone <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        placeholder="+263 77 XXX XXXX"
                                        className={errors.phone ? "border-red-500" : ""}
                                    />
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Role Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Role & Permissions
                            </CardTitle>
                            <CardDescription>
                                Select the role that best fits this team member&apos;s responsibilities
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        onClick={() => handleChange("role", role.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${formData.role === role.id
                                                ? "border-2"
                                                : "hover:bg-gray-50"
                                            }`}
                                        style={
                                            formData.role === role.id
                                                ? { borderColor: TROJAN_NAVY, backgroundColor: "#F0F4FF" }
                                                : {}
                                        }
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium">{role.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                                            </div>
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.role === role.id ? "border-blue-600" : "border-gray-300"
                                                    }`}
                                                style={formData.role === role.id ? { borderColor: TROJAN_NAVY } : {}}
                                            >
                                                {formData.role === role.id && (
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: TROJAN_NAVY }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-xs text-gray-400 mb-1">Permissions:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.map((perm) => (
                                                    <Badge key={perm} variant="secondary" className="text-xs">
                                                        {perm}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                        </CardContent>
                    </Card>

                    {/* Position & Department */}
                    {mode === "create" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Position Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Select
                                            value={formData.department}
                                            onValueChange={(v) => handleChange("department", v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Position</Label>
                                        <Select
                                            value={formData.position}
                                            onValueChange={(v) => handleChange("position", v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {positions.map((pos) => (
                                                    <SelectItem key={pos} value={pos}>
                                                        {pos}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Start Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={(e) => handleChange("notes", e.target.value)}
                                        placeholder="Any additional notes..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Skills */}
                    {(mode === "create" || formData.role === "staff") && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills</CardTitle>
                                <CardDescription>Select applicable skills</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {skillOptions.map((skill) => (
                                        <div key={skill} className="flex items-center gap-3">
                                            <Checkbox
                                                id={skill}
                                                checked={skills.includes(skill)}
                                                onCheckedChange={() => toggleSkill(skill)}
                                            />
                                            <Label htmlFor={skill} className="cursor-pointer">
                                                {skill}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Selected Role Info */}
                    {selectedRole && (
                        <Card className="bg-blue-50 border-blue-100">
                            <CardContent className="pt-6">
                                <h3 className="font-medium mb-2" style={{ color: TROJAN_NAVY }}>
                                    {selectedRole.name} Role
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">{selectedRole.description}</p>
                                <h4 className="text-sm font-medium mb-2">This role can:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {selectedRole.permissions.map((perm) => (
                                        <li key={perm} className="flex items-center gap-2">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: TROJAN_NAVY }}
                                            />
                                            {perm}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Box */}
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-yellow-800">
                                        {mode === "invite" ? "Invitation Process" : "Account Creation"}
                                    </h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        {mode === "invite"
                                            ? "An email will be sent with a link to set up their account and password."
                                            : "The account will be created immediately. The staff member will receive login credentials via email."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "invite" ? "Invitation Sent!" : "Account Created!"}
                        </DialogTitle>
                        <DialogDescription>
                            {mode === "invite"
                                ? `An invitation email has been sent to ${formData.email}. They can use the link to set up their account.`
                                : `The account for ${formData.firstName} ${formData.lastName} has been created successfully.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
                            Add Another
                        </Button>
                        <Button
                            onClick={() => router.push("/staff")}
                            style={{ backgroundColor: TROJAN_NAVY }}
                        >
                            View Staff
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
