import { Database } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

/** Shown in place of the admin when the Supabase env vars aren't set. */
export function SetupCard() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-7 shadow-card ring-1 ring-line sm:p-9">
      <div className="flex items-center gap-3">
        <LogoMark className="w-10" />
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-50 text-aqua-700">
          <Database className="h-5 w-5" />
        </span>
      </div>
      <h1 className="mt-5 text-2xl font-bold">Connect the database</h1>
      <p className="mt-2 text-sm leading-relaxed text-body">
        The admin dashboard runs on Supabase. Add these environment variables to the Vercel project (and to{" "}
        <code className="rounded bg-surface px-1 py-0.5 text-xs">.env.local</code> for local development), then
        redeploy:
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"].map((v) => (
          <li key={v} className="rounded-xl bg-surface px-3 py-2 font-mono text-xs text-navy-800 ring-1 ring-line">
            {v}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Until then the public site runs in preview mode with sample listings, and forms are not stored.
      </p>
    </div>
  );
}
