import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!(await getAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("subscribers").select("email, created_at").order("created_at");
  if (error) return new NextResponse(error.message, { status: 500 });

  const escape = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const csv = ["email,joined", ...(data ?? []).map((r) => `${escape(String(r.email))},${String(r.created_at).slice(0, 10)}`)].join("\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="valueconnect-subscribers-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
