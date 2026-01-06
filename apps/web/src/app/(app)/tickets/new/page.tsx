"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Search,
  User,
  Ticket,
  AlertCircle,
  CheckCircle,
  Package,
  MessageSquare,
  Paperclip,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

// Mock customer search results
const mockCustomers = [
  {
    id: "CUST001",
    name: "John Moyo",
    email: "john.moyo@example.com",
    phone: "+263 77 123 4567",
    orders: 3,
    avatar: null,
  },
  {
    id: "CUST002",
    name: "Sarah Dube",
    email: "sarah.dube@example.com",
    phone: "+263 71 234 5678",
    orders: 5,
    avatar: null,
  },
  {
    id: "CUST003",
    name: "Peter Ncube",
    email: "peter.ncube@example.com",
    phone: "+263 78 345 6789",
    orders: 1,
    avatar: null,
  },
];

// Mock customer orders
const mockOrders = [
  { id: "ORD001", service: "5kW Solar Installation", status: "in-progress", date: "2024-01-05" },
  { id: "ORD002", service: "Inverter Repair", status: "completed", date: "2023-12-20" },
  { id: "ORD003", service: "Electric Fence Installation", status: "completed", date: "2023-11-15" },
];

const categories = [
  { id: "billing", name: "Billing & Payments", icon: "💳" },
  { id: "technical", name: "Technical Issue", icon: "🔧" },
  { id: "installation", name: "Installation Query", icon: "⚡" },
  { id: "product", name: "Product Information", icon: "📦" },
  { id: "complaint", name: "Complaint", icon: "⚠️" },
  { id: "general", name: "General Inquiry", icon: "❓" },
];

const priorities = [
  { id: "low", name: "Low", color: "#10B981", description: "Non-urgent, can wait" },
  { id: "medium", name: "Medium", color: TROJAN_GOLD, description: "Normal priority" },
  { id: "high", name: "High", color: "#F97316", description: "Needs attention soon" },
  { id: "urgent", name: "Urgent", color: "#EF4444", description: "Critical, immediate attention" },
];

export default function CreateTicketPage() {
  const router = useRouter();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    internalNotes: "",
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
  );

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCustomer) {
      newErrors.customer = "Please select a customer";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log({
        customer: selectedCustomer,
        order: selectedOrder,
        ...formData,
        attachments,
      });
      router.push("/tickets");
    }, 1000);
  };

  const addMockAttachment = () => {
    const newFile = `document_${attachments.length + 1}.pdf`;
    setAttachments([...attachments, newFile]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const selectedPriority = priorities.find((p) => p.id === formData.priority);

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
              Create New Ticket
            </h1>
            <p className="text-gray-500">Log a customer inquiry or support request</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: TROJAN_NAVY }}
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Ticket className="mr-2 h-4 w-4" />
                Create Ticket
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>Search for an existing customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedCustomer ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className={`pl-10 ${errors.customer ? "border-red-500" : ""}`}
                    placeholder="Search by name, email, or phone..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onFocus={() => customerSearch && setShowSearchResults(true)}
                  />

                  {showSearchResults && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowSearchResults(false);
                              setCustomerSearch("");
                              if (errors.customer) {
                                setErrors({ ...errors, customer: "" });
                              }
                            }}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={customer.avatar || undefined} />
                              <AvatarFallback>
                                {customer.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                              {customer.orders} orders
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                  {errors.customer && (
                    <p className="text-sm text-red-500 mt-1">{errors.customer}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedCustomer.avatar || undefined} />
                      <AvatarFallback>
                        {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {selectedCustomer && (
                <div className="space-y-2">
                  <Label>Related Order (Optional)</Label>
                  <Select value={selectedOrder || ""} onValueChange={setSelectedOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a related order if applicable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No related order</SelectItem>
                      {mockOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {order.id} - {order.service}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Brief summary of the issue"
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleChange("category", cat.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                        formData.category === cat.id
                          ? "border-2"
                          : "hover:bg-gray-50"
                      }`}
                      style={
                        formData.category === cat.id
                          ? { borderColor: TROJAN_NAVY, backgroundColor: "#F0F4FF" }
                          : {}
                      }
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-sm font-medium">{cat.name}</div>
                    </div>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Detailed description of the customer's issue or inquiry..."
                  rows={6}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {attachments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{file}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addMockAttachment}
                    className="w-full"
                  >
                    <Paperclip className="mr-2 h-4 w-4" />
                    Add Attachment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
              <CardDescription>Notes visible only to support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.internalNotes}
                onChange={(e) => handleChange("internalNotes", e.target.value)}
                placeholder="Add any internal notes or context..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorities.map((priority) => (
                <div
                  key={priority.id}
                  onClick={() => handleChange("priority", priority.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.priority === priority.id
                      ? "border-2"
                      : "hover:bg-gray-50"
                  }`}
                  style={
                    formData.priority === priority.id
                      ? { borderColor: priority.color }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: priority.color }}
                    />
                    <div>
                      <p className="font-medium">{priority.name}</p>
                      <p className="text-xs text-gray-500">{priority.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Ticket Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium">
                  {selectedCustomer ? selectedCustomer.name : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium">
                  {formData.category
                    ? categories.find((c) => c.id === formData.category)?.name
                    : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Priority:</span>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: selectedPriority?.color,
                    color: selectedPriority?.color,
                  }}
                >
                  {selectedPriority?.name}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Related Order:</span>
                <span className="font-medium">
                  {selectedOrder && selectedOrder !== "none" ? selectedOrder : "None"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Attachments:</span>
                <span className="font-medium">{attachments.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">Tips</h3>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Include specific details in description</li>
                    <li>• Link related orders when applicable</li>
                    <li>• Set appropriate priority level</li>
                    <li>• Add internal notes for context</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
