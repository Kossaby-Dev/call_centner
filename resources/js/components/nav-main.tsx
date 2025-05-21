import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { BookOpen, Folder, User, Activity, Ticket, Phone, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';


interface Notification {
    user_id: number;
    title: string;
    message: string;
    type: string;
    related_type: string;
    created_at: string;
    updated_at: string;
    related_id?: number;
    read: boolean;
}


interface PageProps {
    [key: string]: any;
    notification: {
        data: Notification[];
        links: any;
    };
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/notifications');
                console.log(response.data.data)
                setNotifications(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchNotifications();
        
        // Set up interval to refresh notifications periodically
        const interval = setInterval(fetchNotifications, 60000); // Update every minute
        
        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    // const markAsRead = async (notificationId) => {
    //     try {
    //         await axios.post(`/api/notifications/${notificationId}/mark-as-read`);
    //         // Update the notification in the state
    //         setNotifications(notifications.map((notification) => 
    //             notification.id === notificationId 
    //                 ? { ...notification, read: true } 
    //                 : notification
    //         ));
    //     } catch (error) {
    //         console.error('Failed to mark notification as read:', error);
    //     }
    // };
    
    
    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/mark-all-as-read');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton  
                            asChild isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                 <div className="mt-auto pt-8">
                    <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <Bell size={16} className="mr-2" />
                            Notifications
                        </div>
                        {(notifications && notifications.length > 0) && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                        {loading ? (
                            <div className="text-xs p-2 text-center text-gray-500">Loading notifications...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    className={`text-xs p-2 border rounded-md cursor-pointer transition-colors ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                                   // onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="font-medium">{notification.message}</div>
                                    <div className="text-muted-foreground mt-1 flex justify-between">
                                        <span>{new Date(notification.created_at).toLocaleString()}</span>
                                        {!notification.read && (
                                            <span className="text-blue-600 text-xs">New</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs p-2 text-center text-gray-500">No notifications</div>
                        )}
                    </div>
                </div>
            </SidebarMenu>
        </SidebarGroup>
    );
}
