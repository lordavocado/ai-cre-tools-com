const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Isolate server modules without Next's runtime or live database access.
function loadModule(relativePath, mocks = {}, modules = new Map()) {
  const filename = path.resolve(__dirname, '..', relativePath);
  if (modules.has(filename)) return modules.get(filename).exports;
  const mod = { exports: {} };
  modules.set(filename, mod);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith('@/')) return loadModule(`src/${id.slice(2)}.ts`, mocks, modules);
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename })(localRequire, mod, mod.exports);
  return mod.exports;
}

function directoryFixture(error = null) {
  let requests = 0;
  let options;
  const rows = [
    { slug: 'alpha', name: 'Alpha', category: 'property-management-operations', one_liner: 'Lease documents', features: [], display_order: 1 },
    { slug: 'beta', name: 'Beta', category: 'construction-development', one_liner: 'Site analysis', features: [], display_order: 2 },
  ];
  const query = {
    select() { return this; }, order() { return this; }, or() { return this; }, eq(_column, slug) { this.slug = slug; return this; }, limit() { return this; }, abortSignal() { return this; },
    then(resolve, reject) { requests++; return Promise.resolve({ data: rows, error }).then(resolve, reject); },
    single() { requests++; return Promise.resolve({ data: rows.find(row => row.slug === this.slug), error }); },
  };
  const api = loadModule('src/lib/supabase.ts', {
    '@supabase/supabase-js': { createClient: () => ({ from: () => query }) },
    'react': { cache: (fn) => fn },
    'next/cache': { unstable_cache: (fn, _keys, settings) => {
      options = settings;
      let result;
      return () => result ??= fn();
    } },
  });
  return { api, requests: () => requests, options: () => options };
}

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'test-public-key';

test('profiles, categories, search and featured tools reuse one ordered dataset', async () => {
  const { api, requests, options } = directoryFixture();
  assert.equal((await api.getDirectoryItems()).length, 2);
  assert.equal((await api.getDirectoryItemBySlug('beta')).slug, 'beta');
  assert.equal(await api.getDirectoryItemBySlug('missing'), undefined);
  assert.equal(requests(), 1);
  assert.deepEqual((await api.getDirectoryItems('LEASE', 'property-management-operations')).map(x => x.slug), ['alpha']);
  assert.deepEqual(await api.getDirectoryItems(undefined, 'property-management'), []);
  assert.deepEqual((await api.getFeaturedItems(1)).map(x => x.slug), ['alpha']);
  assert.equal(requests(), 1);
  assert.equal(options().revalidate, 3600);
});

test('database outages propagate instead of publishing empty pages or false 404s', async () => {
  for (const call of [api => api.getDirectoryItems(), api => api.getDirectoryItemBySlug('alpha'), api => api.getFeaturedItems()]) {
    const { api } = directoryFixture({ code: '503', message: 'Database unavailable' });
    await assert.rejects(() => call(api), /Database unavailable/);
  }
});

test('middleware leaves canonical and caching policy to page metadata and Next', () => {
  const { middleware } = loadModule('src/middleware.ts', {
    'next/server': { NextResponse: { next: () => new Response(), redirect: () => new Response(null, { status: 308 }) } },
  });
  const url = new URL('https://www.aicretools.com/categories/property-management-operations?page=2');
  url.clone = () => url;
  for (const ua of ['Mozilla/5.0', 'AhrefsSiteAudit/6.1']) {
    const response = middleware({ nextUrl: url, headers: new Headers({ host: url.host, 'user-agent': ua }) });
    assert.equal(response.headers.get('Link'), null);
    assert.equal(response.headers.get('Cache-Control'), null);
  }
});

test('failed sitemap generation returns an uncached retryable error', async () => {
  const { GET } = loadModule('src/app/sitemaps/[group]/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/sitemap': { SITEMAP_GROUPS: ['tools'], buildUrlSetXml: () => '<urlset/>', getSitemapEntries: async () => { throw new Error('Database unavailable'); } },
  });
  const response = await GET(new Request('https://www.aicretools.com/sitemaps/tools.xml'), { params: Promise.resolve({ group: 'tools.xml' }) });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Retry-After'), '60');
});

test('pagination remains indexable with a self-canonical; filters remain noindex', () => {
  const { buildPaginatedMetadata } = loadModule('src/lib/seo-pages.ts');
  const metadata = buildPaginatedMetadata({ basePath: '/categories/property-management-operations', page: '2' });
  assert.equal(metadata.alternates.canonical, 'https://www.aicretools.com/categories/property-management-operations?page=2');
  assert.equal(metadata.robots.index, true);
  assert.equal(buildPaginatedMetadata({ basePath: '/', hasFilters: true }).robots.index, false);
});

test('use-case optimization preserves the existing cohort and eligibility rules', async () => {
  const modules = new Map();
  const seo = loadModule('src/lib/seo-pages.ts', {}, modules);
  const cases = loadModule('src/lib/seo-use-cases.ts', {}, modules);
  const { getAllSeoTags } = loadModule('src/config/seo-tags.ts', {}, modules);
  const { getAllSeoPersonas } = loadModule('src/config/seo-personas.ts', {}, modules);
  const { api } = directoryFixture();
  const [base] = await api.getDirectoryItems();
  const personas = getAllSeoPersonas();
  const workflows = getAllSeoTags();
  const items = Array.from({ length: 72 }, (_, i) => ({
    ...base, slug: 'tool-' + i, name: 'Tool ' + i,
    category: personas[i % personas.length].categorySlugs.join(','),
    personas: [personas[i % personas.length].slug],
    workflows: [workflows[i % 4].slug],
  }));
  const expected = [];
  const seen = new Set();
  for (const workflow of workflows) {
    const workflowItems = items.filter(item => item.workflows.includes(workflow.slug));
    for (const persona of personas) {
      const personaItems = seo.filterItemsByPersona(items, persona.slug, persona.categorySlugs);
      const tools = cases.filterItemsByUseCase(items, workflow, persona);
      if (tools.length < 3 || tools.length > 40) continue;
      if (tools.length / workflowItems.length > 0.9 || tools.length / personaItems.length > 0.9) continue;
      const key = tools.map(tool => tool.slug).sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      expected.push({ path: cases.getUseCasePath(workflow.slug, persona.slug), slugs: tools.map(tool => tool.slug) });
    }
  }
  const actual = cases.getIndexableUseCases(items);
  assert.ok(actual.length > 0);
  assert.deepEqual(actual.map(entry => ({ path: entry.path, slugs: entry.tools.map(tool => tool.slug) })).sort((a,b) => a.path.localeCompare(b.path)), expected.sort((a,b) => a.path.localeCompare(b.path)));
  assert.equal(cases.getIndexableUseCases(items), actual);
  assert.notEqual(cases.getIndexableUseCases([...items]), actual);
});

test('cheap alternative eligibility matches the ranked alternatives list', async () => {
  const { api } = directoryFixture();
  const [base] = await api.getDirectoryItems();
  const { hasEnoughAlternatives, getAlternativesForTool } = loadModule('src/config/seo-alternatives.ts');
  for (let count = 0; count < 12; count++) {
    const items = Array.from({ length: count }, (_, i) => ({ ...base, slug: 'tool-' + i, pseoEligible: i % 4 !== 0 }));
    for (const item of items) assert.equal(hasEnoughAlternatives(item, items), getAlternativesForTool(item, items).length >= 3);
  }
});

test('health check does not depend on database availability or expose internals', async () => {
  const { GET } = loadModule('src/app/api/health/route.ts');
  const response = GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
