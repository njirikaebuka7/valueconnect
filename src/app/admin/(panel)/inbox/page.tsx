import { Archive, ArchiveRestore, Building2, Check, CheckCheck, Inbox, Mail, Phone, Reply, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { deleteMessage, updateMessageStatus } from "@/app/actions/admin";
import { ConfirmForm, SubmitButton } from "@/components/admin/client-ui";
import { Card, EmptyState, FilterTabs, MessageStatusBadge, PageHeader } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { FormAlert } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { mapMessage } from "@/lib/data/mappers";
import { cn, formatDateTime, timeAgo } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inbox" };

type View = "all" | "new" | "archived";

export default async function InboxPage({ searchParams }: PageProps<"/admin/inbox">) {
  await requireAdmin();
  const sp = await searchParams;
  const raw = Array.isArray(sp.view) ? sp.view[0] : sp.view;
  const view: View = raw === "new" || raw === "archived" ? raw : "all";

  const supabase = await createClient();
  let query = supabase
    .from("messages")
    .select("*, properties(title, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (view === "new") query = query.eq("status", "new");
  else if (view === "archived") query = query.eq("status", "archived");
  else query = query.neq("status", "archived");

  const [{ data, error }, all] = await Promise.all([query, supabase.from("messages").select("status").limit(5000)]);
  const messages = (data ?? []).map((row) => ({
    ...mapMessage(row),
    propertySlug: (row.properties as { slug?: string } | null)?.slug ?? null,
  }));
  const statuses = (all.data ?? []).map((r) => r.status as string);
  const count = (fn: (s: string) => boolean) => statuses.filter(fn).length;

  const smallBtn =
    "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold ring-1 ring-line transition hover:bg-surface";

  return (
    <>
      <PageHeader title="Inbox" description="Contact form messages and property enquiries." />

      <FilterTabs
        items={[
          { href: "/admin/inbox", label: "Inbox", count: count((s) => s !== "archived"), active: view === "all" },
          { href: "/admin/inbox?view=new", label: "Unread", count: count((s) => s === "new"), active: view === "new" },
          { href: "/admin/inbox?view=archived", label: "Archived", count: count((s) => s === "archived"), active: view === "archived" },
        ]}
      />

      {error ? (
        <div className="mt-4">
          <FormAlert>Couldn&apos;t load messages: {error.message}</FormAlert>
        </div>
      ) : messages.length === 0 ? (
        <Card className="mt-4">
          <EmptyState icon={Inbox} title="Nothing here" body="Messages from the contact form and property pages will appear here." />
        </Card>
      ) : (
        <ul className="mt-4 grid gap-3">
          {messages.map((m) => {
            const subject = m.kind === "enquiry" ? `Re: ${m.propertyTitle ?? "your property enquiry"}` : `Re: ${m.subject || "your message"}`;
            return (
              <li key={m.id}>
                <Card className={cn("p-4 sm:p-5", m.status === "new" && "ring-2 ring-aqua-300")}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{m.fullName}</p>
                        <MessageStatusBadge status={m.status} />
                        <Badge tone={m.kind === "enquiry" ? "violet" : "sky"}>
                          {m.kind === "enquiry" ? "Property enquiry" : "Contact form"}
                        </Badge>
                      </div>
                      <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                        <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-navy-700">
                          <Mail className="h-3 w-3" /> {m.email}
                        </a>
                        {m.phone && (
                          <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-navy-700">
                            <Phone className="h-3 w-3" /> {m.phone}
                          </a>
                        )}
                        <span title={formatDateTime(m.createdAt)}>{timeAgo(m.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  {m.kind === "enquiry" && m.propertyTitle && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-semibold text-navy-700">
                      <Building2 className="h-3.5 w-3.5" />
                      {m.propertySlug ? (
                        <Link href={`/properties/${m.propertySlug}`} target="_blank" className="hover:underline">
                          {m.propertyTitle}
                        </Link>
                      ) : (
                        m.propertyTitle
                      )}
                    </p>
                  )}
                  {m.subject && <p className="mt-3 text-sm font-semibold text-ink">{m.subject}</p>}
                  <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-body">{m.message}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(subject)}`}
                      className={cn(smallBtn, "bg-navy-700 text-white ring-navy-700 hover:bg-navy-800")}
                    >
                      <Reply className="h-3.5 w-3.5" /> Reply by email
                    </a>
                    {m.status === "new" && (
                      <form action={updateMessageStatus.bind(null, m.id, "read")}>
                        <SubmitButton variant="outline" size="sm" className="h-8 rounded-lg text-xs">
                          <Check className="h-3.5 w-3.5" /> Mark read
                        </SubmitButton>
                      </form>
                    )}
                    {m.status !== "replied" && m.status !== "archived" && (
                      <form action={updateMessageStatus.bind(null, m.id, "replied")}>
                        <SubmitButton variant="outline" size="sm" className="h-8 rounded-lg text-xs">
                          <CheckCheck className="h-3.5 w-3.5" /> Mark replied
                        </SubmitButton>
                      </form>
                    )}
                    {m.status === "archived" ? (
                      <form action={updateMessageStatus.bind(null, m.id, "read")}>
                        <SubmitButton variant="outline" size="sm" className="h-8 rounded-lg text-xs">
                          <ArchiveRestore className="h-3.5 w-3.5" /> Restore
                        </SubmitButton>
                      </form>
                    ) : (
                      <form action={updateMessageStatus.bind(null, m.id, "archived")}>
                        <SubmitButton variant="outline" size="sm" className="h-8 rounded-lg text-xs">
                          <Archive className="h-3.5 w-3.5" /> Archive
                        </SubmitButton>
                      </form>
                    )}
                    <ConfirmForm
                      action={deleteMessage.bind(null, m.id)}
                      message={`Delete the message from ${m.fullName}?`}
                      className="ml-auto"
                      buttonClassName={cn(smallBtn, "text-red-600 hover:bg-red-50")}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </ConfirmForm>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
