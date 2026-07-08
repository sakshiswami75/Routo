"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, LocateFixed, PackagePlus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, SurfaceCard } from "@/components/ui/card";
import { FieldError, Input, Textarea } from "@/components/ui/input";
import { parcelSchema } from "@/lib/validations";
import { parcelService } from "@/services/parcel.service";

type ParcelValues = z.infer<typeof parcelSchema>;

export function CreateParcelForm() {
  const router = useRouter();
  const form = useForm<ParcelValues>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      title: "",
      description: "",
      pickupLocation: "",
      dropLocation: "",
      weight: 2.5,
      rewardAmount: 15
    }
  });

  async function onSubmit(values: ParcelValues) {
    try {
      await parcelService.create(values);
      toast.success("Parcel created successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create parcel");
    }
  }

  const weight = form.watch("weight");
  const reward = form.watch("rewardAmount");

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <section className="lg:col-span-8">
        <Card className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Parcel Details</h1>
            <p className="text-on-surface-variant">Fill in the information below to find the perfect traveler.</p>
          </div>
          <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">Title</label>
              <Input {...form.register("title")} placeholder="Electronics, documents, apparel..." />
              <FieldError message={form.formState.errors.title?.message} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Pickup Location</label>
                <div className="relative">
                  <LocateFixed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <Input className="pl-10" {...form.register("pickupLocation")} placeholder="Enter pickup address" />
                </div>
                <FieldError message={form.formState.errors.pickupLocation?.message} />
              </div>
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Drop Location</label>
                <Input {...form.register("dropLocation")} placeholder="Enter destination address" />
                <FieldError message={form.formState.errors.dropLocation?.message} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-geist text-xs font-semibold uppercase text-outline">Weight</label>
                  <span className="font-geist text-sm font-bold text-primary">{weight} kg</span>
                </div>
                <Input max="25" min="0.1" step="0.1" type="range" {...form.register("weight", { valueAsNumber: true })} />
                <FieldError message={form.formState.errors.weight?.message} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-geist text-xs font-semibold uppercase text-outline">Reward Amount</label>
                  <span className="font-geist text-sm font-bold text-primary">${reward}</span>
                </div>
                <Input max="500" min="1" step="1" type="range" {...form.register("rewardAmount", { valueAsNumber: true })} />
                <FieldError message={form.formState.errors.rewardAmount?.message} />
              </div>
            </div>
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">Description</label>
              <Textarea {...form.register("description")} placeholder="Describe fragility, size, or special handling..." />
            </div>
            <Button className="h-14 w-full text-base" disabled={form.formState.isSubmitting}>
              <PackagePlus className="h-5 w-5" />
              Find a Traveler
            </Button>
          </form>
        </Card>
      </section>

      <aside className="space-y-6 lg:col-span-4">
        <Card className="p-6">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-primary">
            <CalendarDays className="h-5 w-5" />
            Route Insights
          </h3>
          <div className="space-y-4">
            <Insight label="Estimated Matching Time" value="~15 mins" />
            <Insight label="Verified available on route" value="Live after parcel save" />
          </div>
          <div className="mt-5 border-t border-outline-variant pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Estimated Cost</span>
              <span className="font-bold">${reward}</span>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-on-surface-variant">Service Fee</span>
              <span className="font-bold">$1.50</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-outline-variant pt-3 text-base">
              <span className="font-bold">Total Est.</span>
              <span className="font-bold text-primary">${Number(reward || 0) + 1.5}</span>
            </div>
          </div>
        </Card>
        <SurfaceCard className="p-6">
          <div className="flex gap-4">
            <Shield className="h-6 w-6 text-secondary" />
            <div>
              <p className="font-bold">Routo Protection</p>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                Every parcel flow is tied to authenticated users and delivery status transitions in the backend.
              </p>
            </div>
          </div>
        </SurfaceCard>
      </aside>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
      <p className="font-bold">{value}</p>
      <p className="font-geist text-xs font-medium text-on-surface-variant">{label}</p>
    </div>
  );
}
