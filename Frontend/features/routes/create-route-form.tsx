"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Map, RouteIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, SurfaceCard } from "@/components/ui/card";
import { FieldError, Input, Select } from "@/components/ui/input";
import { routeSchema } from "@/lib/validations";
import { routeService } from "@/services/route.service";

type RouteValues = z.infer<typeof routeSchema>;

export function CreateRouteForm() {
  const router = useRouter();
  const form = useForm<RouteValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      fromCity: "",
      toCity: "",
      vehicleType: "Car",
      availableCapacity: 5,
      travelDate: ""
    }
  });

  async function onSubmit(values: RouteValues) {
    try {
      await routeService.create(values);
      toast.success("Route posted successfully");
      router.push("/marketplace");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create route");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <Card className="p-6 md:p-8 lg:col-span-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Create Route</h1>
          <p className="text-on-surface-variant">Tell Routo where you are traveling so available parcels can be matched.</p>
        </div>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">From City</label>
              <Input {...form.register("fromCity")} placeholder="Pune" />
              <FieldError message={form.formState.errors.fromCity?.message} />
            </div>
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">To City</label>
              <Input {...form.register("toCity")} placeholder="Mumbai" />
              <FieldError message={form.formState.errors.toCity?.message} />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">Vehicle Type</label>
              <Select {...form.register("vehicleType")}>
                <option>Car</option>
                <option>Bike</option>
                <option>Train</option>
                <option>Bus</option>
                <option>Flight</option>
              </Select>
            </div>
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">Capacity (kg)</label>
              <Input min="0.1" step="0.1" type="number" {...form.register("availableCapacity", { valueAsNumber: true })} />
              <FieldError message={form.formState.errors.availableCapacity?.message} />
            </div>
            <div>
              <label className="font-geist text-xs font-semibold uppercase text-outline">Travel Date</label>
              <Input type="datetime-local" {...form.register("travelDate")} />
              <FieldError message={form.formState.errors.travelDate?.message} />
            </div>
          </div>
          <Button className="h-14 w-full text-base" disabled={form.formState.isSubmitting}>
            <RouteIcon className="h-5 w-5" />
            Post Route
          </Button>
        </form>
      </Card>
      <aside className="space-y-6 lg:col-span-4">
        <SurfaceCard className="p-6">
          <Map className="mb-4 h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold">Marketplace visibility</h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            Routes are stored through `POST /api/routes` and can later be used with `GET /api/routes/:routeId/matches`.
          </p>
        </SurfaceCard>
        <Card className="p-6">
          <CalendarDays className="mb-4 h-8 w-8 text-secondary" />
          <h3 className="text-xl font-semibold">Future travel only</h3>
          <p className="mt-2 text-sm text-on-surface-variant">The backend validator rejects past travel dates, so this form mirrors that workflow.</p>
        </Card>
      </aside>
    </div>
  );
}
