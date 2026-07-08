export function LoadingState({ label = "Loading Routo data..." }: { label?: string }) {
  return (
    <div className="grid gap-4">
      <div className="h-28 animate-pulse rounded-xl bg-surface-container" />
      <div className="h-56 animate-pulse rounded-xl bg-surface-container" />
      <p className="text-sm text-on-surface-variant">{label}</p>
    </div>
  );
}
