"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Save, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, SurfaceCard } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { FieldError, Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading";
import { useAsync } from "@/hooks/use-async";
import { initials, shortDate } from "@/lib/utils";
import { profileSchema } from "@/lib/validations";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth-store";

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileView() {
  const setUser = useAuthStore((state) => state.setUser);
  const { data, error, isLoading, refetch } = useAsync(() => profileService.getMe());
  const form = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { name: "", email: "" } });

  useEffect(() => {
    if (data) form.reset({ name: data.name, email: data.email });
  }, [data, form]);

  async function onSubmit(values: ProfileValues) {
    try {
      const updated = await profileService.updateMe(values);
      setUser(updated);
      toast.success("Profile updated");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update profile");
    }
  }

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <Card className="p-6 md:p-8 lg:col-span-8" id="settings">
        <h1 className="text-2xl font-semibold md:text-4xl">Profile</h1>
        <p className="mb-8 text-on-surface-variant">Manage your Routo identity. Password and verification APIs are not implemented yet.</p>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="font-geist text-xs font-semibold uppercase text-outline">Name</label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <Input className="pl-10" {...form.register("name")} />
            </div>
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div>
            <label className="font-geist text-xs font-semibold uppercase text-outline">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <Input className="pl-10" {...form.register("email")} />
            </div>
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <Button disabled={form.formState.isSubmitting}>
            <Save className="h-4 w-4" />
            Save Profile
          </Button>
        </form>
      </Card>
      <aside className="space-y-6 lg:col-span-4">
        <SurfaceCard className="p-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-xl font-bold text-on-primary-container">
            {initials(data.name)}
          </div>
          <h3 className="text-xl font-semibold">{data.name}</h3>
          <p className="text-sm text-on-surface-variant">{data.email}</p>
          <p className="mt-4 font-geist text-xs font-medium text-outline">Member since {shortDate(data.createdAt)}</p>
        </SurfaceCard>
      </aside>
    </div>
  );
}
