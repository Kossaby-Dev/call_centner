import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CallManagement from "@/components/calls/CallManagement";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calls',
        href: '/dashboard/Calls',
    },
];

export default function Calls() {
    const [userRole, setUserRole] = useState<"supervisor" | "agent">("supervisor");
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calls" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {userRole === "supervisor"
                            ? "Supervisor Dashboard"
                            : "Agent Dashboard"}
                    </h1>
                    <CallManagement userRole={userRole} />
                </div>
            </div>
        </AppLayout>
    );
}
