#!/usr/bin/env node
/**
 * One command from repo to live site:
 *   1. Supabase: migrations, sample listings, admins, auth settings (setup-supabase.mjs)
 *   2. Vercel: project, environment variables, production deploy, domains
 *
 *   SUPABASE_ACCESS_TOKEN=… VERCEL_TOKEN=… node scripts/go-live.mjs [--dry-run] [--skip-seed]
 *
 * Non-secret settings live in deploy.config.json.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { config, setupSupabase } from "./setup-supabase.mjs";

const dryRun = process.argv.includes("--dry-run");
const root = fileURLToPath(new URL("..", import.meta.url));
const step = (title) => console.log(`\n=== ${title} ===`);

step("1. Supabase");
const supabase = await setupSupabase({ dryRun, skipSeed: process.argv.includes("--skip-seed") });

const env = {
  NEXT_PUBLIC_SUPABASE_URL: supabase.url,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabase.publishableKey,
  NEXT_PUBLIC_SITE_URL: config.siteUrl,
};
for (const key of ["RESEND_API_KEY", "EMAIL_FROM", "ADMIN_NOTIFY_EMAIL"]) {
  if (process.env[key]) env[key] = process.env[key];
}

step("2. Vercel");
if (dryRun) {
  console.log(`[dry run] project "${config.vercel.project}", env: ${Object.keys(env).join(", ")}`);
  console.log(`[dry run] production deploy, then domains: ${config.vercel.domains.join(", ")}`);
  process.exit(0);
}
const token = process.env.VERCEL_TOKEN;
if (!token) throw new Error("VERCEL_TOKEN is not set in this session.");

let teamId = config.vercel.teamId;
const vercel = async (path, init = {}) => {
  const url = new URL(`https://api.vercel.com${path}`);
  if (teamId) url.searchParams.set("teamId", teamId);
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  return { ok: res.ok, status: res.status, body };
};
const must = (r, what) => {
  if (!r.ok) throw new Error(`Vercel ${what} → ${r.status}: ${JSON.stringify(r.body)}`);
  return r.body;
};

const { user } = must(await vercel("/v2/user"), "user");
teamId ??= user.defaultTeamId ?? undefined;
console.log(`Vercel account: ${user.username}${teamId ? ` (team ${teamId})` : ""}`);

let project = await vercel(`/v9/projects/${config.vercel.project}`);
if (project.status === 404) {
  project = await vercel("/v11/projects", {
    method: "POST",
    body: JSON.stringify({ name: config.vercel.project, framework: "nextjs" }),
  });
  console.log(`  created project ${config.vercel.project}`);
}
const projectId = must(project, "project").id;

must(
  await vercel(`/v10/projects/${projectId}/env?upsert=true`, {
    method: "POST",
    body: JSON.stringify(
      Object.entries(env).map(([key, value]) => ({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      })),
    ),
  }),
  "environment variables",
);
console.log(`  environment variables set: ${Object.keys(env).join(", ")}`);

// Best effort: link the GitHub repo so every push deploys automatically.
const link = await vercel(`/v9/projects/${projectId}/link`, {
  method: "POST",
  body: JSON.stringify({ type: "github", repo: "njirikaebuka7/valueconnect" }),
});
console.log(
  link.ok
    ? "  GitHub repo linked: pushes now deploy automatically"
    : "  GitHub auto-deploy not linked (install the Vercel GitHub app, then connect the repo in the project settings)",
);

console.log("  deploying to production (Vercel builds it in the cloud)…");
const deploy = spawnSync("npx", ["--yes", "vercel@latest", "deploy", "--prod", "--yes", "--token", token], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, VERCEL_ORG_ID: teamId ?? user.id, VERCEL_PROJECT_ID: projectId },
});
process.stderr.write(deploy.stderr ?? "");
if (deploy.status !== 0) throw new Error("Vercel deploy failed (see the output above).");
const urls = `${deploy.stdout ?? ""}\n${deploy.stderr ?? ""}`.match(/https:\/\/[\w.-]+\.vercel\.app/g) ?? [];
const deploymentUrl = urls.at(-1) ?? "(see Vercel dashboard)";
console.log(`  live at ${deploymentUrl}`);

for (const name of config.vercel.domains) {
  const r = await vercel(`/v10/projects/${projectId}/domains`, { method: "POST", body: JSON.stringify({ name }) });
  console.log(r.ok ? `  domain added: ${name}` : `  domain ${name}: ${r.body?.error?.message ?? r.status}`);
}

step("3. DNS (at your domain registrar)");
for (const name of config.vercel.domains) {
  const cfg = await vercel(`/v6/domains/${name}/config`);
  const apex = !name.startsWith("www.");
  console.log(
    `${name}: ${cfg.body?.misconfigured === false ? "configured ✓" : "needs DNS"} → ${
      apex ? "A record @ → 76.76.21.21" : "CNAME www → cname.vercel-dns.com"
    }`,
  );
}
console.log("\nDone. Admin: /admin/login");
