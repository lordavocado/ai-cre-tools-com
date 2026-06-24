/**
 * Admin email notifications for new tool submissions.
 * Uses the Resend HTTP API (no extra dependency).
 */

import 'server-only';

import { siteConfig } from '@/config/site';

export type NewToolSubmissionNotification = {
  submissionId: string;
  website: string;
  email: string;
  comment: string;
  name?: string;
  category?: string;
};

function hasRealValue(value: string | undefined) {
  return Boolean(value && !value.includes('placeholder'));
}

export function isSubmissionNotificationConfigured() {
  return hasRealValue(process.env.RESEND_API_KEY)
    && hasRealValue(process.env.SUBMISSION_NOTIFY_EMAIL);
}

function getNotifyRecipients(): string[] {
  const raw = process.env.SUBMISSION_NOTIFY_EMAIL?.trim() ?? '';
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL?.trim() || `AI CRE Tools <notifications@${new URL(siteConfig.url).hostname}>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildNotificationEmail(notification: NewToolSubmissionNotification) {
  const adminUrl = `${siteConfig.url}/admin/submissions`;
  const optionalRows = [
    notification.name ? `<tr><td style="padding:8px 0;color:#52525b;">Suggested name</td><td style="padding:8px 0;">${escapeHtml(notification.name)}</td></tr>` : '',
    notification.category ? `<tr><td style="padding:8px 0;color:#52525b;">Suggested category</td><td style="padding:8px 0;">${escapeHtml(notification.category)}</td></tr>` : '',
  ].join('');

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0f172a;line-height:1.5;">
      <h2 style="margin:0 0 16px;font-size:20px;">New tool submission</h2>
      <p style="margin:0 0 16px;">Someone submitted a product for review on ${escapeHtml(siteConfig.name)}.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#52525b;width:140px;">Website</td><td style="padding:8px 0;"><a href="${escapeHtml(notification.website)}">${escapeHtml(notification.website)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#52525b;">Submitter</td><td style="padding:8px 0;">${escapeHtml(notification.email)}</td></tr>
        ${optionalRows}
        <tr><td style="padding:8px 0;color:#52525b;vertical-align:top;">Comment</td><td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(notification.comment)}</td></tr>
        <tr><td style="padding:8px 0;color:#52525b;">Submission ID</td><td style="padding:8px 0;font-family:ui-monospace,monospace;font-size:13px;">${escapeHtml(notification.submissionId)}</td></tr>
      </table>
      <p style="margin:24px 0 0;">
        <a href="${adminUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;">Review in admin</a>
      </p>
    </div>
  `.trim();

  const text = [
    'New tool submission',
    '',
    `Website: ${notification.website}`,
    `Submitter: ${notification.email}`,
    notification.name ? `Suggested name: ${notification.name}` : '',
    notification.category ? `Suggested category: ${notification.category}` : '',
    `Comment: ${notification.comment}`,
    `Submission ID: ${notification.submissionId}`,
    '',
    `Review: ${adminUrl}`,
  ].filter(Boolean).join('\n');

  return {
    subject: `New tool submission: ${notification.website}`,
    html,
    text,
  };
}

export async function notifyNewToolSubmission(notification: NewToolSubmissionNotification) {
  if (!isSubmissionNotificationConfigured()) {
    return { sent: false as const, reason: 'not_configured' as const };
  }

  const apiKey = process.env.RESEND_API_KEY!.trim();
  const recipients = getNotifyRecipients();

  if (!recipients.length) {
    return { sent: false as const, reason: 'no_recipients' as const };
  }

  const { subject, html, text } = buildNotificationEmail(notification);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: recipients,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Resend API error (${response.status}): ${errorBody || response.statusText}`);
  }

  return { sent: true as const };
}
