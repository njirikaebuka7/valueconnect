import "server-only";
import { site } from "./site";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? `${site.shortName} <no-reply@valueconnect.com.ng>`;
export const adminInbox = process.env.ADMIN_NOTIFY_EMAIL ?? site.email;

export const emailEnabled = Boolean(apiKey);

export function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Sends through Resend when RESEND_API_KEY is set; otherwise a no-op. Never throws. */
export async function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  if (!apiKey) return { skipped: true as const };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });
    if (!res.ok) console.error("sendEmail", res.status, await res.text());
    return { skipped: false as const, ok: res.ok };
  } catch (err) {
    console.error("sendEmail", err);
    return { skipped: false as const, ok: false };
  }
}

export function emailLayout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f7fe;font-family:Arial,Helvetica,sans-serif;color:#0a1033">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
    <tr><td style="background:#04123a;padding:24px 28px;color:#ffffff">
      <div style="font-size:18px;font-weight:700;letter-spacing:.04em">VALUECONNECT <span style="color:#03cbfa">CONSULTING</span></div>
      <div style="font-size:12px;color:#9eebfd;margin-top:4px">${esc(site.tagline)}</div>
    </td></tr>
    <tr><td style="padding:28px">
      <h1 style="font-size:20px;margin:0 0 16px">${esc(title)}</h1>
      <div style="font-size:14px;line-height:1.6;color:#4b5677">${body}</div>
    </td></tr>
    <tr><td style="padding:18px 28px;background:#f4f7fe;font-size:12px;color:#8390ae">
      ${esc(site.address.full)}<br>${site.phones.map((p) => esc(p.display)).join(" · ")} · ${esc(site.email)}
    </td></tr>
  </table></td></tr></table></body></html>`;
}

export function detailRows(rows: Array<[string, unknown]>) {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:8px 0 16px">${rows
    .filter(([, v]) => v != null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#8390ae;width:40%;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#0a1033">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;
}
