import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  meta,
  accent = "primary"
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  meta?: string;
  accent?: "primary" | "secondary" | "tertiary";
}) {
  return (
    <Card className={cn("flex h-40 flex-col justify-between p-6 transition-all hover:shadow-xl", accent === "primary" && "border-l-4 border-l-primary")}>
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "rounded-lg p-2",
            accent === "primary" && "bg-primary/10 text-primary",
            accent === "secondary" && "bg-secondary-container/10 text-secondary",
            accent === "tertiary" && "bg-tertiary-container/10 text-tertiary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {meta ? <span className="font-geist text-xs font-medium text-secondary">{meta}</span> : null}
      </div>
      <div>
        <p className="font-geist text-xs font-medium uppercase tracking-wider text-outline">{label}</p>
        <h2 className="text-3xl font-bold text-on-surface">{value}</h2>
      </div>
    </Card>
  );
}
