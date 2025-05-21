import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Separator } from "@/components/ui/call/separator";

import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, User, Activity, Ticket, Phone, Bell } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Activity,
    },
    {
        title: 'Calls',
        href: '/dashboard/calls',
        icon: Phone,
    },
    {
        title: 'Tickets',
        href: '/dashboard/tickets',
        icon: Ticket,
    },
    {
        title: 'Agents',
        href: '/dashboard/agents',
        icon: User,
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <AppLogo />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="my-2" />
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
