"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuthStore } from "@/store/auth-store";

const titles: Record<string, string> = {
  "/dashboard": "Earnings Overview",
  "/marketplace": "Route Marketplace",
  "/parcels/new": "Book Parcel",
  "/routes/new": "Create Route",
  "/deliveries": "My Deliveries",
  "/profile": "Profile",
  "/reviews": "Reviews"
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace("/auth");
  }, [router, token]);

  if (!token) return null;

  return (
    <>
      <Sidebar />
      <main className="min-h-screen pb-20 md:ml-64 md:pb-0">
        <Topbar title={titles[pathname] ?? "Routo"} />
        <div className="mx-auto max-w-[1280px] space-y-8 p-4 md:p-8">{children}</div>
        <Footer />
      </main>
      <MobileNav />
    </>
  );
}
