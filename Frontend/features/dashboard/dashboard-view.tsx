"use client";

import { CalendarDays, Filter, Map, Package2, ShieldCheck, Truck, WalletCards } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, SurfaceCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/features/dashboard/stat-card";
import { useAsync } from "@/hooks/use-async";
import { currency, shortDate } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard.service";

export function DashboardView() {
  const { data, error, isLoading, refetch } = useAsync(() => dashboardService.getDashboard());

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return <EmptyState title="No dashboard data" description="Create a parcel or route to activate your Routo dashboard." />;

  const recentDeliveries = data.carrier.recentDeliveries ?? [];
  const recentParcels = data.sender.recentParcels ?? [];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-on-background md:text-4xl">Welcome back, {data.user.name}!</h1>
          <p className="mt-1 text-on-surface-variant">Your logistics network is active and ready for today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <CalendarDays className="h-4 w-4" />
            {shortDate(new Date())}
          </Button>
          <Button onClick={() => undefined} variant="secondary">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Truck} label="Active Deliveries" value={data.carrier.deliveriesInTransit} meta="+ live" />
        <StatCard
          icon={WalletCards}
          label="Earnings"
          value={currency(recentDeliveries.reduce((sum, delivery) => sum + (delivery.parcel?.rewardAmount ?? 0), 0))}
          meta="recent"
          accent="secondary"
        />
        <StatCard icon={Package2} label="Pending Parcels" value={data.sender.pendingParcels} accent="tertiary" />
        <StatCard icon={ShieldCheck} label="Success Rate" value={`${Math.round(data.carrier.averageRating * 20)}%`} meta="rating based" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-outline-variant p-6">
            <h3 className="text-xl font-semibold">Recent Deliveries</h3>
            <Link className="font-geist text-xs font-semibold text-primary hover:underline" href="/deliveries">
              View All
            </Link>
          </div>
          <div className="custom-scrollbar overflow-x-auto">
            {recentDeliveries.length ? (
              <table className="w-full min-w-[680px] text-left">
                <thead className="bg-surface-low font-geist text-xs font-medium uppercase text-outline">
                  <tr>
                    <th className="px-6 py-3">Parcel</th>
                    <th className="px-6 py-3">Destination</th>
                    <th className="px-6 py-3">Accepted</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {recentDeliveries.map((delivery) => (
                    <tr className="transition hover:bg-surface-low/60" key={delivery.id}>
                      <td className="px-6 py-4 font-geist text-sm">{delivery.parcel?.title ?? delivery.parcelId}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{delivery.parcel?.dropLocation ?? "Destination unavailable"}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{shortDate(delivery.acceptedAt)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={delivery.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-bold">{currency(delivery.parcel?.rewardAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6">
                <EmptyState title="No carrier deliveries yet" description="Accept a parcel from the marketplace to see delivery activity here." />
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary p-6 text-on-primary">
            <h3 className="mb-6 text-xl font-semibold">Quick Actions</h3>
            <div className="grid gap-3">
              <Link className="flex items-center justify-between rounded-lg bg-white/10 p-4 transition hover:bg-white/20" href="/parcels/new">
                <span>Send Parcel</span>
                <Package2 className="h-5 w-5" />
              </Link>
              <Link className="flex items-center justify-between rounded-lg bg-white/10 p-4 transition hover:bg-white/20" href="/marketplace">
                <span>Find a Route</span>
                <Map className="h-5 w-5" />
              </Link>
            </div>
          </Card>
          <SurfaceCard className="p-6" id="earnings">
            <p className="font-geist text-xs font-semibold uppercase text-outline">Parcel Summary</p>
            <div className="mt-4 space-y-3 text-sm">
              {recentParcels.slice(0, 4).map((parcel) => (
                <div className="flex items-center justify-between" key={parcel.id}>
                  <span className="truncate pr-4">{parcel.title}</span>
                  <StatusBadge status={parcel.status} />
                </div>
              ))}
              {!recentParcels.length ? <p className="text-on-surface-variant">No recent sent parcels yet.</p> : null}
            </div>
          </SurfaceCard>
        </div>
      </section>
    </div>
  );
}
