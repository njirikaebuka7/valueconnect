import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/admin/login-form";
import { SetupCard } from "@/components/admin/setup-card";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="bg-navy-mesh relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid-faint absolute inset-0 opacity-60" aria-hidden />
        <div className="relative">
          <Logo tone="light" />
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow text-aqua-300">
            <span className="h-px w-6 bg-aqua-300" />
            Staff portal
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-bold text-white">
            Every request, listing and client, <span className="font-accent text-gradient">in one place.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-navy-100/75">
            Review valuation requests, send fee quotes, book inspections and keep listings up to date from any device.
          </p>
        </div>
        <p className="relative text-xs text-navy-100/50">© {new Date().getFullYear()} Valueconnect Consulting</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        {isSupabaseConfigured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <SetupCard />
        )}
      </main>
    </div>
  );
}
