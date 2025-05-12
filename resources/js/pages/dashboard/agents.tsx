import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/call/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/call/avatar";
import { Badge } from "@/components/ui/call/badge";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agents',
        href: '/dashboard/agents',
    },
];

export default function Tickets() {
    const [userRole, setUserRole] = useState("supervisor");
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agents" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {userRole === "supervisor"
                            ? "Supervisor Dashboard"
                            : "Agent Dashboard"}
                    </h1>     
                    <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Agent Performance</CardTitle>
                                    <CardDescription>
                                        Detailed metrics for your team
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs uppercase bg-muted/50">
                                                <tr>
                                                    <th className="px-4 py-3">Agent</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3">Calls Today</th>
                                                    <th className="px-4 py-3">Avg. Call Time</th>
                                                    <th className="px-4 py-3">Tickets Resolved</th>
                                                    <th className="px-4 py-3">Satisfaction</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="px-4 py-3 flex items-center">
                                                        <Avatar className="h-6 w-6 mr-2">
                                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent1" />
                                                            <AvatarFallback>AS</AvatarFallback>
                                                        </Avatar>
                                                        Alice Smith
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="default">Online</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">18</td>
                                                    <td className="px-4 py-3">3:24</td>
                                                    <td className="px-4 py-3">7</td>
                                                    <td className="px-4 py-3 flex items-center">
                                                        <span className="mr-2">95%</span>
                                                        <CheckCircle size={16} className="text-green-500" />
                                                    </td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-4 py-3 flex items-center">
                                                        <Avatar className="h-6 w-6 mr-2">
                                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent2" />
                                                            <AvatarFallback>BJ</AvatarFallback>
                                                        </Avatar>
                                                        Bob Johnson
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="secondary">On Call</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">22</td>
                                                    <td className="px-4 py-3">4:12</td>
                                                    <td className="px-4 py-3">5</td>
                                                    <td className="px-4 py-3 flex items-center">
                                                        <span className="mr-2">88%</span>
                                                        <CheckCircle size={16} className="text-green-500" />
                                                    </td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-4 py-3 flex items-center">
                                                        <Avatar className="h-6 w-6 mr-2">
                                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent3" />
                                                            <AvatarFallback>CW</AvatarFallback>
                                                        </Avatar>
                                                        Carol Williams
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="outline">Break</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">15</td>
                                                    <td className="px-4 py-3">2:45</td>
                                                    <td className="px-4 py-3">10</td>
                                                    <td className="px-4 py-3 flex items-center">
                                                        <span className="mr-2">92%</span>
                                                        <CheckCircle size={16} className="text-green-500" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 flex items-center">
                                                        <Avatar className="h-6 w-6 mr-2">
                                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent4" />
                                                            <AvatarFallback>DB</AvatarFallback>
                                                        </Avatar>
                                                        Dave Brown
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="destructive">Offline</Badge>
                                                    </td>
                                                    <td className="px-4 py-3">0</td>
                                                    <td className="px-4 py-3">-</td>
                                                    <td className="px-4 py-3">0</td>
                                                    <td className="px-4 py-3 flex items-center">
                                                        <span className="mr-2">-</span>
                                                        <AlertCircle
                                                            size={16}
                                                            className="text-muted-foreground"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                </div>
            </div>
        </AppLayout>
    );
}
