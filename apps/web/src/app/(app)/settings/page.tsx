"use client";

import { useState } from "react";
import {
  Settings,
  Building2,
  Mail,
  Phone,
  Globe,
  Bell,
  Shield,
  Users,
  Palette,
  CreditCard,
  FileText,
  Save,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailReviews: true,
    emailStaff: false,
    pushOrders: true,
    pushTickets: true,
    pushReminders: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
          Settings
        </h1>
        <p className="text-gray-500">Manage your business settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Your company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input defaultValue="Trojan Projects ZW" />
                </div>
                <div className="space-y-2">
                  <Label>Legal Name</Label>
                  <Input defaultValue="Trojan Projects (Pvt) Ltd" />
                </div>
                <div className="space-y-2">
                  <Label>
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </Label>
                  <Input type="email" defaultValue="info@trojanprojects.co.zw" />
                </div>
                <div className="space-y-2">
                  <Label>
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </Label>
                  <Input type="tel" defaultValue="+263 77 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>
                    <Globe className="inline h-4 w-4 mr-1" />
                    Website
                  </Label>
                  <Input type="url" defaultValue="https://trojanprojects.co.zw" />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID / BP Number</Label>
                  <Input defaultValue="BP12345678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Business Address</Label>
                <Input defaultValue="123 Enterprise Road, Harare, Zimbabwe" />
              </div>

              <div className="flex justify-end">
                <Button style={{ backgroundColor: TROJAN_NAVY }}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding
              </CardTitle>
              <CardDescription>Customize your brand colors and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: TROJAN_NAVY }}
                    />
                    <Input defaultValue="#0F1B4D" className="w-32" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: TROJAN_GOLD }}
                    />
                    <Input defaultValue="#FFC107" className="w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Settings
              </CardTitle>
              <CardDescription>Configure your invoice defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Prefix</Label>
                  <Input defaultValue="INV-" />
                </div>
                <div className="space-y-2">
                  <Label>Next Invoice Number</Label>
                  <Input type="number" defaultValue="1024" />
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="zwl">ZWL (Z$)</SelectItem>
                      <SelectItem value="zar">ZAR (R)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Invoice Footer Text</Label>
                <Input defaultValue="Thank you for your business! Payment due within 30 days." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure which emails you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">New Orders</p>
                  <p className="text-sm text-gray-500">Get notified when a new order is placed</p>
                </div>
                <Checkbox
                  checked={notifications.emailOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailOrders: checked as boolean })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <p className="font-medium">Customer Reviews</p>
                  <p className="text-sm text-gray-500">Get notified when customers leave reviews</p>
                </div>
                <Checkbox
                  checked={notifications.emailReviews}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailReviews: checked as boolean })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <p className="font-medium">Staff Updates</p>
                  <p className="text-sm text-gray-500">
                    Get notified about staff schedule changes
                  </p>
                </div>
                <Checkbox
                  checked={notifications.emailStaff}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailStaff: checked as boolean })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>Configure in-app notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-gray-500">Real-time order status changes</p>
                </div>
                <Checkbox
                  checked={notifications.pushOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushOrders: checked as boolean })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <p className="font-medium">Support Tickets</p>
                  <p className="text-sm text-gray-500">New and updated support tickets</p>
                </div>
                <Checkbox
                  checked={notifications.pushTickets}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushTickets: checked as boolean })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <p className="font-medium">Reminders</p>
                  <p className="text-sm text-gray-500">Task and appointment reminders</p>
                </div>
                <Checkbox
                  checked={notifications.pushReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushReminders: checked as boolean })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Business Pro</h3>
                    <Badge style={{ backgroundColor: TROJAN_GOLD, color: TROJAN_NAVY }}>
                      Current Plan
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Unlimited staff, advanced analytics, priority support
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: TROJAN_NAVY }}>
                    $49
                  </p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline">View Plans</Button>
                <Button variant="outline">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/26</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: "Jan 1, 2024", amount: "$49.00", status: "Paid" },
                  { date: "Dec 1, 2023", amount: "$49.00", status: "Paid" },
                  { date: "Nov 1, 2023", amount: "$49.00", status: "Paid" },
                ].map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-gray-500">Business Pro - Monthly</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{invoice.amount}</span>
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password
              </CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div />
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button style={{ backgroundColor: TROJAN_NAVY }}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-gray-500">
                    Two-factor authentication is not enabled
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { device: "Chrome on Windows", location: "Harare, ZW", current: true },
                  { device: "Safari on iPhone", location: "Harare, ZW", current: false },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{session.location}</p>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value="trj_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Keep your API key secret. Do not share it publicly.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Regenerate Key</Button>
                <Button variant="outline">View Documentation</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>Third-party integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Google Calendar", description: "Sync appointments", connected: true },
                  { name: "WhatsApp Business", description: "Customer messaging", connected: true },
                  { name: "Xero Accounting", description: "Invoice sync", connected: false },
                  { name: "Mailchimp", description: "Email marketing", connected: false },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                    {integration.connected ? (
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    ) : (
                      <Button size="sm" style={{ backgroundColor: TROJAN_NAVY }}>
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
