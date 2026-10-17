import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getContactSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getContactSettings();
  return (
    <>
      <PageHeader
        title="Settings"
        description="Contact details and social links shown in the header, footer, contact page and emails."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
