import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CallManagement from "@/components/calls/CallManagement";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calls',
        href: '/dashboard/calls',
    },
];

interface Call {
    id: number;
  client_name: string;
  client_phone: string;
  call_type: 'entrant' | 'sortant';
  status: "incoming" | "active" | "on-hold" | "ended";
  duration: number | null;
  notes: string | null;
  satisfaction_rating: number | null;
  created_at: string;
}

interface PageProps {
    [key: string]: any;
    userRole: 'supervisor' | 'agent';
    calls: {
        data: Call[];
        links: any;
    };
    agents?: Array<{
        id: number;
        name: string;
    }>;
}

export default function Calls() {
    const { userRole, calls, agents } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calls" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {userRole === "supervisor"
                            ? "Call Management"
                            : "My Calls"}
                    </h1>
                    <CallManagement 
                        userRole={userRole} 
                        calls={calls.data}
                        agents={agents}
                        links={calls.links}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
