"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The passwords don't match.");
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setPending(false);
      return setError("This reset link has expired. Request a new one from the sign-in page.");
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setPending(false);
      return setError(error.message);
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-7 shadow-lift ring-1 ring-line sm:p-9">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <p className="text-sm text-body">Choose a strong password you don&apos;t use anywhere else.</p>
      {error && <FormAlert>{error}</FormAlert>}
      <Field label="New password" name="password">
        <Input name="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Field label="Confirm password" name="confirm">
        <Input name="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save password"}
      </Button>
      <Link href="/admin/login" className="block text-center text-sm font-semibold text-navy-700">
        Back to sign in
      </Link>
    </form>
  );
}
