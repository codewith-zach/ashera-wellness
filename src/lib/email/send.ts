import { fillAppUrl } from './templates';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export interface SendResult {
  delivered: boolean;
  reason?: string;
}

const FROM = process.env.RESEND_FROM ?? 'Ashe Ra <hello@ashera.local>';

/**
 * Sends via Resend if RESEND_API_KEY is set; otherwise dry-runs (logs).
 * The dry-run path lets the cron handler be exercised locally without keys.
 */
export async function sendEmail({ to, subject, html }: SendArgs): Promise<SendResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const filled = fillAppUrl(html, appUrl);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[email:dry-run] to=${to} subject=${subject}`);
    return { delivered: false, reason: 'no-api-key' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html: filled }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[email] resend error ${res.status}: ${body}`);
    return { delivered: false, reason: `http-${res.status}` };
  }
  return { delivered: true };
}
