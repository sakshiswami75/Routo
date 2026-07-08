"use client";

import { Menu, MessageCircle, Search } from "lucide-react";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function Topbar({ title }: { title?: string }) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/75 px-4 py-4 shadow-sm backdrop-blur-xl md:border-b-0 md:px-8">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="rounded-lg p-2 text-primary md:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="hidden text-xl font-semibold text-on-surface md:block">{title ?? "Routo"}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-primary/5" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-primary/5" aria-label="Messages">
            <MessageCircle className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-variant text-sm font-bold text-primary">
            {initials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
}
