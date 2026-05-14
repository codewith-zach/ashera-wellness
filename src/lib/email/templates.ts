/**
 * Brand-styled HTML email templates. All inlined styles for client compat.
 * Used by `/api/cron/reminders` (Phase 3) — gated on RESEND_API_KEY.
 */

const SHELL = (title: string, body: string) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0EA;font-family:'DM Sans',-apple-system,Segoe UI,sans-serif;color:#3a5a3f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F5F0EA;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:20px;box-shadow:0 4px 20px rgba(122,158,126,0.15);overflow:hidden;">
        <tr><td style="padding:32px 40px 0;">
          <div style="font-size:28px;color:#7A9E7E;line-height:1;">✿</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5f8b66;margin-top:6px;">Ashe Ra</div>
        </td></tr>
        <tr><td style="padding:24px 40px 40px;">
          ${body}
        </td></tr>
        <tr><td style="padding:0 40px 32px;">
          <hr style="border:none;border-top:1px solid #dde9de;margin:24px 0;" />
          <p style="font-size:11px;color:#8db99f;margin:0;">
            You can adjust your reminder preferences any time from your profile.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}

export function dailyReminderEmail(name: string | null) {
  const subject = 'Your body is waiting to be heard 🌿';
  const html = SHELL(
    subject,
    `
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-weight:500;color:#4A7050;font-size:28px;margin:0 0 16px;">
      ${escapeHtml(name ?? 'Friend')},
    </h1>
    <p style="font-size:16px;line-height:1.6;color:#3a5a3f;margin:0 0 12px;">
      A few quiet minutes is all today's check-in needs. Mood, sleep, water, gratitude — whatever wants to be noted.
    </p>
    <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;color:#5f8b66;font-size:17px;margin:0 0 24px;">
      “You showed up. That is the practice.”
    </p>
    <p>
      <a href="\${APP_URL}/journal" style="display:inline-block;background:linear-gradient(135deg,#7A9E7E,#4A7050);color:#fff;padding:14px 28px;border-radius:9999px;text-decoration:none;font-size:15px;font-weight:500;">
        Open today's journal
      </a>
    </p>
    `,
  );
  return { subject, html };
}

export function weeklyPromptEmail(name: string | null, weekNumber: number) {
  const subject = `Sunday letter — week ${weekNumber} is asking to be reviewed 🌸`;
  const html = SHELL(
    subject,
    `
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-weight:500;color:#4A7050;font-size:28px;margin:0 0 16px;">
      ${escapeHtml(name ?? 'Friend')},
    </h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 12px;">
      It's the start of a new week. Sit with the last one for a moment — wins, challenges, what you learnt — before turning the page.
    </p>
    <p>
      <a href="\${APP_URL}/weekly" style="display:inline-block;background:linear-gradient(135deg,#7A9E7E,#4A7050);color:#fff;padding:14px 28px;border-radius:9999px;text-decoration:none;font-size:15px;font-weight:500;">
        Open weekly review
      </a>
    </p>
    `,
  );
  return { subject, html };
}

export function milestoneEmail(name: string | null, milestone: { days: number; emoji: string; title: string; message: string }) {
  const subject = `${milestone.emoji} ${milestone.days} days — ${milestone.title}`;
  const html = SHELL(
    subject,
    `
    <div style="font-size:64px;line-height:1;text-align:center;margin:8px 0 16px;">${milestone.emoji}</div>
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-weight:500;color:#4A7050;font-size:32px;text-align:center;margin:0 0 8px;">
      ${escapeHtml(milestone.title)}
    </h1>
    <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;color:#5f8b66;font-size:18px;text-align:center;margin:0 0 24px;">
      “${escapeHtml(milestone.message)}”
    </p>
    <p style="font-size:15px;line-height:1.6;text-align:center;color:#3a5a3f;margin:0 0 24px;">
      ${escapeHtml(name ?? 'Friend')}, this is yours.
    </p>
    <p style="text-align:center;">
      <a href="\${APP_URL}/insights" style="display:inline-block;background:linear-gradient(135deg,#7A9E7E,#4A7050);color:#fff;padding:14px 28px;border-radius:9999px;text-decoration:none;font-size:15px;font-weight:500;">
        See your healing journey
      </a>
    </p>
    `,
  );
  return { subject, html };
}

/**
 * Inline `${APP_URL}` placeholders so we can reuse templates server-side.
 */
export function fillAppUrl(html: string, appUrl: string) {
  return html.replace(/\$\{APP_URL\}/g, appUrl);
}
