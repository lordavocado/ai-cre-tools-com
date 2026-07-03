#!/usr/bin/env node
/**
 * Sync app env vars from a local .env file to Coolify (ai-cre-tools-com).
 *
 * Usage:
 *   COOLIFY_TOKEN=... node scripts/sync-env-to-coolify.mjs
 *   COOLIFY_TOKEN=... node scripts/sync-env-to-coolify.mjs --file .env.local
 *   COOLIFY_TOKEN=... node scripts/sync-env-to-coolify.mjs --dry-run
 *   COOLIFY_TOKEN=... node scripts/sync-env-to-coolify.mjs --restart
 *
 * Token needs **write** permission (Coolify → Keys & Tokens → API tokens).
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const COOLIFY_APP_UUID = 'r13ag2fm5hk7v3xi7fsm42uf';
const COOLIFY_URL = process.env.COOLIFY_URL?.replace(/\/$/, '') || 'https://coolify.nichlascampos.com';
const COOLIFY_TOKEN = process.env.COOLIFY_TOKEN;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const restart = args.includes('--restart');
const fileArgIndex = args.indexOf('--file');
const envFile = resolve(fileArgIndex >= 0 ? args[fileArgIndex + 1] : '.env.local');

const SKIP_PREFIXES = ['VERCEL_', 'NX_', 'TURBO_'];
const SKIP_KEYS = new Set(['COOLIFY_TOKEN', 'COOLIFY_URL']);

function parseEnvFile(content) {
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value.replace(/\\n/g, '\n');
  }
  return vars;
}

function filterForCoolify(vars) {
  return Object.entries(vars).filter(([key]) =>
    !SKIP_KEYS.has(key) && !SKIP_PREFIXES.some((prefix) => key.startsWith(prefix)),
  );
}

async function pushToCoolify(entries) {
  const payload = {
    data: entries.map(([key, value]) => ({
      key,
      value,
      is_preview: false,
      is_literal: true,
      is_runtime: true,
      is_buildtime: key.startsWith('NEXT_PUBLIC_') || key === 'NODE_ENV',
    })),
  };

  if (dryRun) {
    console.log(`Dry run — would push ${entries.length} vars to Coolify:`);
    for (const [key] of entries) console.log(`  - ${key}`);
    return;
  }

  const response = await fetch(`${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}/envs/bulk`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${COOLIFY_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Coolify API ${response.status}: ${body}`);
  }

  console.log(`Pushed ${entries.length} environment variables to Coolify.`);
}

async function restartApp() {
  const response = await fetch(`${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}/restart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${COOLIFY_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Coolify restart ${response.status}: ${body}`);
  }
  console.log(`Restart queued: ${body}`);
}

async function main() {
  if (!dryRun && !COOLIFY_TOKEN) {
    console.error('Missing COOLIFY_TOKEN (must have write permission).');
    process.exit(1);
  }

  const content = readFileSync(envFile, 'utf8');
  const entries = filterForCoolify(parseEnvFile(content));

  console.log(`Source: ${envFile}`);
  await pushToCoolify(entries);

  if (restart && !dryRun) {
    await restartApp();
  } else if (!dryRun) {
    console.log('Tip: redeploy or run with --restart after updating env vars.');
  }
}

main().catch((error) => {
  console.error(error.message);
  if (String(error.message).includes('403')) {
    console.error('\nThe API token needs **write** permission. Create one in Coolify → Keys & Tokens.');
  }
  process.exit(1);
});
