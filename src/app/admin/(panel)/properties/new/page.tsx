import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/property-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Add property" };

export default async function NewPropertyPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        back={{ href: "/admin/properties", label: "All properties" }}
        title="Add a property"
        description="Fill in the details, add photos, then create the listing."
      />
      <PropertyForm />
    </>
  );
}
