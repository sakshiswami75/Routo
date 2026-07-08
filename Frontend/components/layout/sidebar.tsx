"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HelpCircle, LogOut, PackagePlus, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navItems } from "@/components/layout/nav-items";
import { useAuthStore } from "@/store/auth-store";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-low p-4 md:flex">
      <Link href="/dashboard" className="mb-4 flex items-center gap-3 px-2 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Routo</h1>
          <p className="font-geist text-xs font-medium uppercase text-outline">Reliable Logistics</p>
        </div>
      </Link>

      <div className="mb-3 rounded-lg px-4 py-3">
        <p className="font-geist text-xs font-medium uppercase text-outline">Welcome back</p>
        <p className="text-sm font-bold text-primary">Your route network</p>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto">
        {navItems.slice(0, 7).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-on-surface-variant transition-all hover:translate-x-1 hover:bg-surface-variant",
                isActive && "bg-primary-container font-semibold text-on-primary-container"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant pt-4">
        <Button className="mb-4 w-full" onClick={() => router.push("/parcels/new")}>
          <PackagePlus className="h-5 w-5" />
          Start a Delivery
        </Button>
        <a className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:text-primary" href="#">
          <HelpCircle className="h-5 w-5" />
          Help Center
        </a>
        <button
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:text-error"
          onClick={() => {
            logout();
            router.push("/auth");
          }}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
