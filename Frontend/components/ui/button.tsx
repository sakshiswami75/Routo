import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
          variant === "primary" && "bg-primary text-on-primary shadow-sm hover:bg-primary-container",
          variant === "secondary" && "bg-surface-high text-on-surface hover:bg-surface-variant",
          variant === "ghost" && "text-on-surface-variant hover:bg-surface-variant",
          variant === "inverse" && "bg-inverse-surface text-inverse-on-surface hover:brightness-110",
          variant === "outline" && "border border-outline-variant bg-transparent text-primary hover:bg-primary/5",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
