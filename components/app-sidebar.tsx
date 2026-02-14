"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  Command,
  House,
  ShieldX,
  File,
  ChartNoAxesCombined,
  BadgeDollarSign,
  UserRound,
  Ban,
  Bell,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  {
    title: "Статистика",
    url: "/dashboard/stats",
    icon: ChartNoAxesCombined,
    roles: ["admin", "editor", "viewer"],
  },
  {
    title: "Міста",
    url: "/dashboard/cities",
    icon: House,
    roles: ["admin", "editor"],
  },
  {
    title: "Заблоковані",
    url: "/dashboard/banned",
    icon: ShieldX,
    roles: ["admin"],
  },
  {
    title: "Бот-трафік",
    url: "/dashboard/bot-hits",
    icon: Bot,
    roles: ["admin", "editor"],
  },
  {
    title: "Запити користувачів",
    url: "/dashboard/request-logs",
    icon: File,
    roles: ["admin", "editor"],
  },
  {
    title: "Реклама",
    url: "/dashboard/ads",
    icon: BadgeDollarSign,
    roles: ["admin"],
  },
  {
    title: "Адміни",
    url: "/dashboard/admins",
    icon: UserRound,
    roles: ["admin"],
  },
  {
    title: "Бан",
    url: "/dashboard/temp-ban",
    icon: Ban,
    roles: ["admin"],
  },
  {
    title: "Оголошення",
    url: "/dashboard/announcements",
    icon: Bell,
    roles: ["admin", "editor"],
  },
  {
    title: "Технічні роботи",
    url: "/dashboard/maintenance",
    icon: Settings,
    roles: ["admin"],
  },
];

const user = {
  name: "Микита",
  email: "m@example.com",
  avatar: "/Admin.jpg",
  role: "admin",
};
// /cities
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navMain = navItems
    .filter((item) => item.roles.includes(user.role)) // 🔹 оставляем только доступные
    .map((item) => {
      const fullUrl = `/dashboard${item.url}`;
      return {
        ...item,
        isActive: pathname === fullUrl || pathname.startsWith(fullUrl + "/"),
      };
    });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                  <Image
                    src="/CRM-logo.png"
                    alt="Описание картинки"
                    width={25}
                    height={25}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CRM Pogodka</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
