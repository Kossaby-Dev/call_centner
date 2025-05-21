import AppLogoIcon from './app-logo-icon';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/call/avatar";
import { Badge } from "@/components/ui/call/badge";

import { router, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface PageProps extends InertiaPageProps {
    auth: {
      user: {
        id: number;
        name: string;
        role: string;
      };
    };
  }

export default function AppLogo() {
    const { auth } = usePage<PageProps>().props;
    return (
        <>
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Laravel Starter Kit</span>
            </div> */}
            <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user93" />
            <AvatarFallback>
              {auth.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{auth.user.name}</h3>
            <Badge variant="outline" className="capitalize">
              {auth.user.role}
            </Badge>
          </div>
        </div>
        </>
    );
}
