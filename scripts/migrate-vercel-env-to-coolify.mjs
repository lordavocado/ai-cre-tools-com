#!/usr/bin/env node
/**
 * Pull production env vars from Vercel and push them to Coolify.
 *
 * Prerequisites:
 *   1. Vercel CLI logged in as lordavocado (or VERCEL_TOKEN with team access)
 *   2. COOLIFY_TOKEN from Coolify → Keys & Tokens → API tokens
 *   3. COOLIFY_URL (default: https://coolify.nichlascampos.com)
 *
 * Usage:
 *   COOLIFY_TOKEN=... node scripts/migrate-vercel-env-to-coolify.mjs
 *   COOLIFY_TOKEN=... node scripts/migrate-vercel-env-to-coolify.mjs --dry-run
 */

import { execSync } from 'node:child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const VERCEL_TEAM_ID = 'team_iLTsSEfSMRewMa0EybTqDGns';
const VERCEL_PROJECT_ID = 'prj_CXKuoQLjSoUo12Ae3SZ1bzR8mG6e';
const COOLIFY_APP_UUID = 'r13ag2fm5hk7v3xi7fsm42uf';

const COOLIFY_URL = process.env.COOLIFY_URL?.replace(/\/$/, '') || 'https://coolify.nichlascampos.com';
const COOLIFY_TOKEN = process.env.COOLIFY_TOKEN;
const dryRun = process.argv.includes('--dry-run');

const VERCEL_PREFIXES_TO_SKIP = ['VERCEL_', 'NX_', 'TURBO_'];

function parseEnvFile(content) {
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value.replace(/\\n/g, '\n');
  }
  return vars;
}

function pullVercelEnv() {
  const tmpFile = join(tmpdir(), `vercel-env-${Date.now()}.env`);
  try {
    execSync(
      `vercel env pull "${tmpFile}" --environment=production --yes`,
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          VERCEL_ORG_ID: VERCEL_TEAM_ID,
          VERCEL_PROJECT_ID,
        },
      },
    );
    const content = readFileSync(tmpFile, 'utf8');
    return parseEnvFile(content);
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
      // ignore
    }
  }
}

function filterForCoolify(vars) {
  return Object.entries(vars).filter(([key]) =>
    !VERCEL_PREFIXES_TO_SKIP.some((prefix) => key.startsWith(prefix)),
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
    writeFileSync('.env.coolify.migration.preview.json', JSON.stringify(payload, null, 2));
    console.log(`Dry run: wrote ${entries.length} vars to .env.coolify.migration.preview.json (values included — do not commit).`);
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

async function main() {
  if (!dryRun && !COOLIFY_TOKEN) {
    console.error('Missing COOLIFY_TOKEN. Create one in Coolify → Keys & Tokens.');
    process.exit(1);
  }

  console.log('Pulling production env from Vercel (lordavocados-projects/ai-cre-tools-com)...');
  const vars = pullVercelEnv();
  const entries = filterForCoolify(vars);

  console.log(`Found ${entries.length} app env vars (excluding Vercel/Turbo system vars).`);
  console.log(entries.map(([key]) => `  - ${key}`).join('\n'));

  await pushToCoolify(entries);

  if (!dryRun) {
    console.log('\nNext: redeploy in Coolify (Deployments → Redeploy) or restart the application.');
  }
}

main().catch((error) => {
  console.error(error.message);
  console.error('\nIf Vercel pull fails with "Not authorized", run: vercel login');
  console.error('Then link the lordavocado project:');
  console.error('  vercel link --scope lordavocados-projects --project ai-cre-tools-com');
  process.exit(1);
});
