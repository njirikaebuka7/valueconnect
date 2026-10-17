"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const notAdmin = params.get("error") === "not_admin";
  const linkExpired = params.get("error") === "link_expired";

  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(
    notAdmin
      ? "That account doesn't have admin access. Ask the site owner to add your email to the admins list."
      : linkExpired
        ? "That link has expired or was already used. Request a new one below."
        : null,
  );
  const [info, setInfo] = useState<string | null>(null);

  // A non-admin session may still be in cookies; clear it so the next sign-in starts clean.
  useEffect(() => {
    if (notAdmin) void createClient().auth.signOut();
  }, [notAdmin]);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setPending(false);
      setError(
        error.message.toLowerCase().includes("invalid")
          ? "Incorrect email or password."
          : error.message.toLowerCase().includes("confirm")
            ? "Please confirm your email address first."
            : "We couldn't sign you in. Please try again.",
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    });
    setPending(false);
    if (error) {
      setError("We couldn't send the reset email. Please try again in a minute.");
      return;
    }
    setInfo("If that email belongs to a staff account, a reset link is on its way.");
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-lift ring-1 ring-line sm:p-9">
      <p className="eyebrow">
        <span className="h-px w-6 bg-aqua-500" />
        Admin
      </p>
      <h2 className="mt-3 text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Reset your password"}</h2>
      <p className="mt-1.5 text-sm text-body">
        {mode === "signin"
          ? "Sign in to manage requests, listings and enquiries."
          : "Enter your staff email and we'll send you a link to set a new password."}
      </p>

      <form onSubmit={mode === "signin" ? onSignIn : onReset} className="mt-7 space-y-4" noValidate>
        {error && <FormAlert>{error}</FormAlert>}
        {info && <FormAlert tone="success">{info}</FormAlert>}

        <Field label="Email" name="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@valueconnect.com.ng"
              className="pl-10"
            />
          </div>
        </Field>

        {mode === "signin" && (
          <Field label="Password" name="password">
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11 pl-10"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending || !email || (mode === "signin" && !password)}>
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset link"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "reset" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="font-semibold text-navy-700 hover:text-navy-900"
        >
          {mode === "signin" ? "Forgot password?" : "Back to sign in"}
        </button>
        <Link href="/" className="text-muted hover:text-ink">
          View site
        </Link>
      </div>

      <p className="mt-7 rounded-xl bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
        Staff accounts are created by the site owner in Supabase (Authentication → Users) and must also be listed as
        admins.
      </p>
    </div>
  );
}
