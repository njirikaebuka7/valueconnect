import "server-only";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export interface AdminSession {
  user: User;
  email: string;
}

type AdminCheck = { status: "ok"; admin: AdminSession } | { status: "signed_out" } | { status: "not_admin" };

/** Signed-in user who is also listed in the `admins` table. Cached per request. */
const checkAdmin = cache(async (): Promise<AdminCheck> => {
  if (!isSupabaseConfigured) return { status: "signed_out" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { status: "signed_out" };

  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) return { status: "not_admin" };
  return { status: "ok", admin: { user, email: user.email.toLowerCase() } };
});

export async function getAdmin(): Promise<AdminSession | null> {
  const res = await checkAdmin();
  return res.status === "ok" ? res.admin : null;
}

/** Use at the top of every admin page and admin Server Action. */
export async function requireAdmin(): Promise<AdminSession> {
  const res = await checkAdmin();
  if (res.status === "ok") return res.admin;
  if (res.status === "not_admin") {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login?error=not_admin");
  }
  redirect("/admin/login");
}
