import { writeFile } from 'node:fs/promises';

const origin = process.argv[2] ?? 'http://localhost:3100';
const concurrency = Number(process.argv[3] ?? 4);
const output = process.argv[4];
const live = !['localhost', '127.0.0.1'].includes(new URL(origin).hostname);
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > (live ? 2 : 12)) {
  throw new Error('Use 1–12 local workers, or at most 2 for a live verification.');
}
const ua = 'Mozilla/5.0 (compatible; AhrefsSiteAudit/6.1; +http://ahrefs.com/robot/site-audit)';
const decode = (text) => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'");
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
const local = (url) => { const target = new URL(url); return origin + target.pathname + target.search; };
async function fetchPage(url) {
  const start = performance.now();
  try {
    const response = await fetch(url, { headers: { 'User-Agent': ua }, redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    const ttfbMs = performance.now() - start;
    const html = await response.text();
    return { status: response.status, ttfbMs, totalMs: performance.now() - start, html, linkHeader: response.headers.get('link') };
  } catch (error) { return { status: 0, totalMs: performance.now() - start, error: error.message, html: '' }; }
}
const sitemap = await fetchPage(origin + '/sitemap.xml');
if (sitemap.status !== 200) throw new Error('Sitemap index failed');
const urls = [];
for (const url of locations(sitemap.html)) {
  const shard = await fetchPage(local(url));
  if (shard.status !== 200) throw new Error('Sitemap shard failed: ' + url);
  urls.push(...locations(shard.html));
}
const uniqueUrls = [...new Set(urls)];
const incoming = new Map(uniqueUrls.map(url => [new URL(url).pathname, new Set()]));
const pages = [];
let cursor = 0;
async function worker() {
  while (cursor < uniqueUrls.length) {
    const url = uniqueUrls[cursor++];
    const result = await fetchPage(local(url));
    const tags = [...result.html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(match => match[0]);
    const canonicalTag = tags.find(tag => /rel="canonical"/.test(tag));
    const canonical = canonicalTag?.match(/href="([^"]*)"/)?.[1];
    const noindex = tags.some(tag => /name="robots"/.test(tag) && /noindex/.test(tag));
    for (const match of result.html.matchAll(/<a\b[^>]*>/g)) {
      if (/rel="[^"]*nofollow/.test(match[0])) continue;
      const href = match[0].match(/href="([^"]*)"/)?.[1];
      if (!href) continue;
      const target = new URL(decode(href), url);
      if (target.origin !== new URL(url).origin || target.pathname === new URL(url).pathname) continue;
      incoming.get(target.pathname)?.add(new URL(url).pathname);
    }
    const { html, ...measurements } = result;
    pages.push({ url, ...measurements, canonical: canonical && decode(canonical), noindex, h1Count: [...html.matchAll(/<h1\b/g)].length, complete: html.includes('</html>') });
    if (pages.length % 100 === 0) console.log(`Checked ${pages.length}/${uniqueUrls.length}`);
    if (live) await new Promise(resolve => setTimeout(resolve, 500));
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
const times = pages.map(page => page.totalMs).sort((a,b) => a-b);
const summary = {
  origin, concurrency, checked: pages.length,
  failures: pages.filter(page => page.status !== 200 || !page.complete || page.noindex),
  canonicalMismatch: pages.filter(page => page.canonical?.replace(/\/$/, '') !== page.url.replace(/\/$/, '')),
  orphans: [...incoming].filter(([, sources]) => sources.size === 0).map(([url]) => url),
  singleSource: [...incoming].filter(([, sources]) => sources.size === 1).map(([url]) => url),
  timingMs: { p50: times[Math.floor(times.length * .5)], p95: times[Math.floor(times.length * .95)], max: times.at(-1) },
};
console.log(JSON.stringify(summary, null, 2));
if (output) await writeFile(output, JSON.stringify({ summary, pages }, null, 2));
if (summary.failures.length || summary.canonicalMismatch.length || summary.orphans.length) process.exitCode = 1;
