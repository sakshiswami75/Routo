import { PackageOpen } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-lowest p-8 text-center">
      <PackageOpen className="mb-3 h-8 w-8 text-outline" />
      <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-on-surface-variant">{description}</p>
    </div>
  );
}
