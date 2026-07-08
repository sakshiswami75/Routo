"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackageCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input } from "@/components/ui/input";
import { loginSchema, registerSchema } from "@/lib/validations";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  async function onLogin(values: LoginValues) {
    try {
      const session = await authService.login(values);
      setSession(session.user, session.token);
      toast.success("Welcome back to Routo");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function onRegister(values: RegisterValues) {
    try {
      await authService.register(values);
      toast.success("Account created. You can log in now.");
      setMode("login");
      loginForm.setValue("email", values.email);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-primary">Routo</h1>
              <p className="font-geist text-xs font-medium uppercase text-outline">Reliable Logistics</p>
            </div>
          </div>
          <div>
            <p className="font-geist text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Peer-to-peer delivery platform
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-on-surface md:text-5xl">
              Send parcels, publish routes, and track earnings from one calm dashboard.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Verified routes", "Parcel matching", "Delivery reviews"].map((item) => (
              <Card key={item} className="p-4">
                <PackageCheck className="mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-6 md:p-8">
          <div className="mb-6 flex rounded-lg bg-surface-container p-1">
            <button
              className={`flex-1 rounded-md py-2 text-sm font-semibold ${isLogin ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 rounded-md py-2 text-sm font-semibold ${!isLogin ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <form className="space-y-4" onSubmit={loginForm.handleSubmit(onLogin)}>
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Email</label>
                <Input {...loginForm.register("email")} placeholder="alex@routo.dev" />
                <FieldError message={loginForm.formState.errors.email?.message} />
              </div>
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Password</label>
                <Input {...loginForm.register("password")} placeholder="••••••••" type="password" />
                <FieldError message={loginForm.formState.errors.password?.message} />
              </div>
              <Button className="w-full" disabled={loginForm.formState.isSubmitting}>
                Sign in
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={registerForm.handleSubmit(onRegister)}>
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Name</label>
                <Input {...registerForm.register("name")} placeholder="Alex Morgan" />
                <FieldError message={registerForm.formState.errors.name?.message} />
              </div>
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Email</label>
                <Input {...registerForm.register("email")} placeholder="alex@routo.dev" />
                <FieldError message={registerForm.formState.errors.email?.message} />
              </div>
              <div>
                <label className="font-geist text-xs font-semibold uppercase text-outline">Password</label>
                <Input {...registerForm.register("password")} placeholder="6+ characters" type="password" />
                <FieldError message={registerForm.formState.errors.password?.message} />
              </div>
              <Button className="w-full" disabled={registerForm.formState.isSubmitting}>
                Create account
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
