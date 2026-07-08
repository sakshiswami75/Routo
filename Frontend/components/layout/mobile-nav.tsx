"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, PackagePlus, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/marketplace", label: "Market", icon: Map },
  { href: "/parcels/new", label: "Send", icon: PackagePlus },
  { href: "/deliveries", label: "Routes", icon: Truck },
  { href: "/profile", label: "Profile", icon: User }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-outline-variant bg-surface-highest/90 px-2 py-3 backdrop-blur-xl md:hidden">
      {mobileItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            href={item.href}
            key={item.href}
            className={cn("flex min-w-14 flex-col items-center gap-1 text-on-surface-variant", active && "text-primary")}
          >
            <Icon className={cn("h-5 w-5", item.label === "Send" && "h-6 w-6")} />
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
