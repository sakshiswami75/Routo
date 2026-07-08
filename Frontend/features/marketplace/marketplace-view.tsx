"use client";

import { Bolt, CalendarDays, Filter, Package, Search, ShieldCheck, Weight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input, Select } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsync } from "@/hooks/use-async";
import { currency, shortDate } from "@/lib/utils";
import { deliveryService } from "@/services/delivery.service";
import { parcelService } from "@/services/parcel.service";

export function MarketplaceView() {
  const [destination, setDestination] = useState("");
  const [minReward, setMinReward] = useState(0);
  const { data, error, isLoading, refetch } = useAsync(() => parcelService.getAll());

  const parcels = useMemo(() => {
    return (data ?? [])
      .filter((parcel) => parcel.status === "PENDING")
      .filter((parcel) => parcel.dropLocation.toLowerCase().includes(destination.toLowerCase()))
      .filter((parcel) => parcel.rewardAmount >= minReward)
      .sort((a, b) => b.rewardAmount - a.rewardAmount);
  }, [data, destination, minReward]);

  async function accept(parcelId: string) {
    try {
      await deliveryService.accept(parcelId);
      toast.success("Delivery request accepted");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to accept delivery");
    }
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold md:text-4xl">Route Marketplace</h1>
          <p className="text-on-surface-variant">Browse available parcels along your travel routes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Saved Filters
          </Button>
          <Button onClick={() => (window.location.href = "/routes/new")}>Post a Route</Button>
        </div>
      </header>

      <SurfaceCard className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="font-geist text-xs font-semibold uppercase text-outline">Destination</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <Input className="pl-10" placeholder="Enter destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="font-geist text-xs font-semibold uppercase text-outline">Travel Date</label>
            <Input type="date" />
          </div>
          <div>
            <label className="font-geist text-xs font-semibold uppercase text-outline">Max Parcel Size</label>
            <Select defaultValue="any">
              <option value="any">Any Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </div>
          <div>
            <label className="font-geist text-xs font-semibold uppercase text-outline">Min Earnings</label>
            <div className="flex h-12 items-center gap-3">
              <input className="h-2 flex-1 accent-primary" max="500" min="0" step="5" type="range" value={minReward} onChange={(e) => setMinReward(Number(e.target.value))} />
              <span className="w-16 font-geist text-sm text-on-surface-variant">{currency(minReward)}+</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <div className="flex items-center justify-between">
        <span className="font-geist text-xs font-semibold uppercase text-on-surface-variant">Showing {parcels.length} available parcels</span>
        <Select className="w-52 border-none bg-transparent text-primary" defaultValue="reward">
          <option value="reward">Highest Earnings</option>
          <option value="latest">Latest</option>
        </Select>
      </div>

      {parcels.length ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {parcels.map((parcel, index) => (
            <SurfaceCard className="flex flex-col justify-between p-6 transition hover:border-primary/40 hover:shadow-lg" key={parcel.id}>
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <Badge className={index % 3 === 0 ? "border-primary/20 bg-primary/10 text-primary" : "border-orange-200 bg-orange-100 text-orange-800"}>
                    <Bolt className="h-3.5 w-3.5" />
                    {index % 3 === 0 ? "Urgent" : "Regular"}
                  </Badge>
                  <span className="font-geist text-xs font-medium text-on-surface-variant">{shortDate(parcel.createdAt)}</span>
                </div>
                <div className="mb-6 flex gap-4">
                  <div className="flex flex-col items-center py-1">
                    <div className="h-3 w-3 rounded-full border-2 border-primary" />
                    <div className="my-1 w-0.5 flex-1 bg-outline-variant" />
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{parcel.pickupLocation}</h3>
                    <h3 className="text-xl font-semibold">{parcel.dropLocation}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/60 pt-4 text-sm">
                  <Meta icon={Package} label="Parcel" value={parcel.title} />
                  <Meta icon={Weight} label="Weight" value={`${parcel.weight} kg`} />
                  <Meta icon={ShieldCheck} label="Status" value={<StatusBadge status={parcel.status} />} />
                  <Meta icon={CalendarDays} label="Posted" value={shortDate(parcel.createdAt)} />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-outline-variant/60 pt-4">
                <div>
                  <p className="font-geist text-[10px] font-semibold uppercase text-outline">Est. Earnings</p>
                  <p className="text-2xl font-bold text-primary">{currency(parcel.rewardAmount)}</p>
                </div>
                <Button onClick={() => accept(parcel.id)}>Accept Delivery</Button>
              </div>
            </SurfaceCard>
          ))}
        </section>
      ) : (
        <EmptyState title="No matching parcels" description="Adjust filters or create a route so the backend can match nearby parcels." />
      )}
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-outline" />
      <div>
        <p className="font-geist text-[10px] font-semibold uppercase text-outline">{label}</p>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
