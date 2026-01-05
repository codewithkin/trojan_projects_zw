"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TROJAN_NAVY = "#0F1B4D";

export default function ServicesPage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold" style={{ color: TROJAN_NAVY }}>
                    Our Services
                </h1>
                <p className="text-gray-600 mt-1">Browse our engineering solutions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Solar Power Systems</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">1.5 KVA to 10 KVA installations starting from US$750</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>CCTV & Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Professional surveillance systems with 24/7 monitoring</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Electrical Systems</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Complete electrical installations and repairs</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Water Solutions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Borehole drilling, pumps, and water systems</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Welding & Fabrication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Custom metalwork and fabrication services</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
