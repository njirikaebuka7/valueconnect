import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Completes email-link sign-ins (password recovery) and forwards to `next`. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/admin";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
    console.error("auth callback", error.message);
  }
  return NextResponse.redirect(new URL("/admin/login?error=link_expired", origin));
}
