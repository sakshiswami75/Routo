"use client";

import { CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsync } from "@/hooks/use-async";
import { currency, shortDate } from "@/lib/utils";
import { deliveryService } from "@/services/delivery.service";
import type { Delivery } from "@/types/models";

export function DeliveriesView() {
  const { data, error, isLoading, refetch } = useAsync(() => deliveryService.getMyDeliveries());
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function transition(delivery: Delivery, action: "pickup" | "transit" | "delivered") {
    setUpdatingId(delivery.id);
    try {
      if (action === "pickup") await deliveryService.markPickedUp(delivery.id);
      if (action === "transit") await deliveryService.markInTransit(delivery.id);
      if (action === "delivered") await deliveryService.markDelivered(delivery.id);
      toast.success(
        action === "pickup"
          ? "Parcel picked up"
          : action === "transit"
            ? "Delivery started"
            : "Delivery completed"
      );
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update delivery");
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data?.length) return <EmptyState title="No deliveries yet" description="Accept a marketplace parcel and it will appear here." />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold md:text-4xl">My Deliveries</h1>
        <p className="text-on-surface-variant">Track accepted parcels and move them through pickup, transit, and delivery.</p>
      </header>
      <section className="grid gap-6">
        {data.map((delivery) => (
          <Card className="p-6" key={delivery.id}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold">{delivery.parcel?.title ?? "Parcel delivery"}</h3>
                    <StatusBadge status={delivery.status} />
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {delivery.parcel?.pickupLocation ?? "Pickup"} to {delivery.parcel?.dropLocation ?? "Destination"}
                  </p>
                  <p className="mt-1 font-geist text-xs text-outline">
                    Accepted {shortDate(delivery.acceptedAt)} · Reward {currency(delivery.parcel?.rewardAmount)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {delivery.status === "ACCEPTED" ? (
                  <Button disabled={updatingId === delivery.id} onClick={() => transition(delivery, "pickup")} variant="secondary">
                    <PackageCheck className="h-4 w-4" />
                    {updatingId === delivery.id ? "Picking up..." : "Pick Up Parcel"}
                  </Button>
                ) : null}
                {delivery.status === "PICKED_UP" ? (
                  <Button disabled={updatingId === delivery.id} onClick={() => transition(delivery, "transit")} variant="secondary">
                    <Clock className="h-4 w-4" />
                    {updatingId === delivery.id ? "Starting..." : "Start Delivery"}
                  </Button>
                ) : null}
                {delivery.status === "IN_TRANSIT" ? (
                  <Button disabled={updatingId === delivery.id} onClick={() => transition(delivery, "delivered")}>
                    <CheckCircle2 className="h-4 w-4" />
                    {updatingId === delivery.id ? "Completing..." : "Complete Delivery"}
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
