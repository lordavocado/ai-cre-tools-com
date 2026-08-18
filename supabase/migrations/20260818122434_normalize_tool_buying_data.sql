-- Add explicit, queryable buying criteria for high-quality programmatic SEO.
-- Existing records retain their current derived-page eligibility as `legacy`;
-- newly published records must pass editorial review before joining pSEO cohorts.

alter table public.ecosystem_apps
  add column workflows text[] not null default '{}',
  add column personas text[] not null default '{}',
  add column asset_classes text[] not null default '{}',
  add column integrations text[] not null default '{}',
  add column geographic_coverage text[] not null default '{}',
  add column deployment_options text[] not null default '{}',
  add column security_certifications text[] not null default '{}',
  add column input_types text[] not null default '{}',
  add column output_types text[] not null default '{}',
  add column limitations text[] not null default '{}',
  add column pricing_model text not null default 'unknown',
  add column starting_price_amount numeric(12, 2),
  add column starting_price_currency text,
  add column pricing_period text,
  add column has_free_trial boolean,
  add column has_free_plan boolean,
  add column best_for text,
  add column source_urls text[] not null default '{}',
  add column last_verified_at timestamptz,
  add column editorial_status text not null default 'draft',
  add column pseo_eligible boolean not null default false;

alter table public.ecosystem_apps
  add constraint ecosystem_apps_pricing_model_check
    check (pricing_model in (
      'unknown', 'free', 'freemium', 'subscription', 'usage_based',
      'per_user', 'per_unit', 'per_deal', 'one_time', 'enterprise', 'custom'
    )),
  add constraint ecosystem_apps_pricing_amount_check
    check (starting_price_amount is null or starting_price_amount >= 0),
  add constraint ecosystem_apps_pricing_currency_check
    check (
      starting_price_currency is null
      or starting_price_currency ~ '^[A-Z]{3}$'
    ),
  add constraint ecosystem_apps_pricing_period_check
    check (
      pricing_period is null
      or pricing_period in ('month', 'year', 'user_month', 'unit_month', 'deal', 'one_time', 'custom')
    ),
  add constraint ecosystem_apps_editorial_status_check
    check (editorial_status in ('legacy', 'draft', 'in_review', 'verified', 'stale', 'rejected')),
  add constraint ecosystem_apps_verified_pseo_check
    check (
      not pseo_eligible
      or editorial_status in ('legacy', 'verified')
    ),
  add constraint ecosystem_apps_verified_sources_check
    check (
      editorial_status <> 'verified'
      or (last_verified_at is not null and cardinality(source_urls) > 0)
    );

-- Preserve the existing index footprint until each legacy record is reviewed.
-- New records keep the column defaults (`draft`, `false`).
update public.ecosystem_apps
set editorial_status = 'legacy',
    pseo_eligible = true;

create index ecosystem_apps_workflows_gin
  on public.ecosystem_apps using gin (workflows);
create index ecosystem_apps_personas_gin
  on public.ecosystem_apps using gin (personas);
create index ecosystem_apps_asset_classes_gin
  on public.ecosystem_apps using gin (asset_classes);
create index ecosystem_apps_integrations_gin
  on public.ecosystem_apps using gin (integrations);
create index ecosystem_apps_pseo_eligible_idx
  on public.ecosystem_apps (editorial_status, last_verified_at desc)
  where pseo_eligible = true;

comment on column public.ecosystem_apps.workflows is
  'Controlled workflow slugs used for capability landing pages; see src/config/tool-taxonomy.ts.';
comment on column public.ecosystem_apps.personas is
  'Controlled persona slugs used for role landing pages; see src/config/tool-taxonomy.ts.';
comment on column public.ecosystem_apps.pseo_eligible is
  'Editorial switch for inclusion in derived pSEO cohorts. Tool profile pages remain public independently.';
comment on column public.ecosystem_apps.editorial_status is
  'Review lifecycle: legacy, draft, in_review, verified, stale, or rejected.';
