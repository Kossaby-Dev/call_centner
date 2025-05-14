import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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

interface PageProps {
    [key: string]: any;
    userRole: 'supervisor' | 'agent';
    teamKPIs?: {
        totalCalls: number;
        avgWaitTime: string;
        openTickets: number;
        agentsActive: number;
    };
    agentKPIs?: {
        callsHandled: number;
        avgCallTime: string;
        ticketsResolved: number;
        satisfaction: number;
    };
    agents?: Array<{
        id: number;
        name: string;
        status: string;
        calls_count: number;
        tickets_count: number;
    }>;
}

export default function Dashboard() {
    const { userRole, teamKPIs, agentKPIs, agents } = usePage<PageProps>().props;

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
                                                {agentKPIs?.callsHandled}
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
                                                {agentKPIs?.avgCallTime}
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
                                                {agentKPIs?.ticketsResolved}
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
                                                {Math.round(agentKPIs?.satisfaction ?? 0)}%
                                            </div>
                                            <Progress
                                                value={agentKPIs?.satisfaction ?? 0}
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
                                                {teamKPIs?.totalCalls}
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
                                                {teamKPIs?.avgWaitTime}
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
                                                {teamKPIs?.openTickets}
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
                                                {teamKPIs?.agentsActive}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Of {agents?.length ?? 0} total
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
                        {userRole === "supervisor" && agents && (
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
                                                    <AvatarImage src={`https://avatar.vercel.sh/${agent.name}`} />
                                                    <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <p className="font-medium">{agent.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {agent.calls_count} calls today • {agent.tickets_count} open tickets
                                                    </p>
                                                </div>
                                                <Badge variant={
                                                    agent.status === 'online' ? 'default' :
                                                    agent.status === 'on-call' ? 'secondary' :
                                                    agent.status === 'break' ? 'outline' :
                                                    'destructive'
                                                }>
                                                    {agent.status}
                                                </Badge>
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
