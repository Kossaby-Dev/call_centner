import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import TicketSystem from "@/components/tickets/TicketSystem";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: '/dashboard/tickets',
    },
];

export default function Tickets() {
    const [userRole, setUserRole] = useState("supervisor");
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
                    <TicketSystem userRole={userRole} />
                </div>
            </div>
        </AppLayout>
    );
}
