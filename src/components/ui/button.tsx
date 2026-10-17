import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "accent" | "outline" | "ghost" | "white" | "glass" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-700 text-white shadow-[0_8px_24px_-10px_rgb(1_51_152/0.7)] hover:bg-navy-800 active:bg-navy-900",
  accent:
    "bg-aqua-500 text-navy-950 shadow-[0_8px_24px_-10px_rgb(3_203_250/0.8)] hover:bg-aqua-400 active:bg-aqua-600",
  outline: "border border-line bg-white text-ink hover:border-navy-200 hover:bg-navy-50",
  ghost: "text-navy-700 hover:bg-navy-50",
  white: "bg-white text-navy-900 shadow-card hover:bg-navy-50",
  glass: "glass text-white hover:bg-white/20",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-13 px-6 text-[0.95rem] gap-2 rounded-2xl",
  icon: "h-10 w-10 rounded-xl",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className,
  );
}

type Common = { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: Common & ComponentProps<"button">) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
