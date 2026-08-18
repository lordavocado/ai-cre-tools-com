/** Owner email notifications for completed automated tool reviews. */

import 'server-only';

import { siteConfig } from '@/config/site';
import type { SubmissionAutomationOutcome } from '@/lib/submission-automation';
import { getToolPath } from '@/lib/tool-routes';

export type ToolSubmissionDecisionNotification = {
  submissionId: string;
  submitterEmail: string;
  outcome: SubmissionAutomationOutcome;
};

export type ToolSubmissionFailureNotification = {
  submissionId: string;
  website: string;
  error: string;
};

function hasRealValue(value: string | undefined) {
  return Boolean(value && !value.includes('placeholder'));
}

export function isSubmissionNotificationConfigured() {
  return hasRealValue(process.env.RESEND_API_KEY)
    && hasRealValue(process.env.SUBMISSION_NOTIFY_EMAIL);
}

function getNotifyRecipients(): string[] {
  return (process.env.SUBMISSION_NOTIFY_EMAIL?.trim() ?? '')
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

async function sendNotificationEmail(message: { subject: string; html: string; text: string }) {
  if (!isSubmissionNotificationConfigured()) {
    return { sent: false as const, reason: 'not_configured' as const };
  }

  const recipients = getNotifyRecipients();
  if (!recipients.length) {
    return { sent: false as const, reason: 'no_recipients' as const };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: recipients,
      ...message,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Resend API error (${response.status}): ${errorBody || response.statusText}`);
  }

  return { sent: true as const };
}

/** Emails the owner after the AI has accepted, rejected, or safely deferred a submission. */
export async function notifyToolSubmissionDecision(notification: ToolSubmissionDecisionNotification) {
  const { outcome } = notification;
  const accepted = outcome.decision === 'accepted';
  const toolUrl = accepted ? `${siteConfig.url}${getToolPath(outcome.tool.slug)}` : '';
  const name = accepted ? outcome.tool.name : outcome.name;
  const website = accepted ? outcome.tool.websiteUrl : outcome.website;
  const decisionLabel = accepted
    ? 'Accepted and published'
    : outcome.decision === 'rejected'
      ? 'Rejected'
      : 'Needs attention';
  const subjectLabel = accepted
    ? 'Accepted'
    : outcome.decision === 'rejected'
      ? 'Rejected'
      : 'Needs attention';

  const insertedRows = accepted
    ? [
        ['Live listing', `<a href="${escapeHtml(toolUrl)}">${escapeHtml(toolUrl)}</a>`],
        ['Slug', escapeHtml(outcome.tool.slug)],
        ['Category', escapeHtml(outcome.tool.category)],
        ['Tagline', escapeHtml(outcome.tool.oneLiner)],
        ['Tags', escapeHtml(outcome.tool.features.join(', '))],
        ['Description', escapeHtml(outcome.tool.description)],
        ['Location', escapeHtml([outcome.tool.city, outcome.tool.country].filter(Boolean).join(', ') || 'Not verified')],
      ]
    : [];

  const evidenceRows = outcome.evidence.length
    ? outcome.evidence.map((evidence, index) => [
        `Evidence ${index + 1}`,
        `${escapeHtml(evidence.claim)} — <a href="${escapeHtml(evidence.url)}">${escapeHtml(evidence.url)}</a>${evidence.sourceType === 'official' ? ' (official)' : ''}`,
      ])
    : [['Evidence', 'No verified evidence returned']];

  const rows = [
    ['Decision', decisionLabel],
    ['Tool', escapeHtml(name)],
    ['Website', `<a href="${escapeHtml(website)}">${escapeHtml(website)}</a>`],
    ['Model', escapeHtml(outcome.model)],
    ['OpenAI response', escapeHtml(outcome.responseId || 'Not available')],
    ['Confidence', `${Math.round(outcome.confidence * 100)}%`],
    ['AI rationale', escapeHtml(outcome.reason)],
    ...evidenceRows,
    ...insertedRows,
    ['Submitter', escapeHtml(notification.submitterEmail)],
    ['Submission ID', escapeHtml(notification.submissionId)],
  ];

  const htmlRows = rows
    .map(([label, value]) => `<tr><td style="padding:8px 16px 8px 0;color:#52525b;width:140px;vertical-align:top;">${label}</td><td style="padding:8px 0;vertical-align:top;">${value}</td></tr>`)
    .join('');

  const textRows = [
    `Decision: ${decisionLabel}`,
    `Tool: ${name}`,
    `Website: ${website}`,
    `Model: ${outcome.model}`,
    `OpenAI response: ${outcome.responseId || 'Not available'}`,
    `Confidence: ${Math.round(outcome.confidence * 100)}%`,
    `AI rationale: ${outcome.reason}`,
    ...(outcome.evidence.length
      ? outcome.evidence.map((evidence, index) => `Evidence ${index + 1}: ${evidence.claim} — ${evidence.url}${evidence.sourceType === 'official' ? ' (official)' : ''}`)
      : ['Evidence: No verified evidence returned']),
    ...(accepted
      ? [
          `Live listing: ${toolUrl}`,
          `Slug: ${outcome.tool.slug}`,
          `Category: ${outcome.tool.category}`,
          `Tagline: ${outcome.tool.oneLiner}`,
          `Tags: ${outcome.tool.features.join(', ')}`,
          `Description: ${outcome.tool.description}`,
          `Location: ${[outcome.tool.city, outcome.tool.country].filter(Boolean).join(', ') || 'Not verified'}`,
        ]
      : []),
    `Submitter: ${notification.submitterEmail}`,
    `Submission ID: ${notification.submissionId}`,
  ];

  return sendNotificationEmail({
    subject: `${subjectLabel}: ${name}`,
    html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0f172a;line-height:1.5;"><h2 style="margin:0 0 16px;font-size:20px;">${decisionLabel}: ${escapeHtml(name)}</h2><table style="width:100%;border-collapse:collapse;">${htmlRows}</table></div>`,
    text: textRows.join('\n'),
  });
}

/** Alerts the owner when no safe accept/reject decision could be completed. */
export async function notifyToolSubmissionFailure(notification: ToolSubmissionFailureNotification) {
  const adminUrl = `${siteConfig.url}/admin/submissions`;

  return sendNotificationEmail({
    subject: `Submission automation needs attention: ${notification.website}`,
    html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0f172a;line-height:1.5;"><h2 style="margin:0 0 16px;font-size:20px;">Submission automation needs attention</h2><p>The AI could not safely accept or reject this submission, so it remains in the review queue.</p><p><strong>Website:</strong> <a href="${escapeHtml(notification.website)}">${escapeHtml(notification.website)}</a><br><strong>Submission ID:</strong> ${escapeHtml(notification.submissionId)}<br><strong>Error:</strong> ${escapeHtml(notification.error)}</p><p><a href="${escapeHtml(adminUrl)}">Open the submissions dashboard</a></p></div>`,
    text: `Submission automation needs attention\n\nWebsite: ${notification.website}\nSubmission ID: ${notification.submissionId}\nError: ${notification.error}\nReview: ${adminUrl}`,
  });
}
