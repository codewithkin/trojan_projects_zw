"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image,
  DollarSign,
  Clock,
  ListChecks,
  Plus,
  X,
  GripVertical,
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

const categories = [
  "Solar Installation",
  "Electrical",
  "Security Systems",
  "Water Systems",
  "Maintenance",
];

const defaultFeatures = [
  "Professional Installation",
  "Quality Materials",
  "Warranty Included",
  "24/7 Support",
  "Free Consultation",
];

// Mock existing service data
const existingService = {
  id: "1",
  name: "5kW Solar Installation",
  shortDescription: "Complete 5kW solar power system for medium-sized homes",
  description: `Our 5kW Solar Installation package is perfect for medium-sized homes looking to reduce their electricity bills and gain energy independence.`,
  category: "Solar Installation",
  basePrice: "3500",
  priceType: "fixed",
  duration: "3",
  durationUnit: "days",
  status: "active",
  features: [
    "Professional Installation",
    "Quality Materials",
    "Warranty Included",
    "24/7 Support",
    "10x 500W Solar Panels",
    "5kW Hybrid Inverter",
    "Battery Ready",
  ],
  checklist: [
    "Site assessment",
    "Install mounting rails",
    "Mount solar panels",
    "Install inverter",
    "System testing",
  ],
  isPopular: true,
};

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [formData, setFormData] = useState({
    name: existingService.name,
    description: existingService.description,
    shortDescription: existingService.shortDescription,
    category: existingService.category,
    basePrice: existingService.basePrice,
    priceType: existingService.priceType,
    duration: existingService.duration,
    durationUnit: existingService.durationUnit,
    status: existingService.status,
  });
  const [features, setFeatures] = useState<string[]>(existingService.features);
  const [customFeature, setCustomFeature] = useState("");
  const [checklist, setChecklist] = useState<string[]>(existingService.checklist);
  const [customChecklistItem, setCustomChecklistItem] = useState("");
  const [isPopular, setIsPopular] = useState(existingService.isPopular);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const toggleFeature = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !features.includes(customFeature.trim())) {
      setFeatures([...features, customFeature.trim()]);
      setCustomFeature("");
    }
  };

  const addChecklistItem = () => {
    if (customChecklistItem.trim() && !checklist.includes(customChecklistItem.trim())) {
      setChecklist([...checklist, customChecklistItem.trim()]);
      setCustomChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.basePrice.trim()) {
      newErrors.basePrice = "Base price is required";
    } else if (isNaN(Number(formData.basePrice))) {
      newErrors.basePrice = "Price must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const serviceData = {
      id: serviceId,
      ...formData,
      features,
      checklist,
      isPopular,
    };
    console.log("Saving service:", serviceData);

    // Simulate API call
    setTimeout(() => {
      router.push(`/services-management/${serviceId}`);
    }, 1000);
  };

  const hasChanges = () => {
    return (
      formData.name !== existingService.name ||
      formData.description !== existingService.description ||
      formData.shortDescription !== existingService.shortDescription ||
      formData.category !== existingService.category ||
      formData.basePrice !== existingService.basePrice ||
      formData.priceType !== existingService.priceType ||
      formData.duration !== existingService.duration ||
      formData.durationUnit !== existingService.durationUnit ||
      formData.status !== existingService.status ||
      isPopular !== existingService.isPopular ||
      JSON.stringify(features) !== JSON.stringify(existingService.features) ||
      JSON.stringify(checklist) !== JSON.stringify(existingService.checklist)
    );
  };

  const handleBack = () => {
    if (hasChanges()) {
      setShowDiscardDialog(true);
    } else {
      router.back();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
              Edit Service
            </h1>
            <p className="text-gray-500">Update service details and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: TROJAN_NAVY }}
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the main details of the service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Service Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., 5kW Solar Installation"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label>
                  Short Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => handleChange("shortDescription", e.target.value)}
                  placeholder="Brief one-line description for listings"
                  className={errors.shortDescription ? "border-red-500" : ""}
                />
                {errors.shortDescription && (
                  <p className="text-sm text-red-500">{errors.shortDescription}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Detailed description of the service..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Base Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => handleChange("basePrice", e.target.value)}
                    placeholder="0.00"
                    className={errors.basePrice ? "border-red-500" : ""}
                  />
                  {errors.basePrice && (
                    <p className="text-sm text-red-500">{errors.basePrice}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Price Type</Label>
                  <Select
                    value={formData.priceType}
                    onValueChange={(v) => handleChange("priceType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="starting">Starting From</SelectItem>
                      <SelectItem value="hourly">Per Hour</SelectItem>
                      <SelectItem value="quote">Quote Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Estimated Duration
                  </Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration Unit</Label>
                  <Select
                    value={formData.durationUnit}
                    onValueChange={(v) => handleChange("durationUnit", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>What&apos;s included in this service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {defaultFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Checkbox
                      id={feature}
                      checked={features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <Label htmlFor={feature} className="cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Custom Features Added */}
              {features.filter((f) => !defaultFeatures.includes(f)).length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500 mb-2">Custom Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {features
                      .filter((f) => !defaultFeatures.includes(f))
                      .map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {feature}
                          <button onClick={() => removeFeature(feature)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Add Custom Feature */}
              <div className="flex gap-2 pt-3 border-t">
                <Input
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  placeholder="Add custom feature"
                  onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                />
                <Button variant="outline" onClick={addCustomFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Installation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Installation Checklist
              </CardTitle>
              <CardDescription>
                Tasks to be completed during installation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checklist.length > 0 && (
                <div className="space-y-2">
                  {checklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="flex-1">{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeChecklistItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={customChecklistItem}
                  onChange={(e) => setCustomChecklistItem(e.target.value)}
                  placeholder="Add checklist item"
                  onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
                />
                <Button variant="outline" onClick={addChecklistItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="popular"
                  checked={isPopular}
                  onCheckedChange={(checked) => setIsPopular(checked === true)}
                />
                <div>
                  <Label htmlFor="popular" className="cursor-pointer font-medium">
                    Mark as Popular
                  </Label>
                  <p className="text-xs text-gray-500">
                    Featured on homepage and listings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Service Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">
                  Click or drag to upload
                </p>
                <Button variant="outline" size="sm">
                  Change Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Unsaved Changes Alert */}
          {hasChanges() && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Unsaved Changes</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      You have unsaved changes. Remember to save before leaving.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Discard Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
              Keep Editing
            </Button>
            <Button variant="destructive" onClick={() => router.back()}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
