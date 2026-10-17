import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <ResetPasswordForm />
    </main>
  );
}
