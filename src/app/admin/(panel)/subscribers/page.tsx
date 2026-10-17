import { Download, Mail, Trash2, Users } from "lucide-react";
import type { Metadata } from "next";
import { deleteSubscriber } from "@/app/actions/admin";
import { ConfirmForm } from "@/components/admin/client-ui";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { buttonClass } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  const rows = data ?? [];

  return (
    <>
      <PageHeader
        title="Subscribers"
        description={`${rows.length} ${rows.length === 1 ? "person has" : "people have"} joined the newsletter.`}
        actions={
          rows.length > 0 ? (
            <a href="/admin/subscribers/export" className={buttonClass("primary", "sm")}>
              <Download className="h-4 w-4" /> Export CSV
            </a>
          ) : null
        }
      />
      {error ? (
        <FormAlert>Couldn&apos;t load subscribers: {error.message}</FormAlert>
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No subscribers yet" body="Sign-ups from the newsletter strip in the site footer appear here." />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.email as string} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <a href={`mailto:${r.email}`} className="block truncate text-sm font-semibold text-ink hover:text-navy-700">
                    {r.email as string}
                  </a>
                  <p className="text-xs text-muted">Joined {formatDate(r.created_at as string)}</p>
                </div>
                <ConfirmForm
                  action={deleteSubscriber.bind(null, r.email as string)}
                  message={`Remove ${r.email} from the list?`}
                  buttonClassName="grid h-9 w-9 place-items-center rounded-xl text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" aria-label="Remove" />
                </ConfirmForm>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
