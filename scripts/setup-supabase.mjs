#!/usr/bin/env node
/**
 * One-shot Supabase setup through the Management API (HTTPS only, no direct
 * Postgres connection needed).
 *
 *   SUPABASE_ACCESS_TOKEN=...  personal access token (keep it secret)
 *   SUPABASE_PROJECT_REF=...   the project ref from the dashboard URL
 *   SITE_URL=https://valueconnect.com.ng
 *   ADMIN_EMAILS=owner@example.com,second@example.com
 *
 *   node scripts/setup-supabase.mjs [--skip-seed]
 *
 * Applies every file in supabase/migrations in order, seeds the sample
 * listings when the table is empty, registers the admin emails, locks down
 * public sign-ups and prints the env vars the Next.js app needs.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF;
const siteUrl = (process.env.SITE_URL ?? "https://valueconnect.com.ng").replace(/\/$/, "");
const admins = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const skipSeed = process.argv.includes("--skip-seed");

if (!token || !ref) {
  console.error("Set SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF first.");
  process.exit(1);
}

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
};

const sql = (query) => api(`/projects/${ref}/database/query`, { method: "POST", body: JSON.stringify({ query }) });

const root = new URL("..", import.meta.url).pathname;

const project = await api(`/projects/${ref}`);
console.log(`Project: ${project.name} (${project.region}) — ${project.status}`);

const migrationsDir = join(root, "supabase/migrations");
for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()) {
  process.stdout.write(`Applying ${file} … `);
  await sql(readFileSync(join(migrationsDir, file), "utf8"));
  console.log("done");
}

if (!skipSeed) {
  const [{ count }] = await sql("select count(*)::int as count from public.properties");
  if (count === 0) {
    process.stdout.write("Seeding sample listings … ");
    await sql(readFileSync(join(root, "supabase/seed.sql"), "utf8"));
    console.log("done");
  } else {
    console.log(`Properties table already has ${count} rows; skipping seed.`);
  }
}

if (admins.length) {
  const values = admins.map((e) => `('${e.replace(/'/g, "''")}')`).join(", ");
  await sql(`insert into public.admins (email) values ${values} on conflict (email) do nothing`);
  console.log(`Admins registered: ${admins.join(", ")}`);
}

await api(`/projects/${ref}/config/auth`, {
  method: "PATCH",
  body: JSON.stringify({
    site_url: siteUrl,
    uri_allow_list: [`${siteUrl}/**`, "https://*.vercel.app/**", "http://localhost:3000/**"].join(","),
    disable_signup: true,
  }),
});
console.log("Auth: public sign-ups disabled, redirect URLs set.");

const keys = await api(`/projects/${ref}/api-keys`);
const publishable =
  keys.find((k) => k.type === "publishable")?.api_key ?? keys.find((k) => k.name === "anon")?.api_key;

console.log("\nAdd these to Vercel (Production + Preview):");
console.log(`NEXT_PUBLIC_SUPABASE_URL=https://${ref}.supabase.co`);
console.log(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishable ?? "<copy from Project Settings → API Keys>"}`);
console.log(`NEXT_PUBLIC_SITE_URL=${siteUrl}`);
