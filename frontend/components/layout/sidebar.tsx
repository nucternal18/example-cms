"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Video,
  Megaphone,
  MapPin,
  Bell,
  MessageSquare,
  File,
  FileQuestion,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pages", href: "/dashboard/pages", icon: File },
  { name: "Forms", href: "/dashboard/forms", icon: FileQuestion },
  { name: "Articles", href: "/dashboard/content/articles", icon: FileText },
  { name: "Videos", href: "/dashboard/content/videos", icon: Video },
  { name: "Ads", href: "/dashboard/content/ads", icon: Megaphone },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">CMS Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
