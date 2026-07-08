import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-card rounded-xl", className)} {...props} />;
}

export function SurfaceCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-outline-variant bg-surface-lowest shadow-sm", className)}
      {...props}
    />
  );
}
