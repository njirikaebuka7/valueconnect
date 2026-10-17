import { AdminShell } from "@/components/admin/admin-shell";
import { SetupCard } from "@/components/admin/setup-card";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4 py-10">
        <SetupCard />
      </main>
    );
  }

  const admin = await requireAdmin();
  const supabase = await createClient();
  const [requests, messages] = await Promise.all([
    supabase.from("valuation_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <AdminShell email={admin.email} newRequests={requests.count ?? 0} newMessages={messages.count ?? 0}>
      {children}
    </AdminShell>
  );
}
