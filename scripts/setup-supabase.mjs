#!/usr/bin/env node
/**
 * Sets up the Supabase project through the Management API (HTTPS only, no
 * direct Postgres connection). Settings come from deploy.config.json; the only
 * secret is SUPABASE_ACCESS_TOKEN (a personal access token).
 *
 *   node scripts/setup-supabase.mjs [--skip-seed] [--dry-run]
 *
 * Applies supabase/migrations in order, seeds the sample listings when the
 * table is empty, registers the admin emails, locks down sign-ups and returns
 * the public URL and publishable key the site needs.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
export const config = JSON.parse(readFileSync(join(root, "deploy.config.json"), "utf8"));

const quote = (v) => `'${String(v).replace(/'/g, "''")}'`;

export async function setupSupabase({ dryRun = false, skipSeed = false, log = console.log } = {}) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF ?? config.supabase.projectRef;
  const siteUrl = (process.env.SITE_URL ?? config.siteUrl).replace(/\/$/, "");
  const admins = (process.env.ADMIN_EMAILS?.split(",") ?? config.adminEmails)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const migrations = readdirSync(join(root, "supabase/migrations"))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (dryRun) {
    log(`[dry run] Supabase project ${ref}`);
    log(`[dry run] would apply: ${migrations.join(", ")}`);
    log(`[dry run] would seed sample listings: ${!skipSeed}`);
    log(`[dry run] admins: ${admins.join(", ")}`);
    log(`[dry run] auth site URL: ${siteUrl}; public sign-ups off`);
    return { url: config.supabase.url, publishableKey: "<from API>" };
  }
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is not set in this session.");

  const api = async (path, init = {}) => {
    const res = await fetch(`https://api.supabase.com/v1${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Supabase ${init.method ?? "GET"} ${path} → ${res.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  };
  const sql = (query) => api(`/projects/${ref}/database/query`, { method: "POST", body: JSON.stringify({ query }) });

  const project = await api(`/projects/${ref}`);
  log(`Supabase project: ${project.name} (${project.region}), status ${project.status}`);

  for (const file of migrations) {
    log(`  applying ${file}`);
    await sql(readFileSync(join(root, "supabase/migrations", file), "utf8"));
  }

  if (!skipSeed) {
    const [{ count }] = await sql("select count(*)::int as count from public.properties");
    if (count === 0) {
      log("  seeding sample listings");
      await sql(readFileSync(join(root, "supabase/seed.sql"), "utf8"));
    } else {
      log(`  properties already has ${count} rows; seed skipped`);
    }
  }

  if (admins.length) {
    await sql(`insert into public.admins (email) values ${admins.map((e) => `(${quote(e)})`).join(", ")} on conflict (email) do nothing`);
    log(`  admins: ${admins.join(", ")}`);
  }

  await api(`/projects/${ref}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      site_url: siteUrl,
      uri_allow_list: [`${siteUrl}/**`, "https://*.vercel.app/**", "http://localhost:3000/**"].join(","),
      disable_signup: true,
    }),
  });
  log("  auth: public sign-ups disabled, redirect URLs set");

  const keys = await api(`/projects/${ref}/api-keys?reveal=true`);
  const publishableKey =
    keys.find((k) => k.type === "publishable")?.api_key ?? keys.find((k) => k.name === "anon")?.api_key;
  const serviceKey = keys.find((k) => k.name === "service_role")?.api_key ?? keys.find((k) => k.type === "secret")?.api_key;
  if (!publishableKey) throw new Error("Couldn't read the project's publishable/anon key.");
  const url = `https://${ref}.supabase.co`;

  // Admin logins are created by the owner in the dashboard so nobody else ever
  // handles the password; report whether each one exists yet.
  if (serviceKey) {
    const res = await fetch(`${url}/auth/v1/admin/users?per_page=1000`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (res.ok) {
      const { users = [] } = await res.json();
      const existing = new Set(users.map((u) => String(u.email).toLowerCase()));
      for (const email of admins) {
        log(
          existing.has(email)
            ? `  login for ${email}: exists`
            : `  login for ${email}: NOT CREATED YET → Supabase dashboard → Authentication → Users → Add user → Create new user (tick Auto Confirm)`,
        );
      }
    }
  }

  return { url, publishableKey };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dryRun = process.argv.includes("--dry-run");
  const result = await setupSupabase({ dryRun, skipSeed: process.argv.includes("--skip-seed") });
  console.log("\nSite environment variables:");
  console.log(`NEXT_PUBLIC_SUPABASE_URL=${result.url}`);
  console.log(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${result.publishableKey}`);
}
