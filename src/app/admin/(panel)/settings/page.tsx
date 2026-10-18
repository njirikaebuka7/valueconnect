import type { Metadata } from "next";
import { PasswordForm, SettingsForm } from "@/components/admin/settings-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getContactSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const settings = await getContactSettings();
  return (
    <div className="max-w-3xl space-y-10 pb-24 lg:pb-10">
      <div>
        <PageHeader
          title="Settings"
          description="Contact details and social links shown across the website, and your admin password."
        />
        <SettingsForm settings={settings} />
      </div>
      <div id="password" className="scroll-mt-20">
        <PasswordForm email={admin.email} />
      </div>
    </div>
  );
}
