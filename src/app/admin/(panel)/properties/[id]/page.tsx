import { Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteProperty } from "@/app/actions/admin";
import { ConfirmForm } from "@/components/admin/client-ui";
import { PropertyForm } from "@/components/admin/property-form";
import { PageHeader } from "@/components/admin/ui";
import { FormAlert } from "@/components/ui/field";
import { requireAdmin } from "@/lib/auth";
import { mapProperty } from "@/lib/data/mappers";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit property" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPropertyPage({ params, searchParams }: PageProps<"/admin/properties/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const property = mapProperty(data);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/properties", label: "All properties" }}
        title={property.title}
        description={`/properties/${property.slug}`}
        actions={
          <ConfirmForm
            action={deleteProperty.bind(null, property.id)}
            message={`Delete “${property.title}”? Its photos will be removed too. This can't be undone.`}
            buttonClassName="inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
            pendingText="Deleting…"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </ConfirmForm>
        }
      />
      {sp.created && (
        <div className="mb-5">
          <FormAlert tone="success">Listing created. Add more photos or details any time.</FormAlert>
        </div>
      )}
      <PropertyForm property={property} />
    </>
  );
}
