import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TicketSystem from "@/components/tickets/TicketSystem";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: '/dashboard/tickets',
    },
];


interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: "open" | "in-progress" | "resolved" | "closed";
    priority: "low" | "medium" | "high" | "urgent";
    created_at: string;
    updated_at: string;
    assigned_to?: number;
    assignee?: {
        id: number;
        name: string;
    };
    ticket_number: string;
    call: {
        client_name: string;
        client_phone: string;
    };
    comments: {
        ticket_id: number;
        user_id: number;
        comment: string;
        created_at: string;
        user: {
            name: string;
            role: string;
        };
    }[];
}

interface PageProps {
    [key: string]: any;
    userRole: 'supervisor' | 'agent';
    tickets: {
        data: Ticket[];
        links: any;
    };
    agents?: Array<{
        id: number;
        name: string;
    }>;
}

export default function Tickets() {
    const { userRole, tickets, agents } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tickets" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {userRole === "supervisor"
                            ? "Supervisor Dashboard"
                            : "Agent Dashboard"}
                    </h1>
                    <TicketSystem
                        userRole={userRole}
                        tickets={tickets.data}
                        links={tickets.links}
                        agents={agents}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
