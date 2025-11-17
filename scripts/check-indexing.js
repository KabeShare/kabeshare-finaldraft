#!/usr/bin/env node
/*
  Check indexing signals for a set of URLs.
  Usage:
    node scripts/check-indexing.js [baseUrl] [pathsCsv]

  Examples:
    node scripts/check-indexing.js
    node scripts/check-indexing.js http://localhost:3000 /,/all-products,/vision
    node scripts/check-indexing.js https://kabeshare.com /,/all-products,/vision,/product
*/

const { load } = require('cheerio');
const { URL } = require('url');

const DEFAULT_BASE = 'http://localhost:3000';
const DEFAULT_PATHS = ['/', '/all-products', '/vision'];

const UAS = {
  Default:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  Googlebot:
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
};

function joinUrl(base, path) {
  try {
    if (/^https?:\/\//i.test(path)) return path;
    const u = new URL(base);
    // Ensure single slash between
    const joined = `${u.origin}${path.startsWith('/') ? '' : '/'}${path}`;
    return joined;
  } catch (e) {
    return path; // fallback
  }
}

async function fetchWithUA(url, userAgent) {
  const res = await fetch(url, {
    headers: {
      'user-agent': userAgent,
      'accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  const text = await res.text().catch(() => '');
  return { res, text, finalUrl: res.url || url };
}

function parseRobotsFromHtml(html) {
  const $ = load(html);
  const metaRobots = ($('meta[name="robots"]').attr('content') || '').trim();
  const metaGooglebot = (
    $('meta[name="googlebot"]').attr('content') || ''
  ).trim();
  const canonical = ($('link[rel="canonical"]').attr('href') || '').trim();
  return { metaRobots, metaGooglebot, canonical };
}

function containsNoIndex(value) {
  if (!value) return false;
  return /noindex/i.test(value);
}

function containsNoFollow(value) {
  if (!value) return false;
  return /nofollow/i.test(value);
}

function summarizeIndexable({ status, xRobots, metaRobots, metaGooglebot }) {
  const headerNoIndex = containsNoIndex(xRobots);
  const metaNoIndex =
    containsNoIndex(metaRobots) || containsNoIndex(metaGooglebot);
  const headerNoFollow = containsNoFollow(xRobots);
  const metaNoFollow =
    containsNoFollow(metaRobots) || containsNoFollow(metaGooglebot);

  return {
    indexable: status === 200 && !headerNoIndex && !metaNoIndex,
    follow: !(headerNoFollow || metaNoFollow),
    reasons: {
      status,
      headerNoIndex,
      metaNoIndex,
      headerNoFollow,
      metaNoFollow,
    },
  };
}

async function fetchRobotsTxt(base) {
  try {
    const robotsUrl = joinUrl(base, '/robots.txt');
    const { res, text } = await fetchWithUA(robotsUrl, UAS.Default);
    if (!res.ok) return { ok: false, content: '', rules: [] };
    const lines = text.split(/\r?\n/);
    const rules = [];
    let applies = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const mUA = trimmed.match(/^User-agent:\s*(.*)$/i);
      if (mUA) {
        const ua = mUA[1].trim();
        applies = ua === '*' || /google/i.test(ua);
        continue;
      }
      if (!applies) continue;
      const mDis = trimmed.match(/^Disallow:\s*(.*)$/i);
      if (mDis) rules.push({ type: 'disallow', path: mDis[1].trim() });
      const mAllow = trimmed.match(/^Allow:\s*(.*)$/i);
      if (mAllow) rules.push({ type: 'allow', path: mAllow[1].trim() });
    }
    return { ok: true, content: text, rules };
  } catch (e) {
    return { ok: false, content: '', rules: [] };
  }
}

function isPathAllowedByRobots(rules, path) {
  // Basic precedence: most specific rule wins; Allow beats Disallow when equal length
  const matches = rules
    .filter((r) => r.path === '' || path.startsWith(r.path))
    .sort((a, b) => b.path.length - a.path.length);
  if (matches.length === 0) return true;
  const top = matches[0];
  if (top.type === 'allow') return true;
  if (top.type === 'disallow' && top.path === '') return false; // disallow all
  return top.type !== 'disallow' ? true : false;
}

async function checkUrl(base, path) {
  const target = joinUrl(base, path);
  const results = {};
  for (const [label, ua] of Object.entries(UAS)) {
    const { res, text, finalUrl } = await fetchWithUA(target, ua);
    const xRobots = res.headers.get('x-robots-tag') || '';
    const cc = res.headers.get('cache-control') || '';
    const ct = res.headers.get('content-type') || '';
    const { metaRobots, metaGooglebot, canonical } = ct.includes('text/html')
      ? parseRobotsFromHtml(text)
      : { metaRobots: '', metaGooglebot: '', canonical: '' };
    const summary = summarizeIndexable({
      status: res.status,
      xRobots,
      metaRobots,
      metaGooglebot,
    });
    results[label] = {
      url: target,
      finalUrl,
      status: res.status,
      xRobots,
      metaRobots,
      metaGooglebot,
      canonical,
      cacheControl: cc,
      contentType: ct,
      ...summary,
    };
  }

  // robots.txt evaluation
  const robots = await fetchRobotsTxt(base);
  const robotsAllowed = robots.ok
    ? isPathAllowedByRobots(robots.rules, path)
    : true;

  return { path, base, robotsAllowed, byUA: results };
}

async function main() {
  const base = process.argv[2] || DEFAULT_BASE;
  const pathsCsv = process.argv[3];
  const paths = pathsCsv
    ? pathsCsv
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    : DEFAULT_PATHS;

  console.log(
    `\n🔎 Checking indexing signals\nBase: ${base}\nPaths: ${paths.join(
      ', '
    )}\n`
  );

  for (const p of paths) {
    try {
      const report = await checkUrl(base, p);
      console.log(`\n— ${joinUrl(base, p)} —`);
      console.log(`robots.txt allows: ${report.robotsAllowed ? 'YES' : 'NO'}`);
      for (const [ua, info] of Object.entries(report.byUA)) {
        const statusColor = info.status === 200 ? '200' : String(info.status);
        console.log(`  [${ua}] status=${statusColor}`);
        console.log(`    x-robots-tag: ${info.xRobots || '(none)'}`);
        if (info.metaRobots)
          console.log(`    <meta name=robots>: ${info.metaRobots}`);
        if (info.metaGooglebot)
          console.log(`    <meta name=googlebot>: ${info.metaGooglebot}`);
        if (info.canonical)
          console.log(`    <link rel=canonical>: ${info.canonical}`);
        console.log(`    indexable=${info.indexable} follow=${info.follow}`);
        if (!info.indexable)
          console.log(`    reasons: ${JSON.stringify(info.reasons)}`);
      }
    } catch (e) {
      console.error(`Error checking ${p}:`, e.message);
    }
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
