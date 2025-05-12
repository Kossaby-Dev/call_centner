import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Phone,
    Ticket,
    Clock,
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
import { Progress } from "@/components/ui/call/progress";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [userRole, setUserRole] = useState("supervisor");
    // Mock data for KPIs
    const agentKPIs = {
        callsHandled: 24,
        avgCallTime: "3:45",
        ticketsResolved: 12,
        satisfaction: 92,
    };

    const teamKPIs = {
        totalCalls: 156,
        avgWaitTime: "1:20",
        openTickets: 34,
        agentsActive: 8,
    };

    // Mock data for agents (for supervisor view)
    const agents = [
        { id: 1, name: "Alice Smith", status: "online", calls: 18, tickets: 7 },
        { id: 2, name: "Bob Johnson", status: "on-call", calls: 22, tickets: 5 },
        { id: 3, name: "Carol Williams", status: "break", calls: 15, tickets: 10 },
        { id: 4, name: "Dave Brown", status: "offline", calls: 0, tickets: 0 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overview" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {userRole === "supervisor"
                            ? "Supervisor Dashboard"
                            : "Agent Dashboard"}
                    </h1>

                    <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {userRole === "agent" ? (
                                    <>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Calls Handled
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {agentKPIs.callsHandled}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Today</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Avg. Call Time
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {agentKPIs.avgCallTime}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Minutes</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Tickets Resolved
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {agentKPIs.ticketsResolved}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Today</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Satisfaction
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {agentKPIs.satisfaction}%
                                                </div>
                                                <Progress
                                                    value={agentKPIs.satisfaction}
                                                    className="mt-2"
                                                />
                                            </CardContent>
                                        </Card>
                                    </>
                                ) : (
                                    <>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Total Calls
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {teamKPIs.totalCalls}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Today</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Avg. Wait Time
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {teamKPIs.avgWaitTime}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Minutes</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Open Tickets
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {teamKPIs.openTickets}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Pending</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Agents Active
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {teamKPIs.agentsActive}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Of 12 total
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </div>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your latest calls and tickets</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="mr-4 bg-primary/10 p-2 rounded-full">
                                                <Phone size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Call with Jane Smith</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Issue resolved in 4:32 minutes
                                                </p>
                                            </div>
                                            <div className="ml-auto text-sm text-muted-foreground">
                                                <Clock size={14} className="inline mr-1" /> 35 mins ago
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 bg-primary/10 p-2 rounded-full">
                                                <Ticket size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Ticket #4321 Updated</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Added response to customer inquiry
                                                </p>
                                            </div>
                                            <div className="ml-auto text-sm text-muted-foreground">
                                                <Clock size={14} className="inline mr-1" /> 1 hour ago
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 bg-primary/10 p-2 rounded-full">
                                                <Phone size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Call with Mike Johnson</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Transferred to technical support
                                                </p>
                                            </div>
                                            <div className="ml-auto text-sm text-muted-foreground">
                                                <Clock size={14} className="inline mr-1" /> 2 hours ago
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Agent Status (Supervisor View) */}
                            {userRole === "supervisor" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Agent Status</CardTitle>
                                        <CardDescription>Current status of your team</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {agents.map((agent) => (
                                                <div key={agent.id} className="flex items-center">
                                                    <Avatar className="h-8 w-8 mr-2">
                                                        <AvatarImage
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${agent.id}`}
                                                        />
                                                        <AvatarFallback>
                                                            {agent.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{agent.name}</p>
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={
                                                                    agent.status === "online"
                                                                        ? "default"
                                                                        : agent.status === "on-call"
                                                                            ? "secondary"
                                                                            : agent.status === "break"
                                                                                ? "outline"
                                                                                : "destructive"
                                                                }
                                                                className="text-xs mr-2"
                                                            >
                                                                {agent.status}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {agent.calls} calls · {agent.tickets} tickets
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-auto flex space-x-2">
                                                        <Phone
                                                            size={16}
                                                            className="text-muted-foreground hover:text-primary cursor-pointer"
                                                        />
                                                        <Ticket
                                                            size={16}
                                                            className="text-muted-foreground hover:text-primary cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                </div>
            </div>
        </AppLayout>
    );
}
