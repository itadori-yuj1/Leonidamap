// Генерация статических страниц для каждой подтверждённой находки (/spot/<id>),
// списка находок (/spots) и sitemap.xml — чтобы Google видел отдельные страницы с текстом.
// Запуск: node scripts/build-spots.mjs [путь/к/locations.json]
// Без аргумента данные берутся из Supabase (нужны SUPABASE_URL и SUPABASE_ANON_KEY).
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';

const SITE = 'https://thevicemap.com';
const CATEGORIES = {
  weapons: 'Оружие', vehicles: 'Транспорт', events: 'Случайные события',
  eastereggs: 'Пасхалки', underwater: 'Подводный мир', activities: 'Активности',
};
const RARITY = { rare: 'Редкая', unique: 'Уникальная' };

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function load() {
  const file = process.argv[2];
  if (file) return JSON.parse(readFileSync(file, 'utf8'));
  const base = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error('Нужны SUPABASE_URL и SUPABASE_ANON_KEY или путь к json');
  const r = await fetch(`${base}/rest/v1/locations?select=loc_id,name,category,description,images,rarity,verified&verified=eq.true&order=loc_id`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!r.ok) throw new Error('Supabase: ' + r.status);
  return r.json();
}

function imageUrl(loc) {
  const p = Array.isArray(loc.images) ? loc.images[0] : null;
  if (!p) return null;
  if (p.startsWith('img/')) return `${SITE}/${p}`;
  if (/^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\//.test(p)) return p;
  return null;
}

const head = ({ title, desc, canonical, image }) => `<!DOCTYPE html>
<html lang="ru" class="static-page-html">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0f0f13">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="THE VICE MAP">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image || SITE + '/og-image.png'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icons/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
</head>
<body class="static-page-body">
<main class="static-page">
  <a href="/" class="back-link">← Назад к карте</a>
`;
const foot = `
</main>
</body>
</html>
`;

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function spotPage(loc, all) {
  const cat = CATEGORIES[loc.category] || loc.category;
  const rar = RARITY[loc.rarity];
  const url = `${SITE}/spot/${loc.loc_id}`;
  const img = imageUrl(loc);
  const title = `${loc.name} — GTA VI, ${cat.toLowerCase()} | THE VICE MAP`;
  const desc = clip(`${loc.name}: ${loc.description}`.replace(/\s+/g, ' '), 155);
  const same = all.filter((l) => l.category === loc.category && l.loc_id !== loc.loc_id).slice(0, 5);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline: loc.name,
    description: loc.description, inLanguage: 'ru', mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: 'THE VICE MAP', url: SITE },
    ...(img ? { image: img } : {}),
  };
  return head({ title, desc, canonical: url, image: img }) + `
  <p class="page-updated"><a href="/spots">Все находки</a> · ${esc(cat)}${rar ? ' · ' + esc(rar) : ''}</p>
  <h1 class="page-title">${esc(loc.name)}</h1>
  ${img ? `<img class="spot-img" src="${esc(img)}" alt="${esc(loc.name)} — GTA VI" loading="lazy">` : ''}
  <p>${esc(loc.description)}</p>
  <p><a class="spot-cta" href="/#${esc(loc.loc_id)}">Показать на карте →</a></p>
  ${same.length ? `<h2>Ещё: ${esc(cat.toLowerCase())}</h2>
  <ul class="spot-list">${same.map((l) => `<li><a href="/spot/${esc(l.loc_id)}">${esc(l.name)}</a></li>`).join('')}</ul>` : ''}
  <p class="page-updated">THE VICE MAP — неофициальная фан-карта GTA VI. Не связана с Rockstar Games и Take-Two Interactive.</p>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>` + foot;
}

function hubPage(all) {
  const groups = Object.entries(CATEGORIES).map(([k, label]) => {
    const items = all.filter((l) => l.category === k);
    return items.length
      ? `<h2>${esc(label)}</h2>\n  <ul class="spot-list">${items.map((l) => `<li><a href="/spot/${esc(l.loc_id)}">${esc(l.name)}</a></li>`).join('')}</ul>` : '';
  }).join('\n  ');
  return head({
    title: 'Все находки GTA VI на карте — оружие, транспорт, пасхалки | THE VICE MAP',
    desc: `Каталог находок GTA VI на русском: ${all.length} подтверждённых точек с описанием и координатами — оружие, транспорт, события, пасхалки.`,
    canonical: `${SITE}/spots`,
  }) + `
  <h1 class="page-title">Все находки GTA VI</h1>
  <p class="page-updated">Подтверждённых точек: ${all.length}</p>
  <p>Каталог находок из GTA VI по категориям. Каждая находка — на интерактивной <a href="/">карте</a> с координатами.</p>
  ${groups}` + foot;
}

function sitemap(all) {
  const u = (p, cf, pr) => `  <url>\n    <loc>${SITE}${p}</loc>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [u('/', 'daily', '1.0'), u('/spots', 'daily', '0.8'),
     ...all.map((l) => u(`/spot/${l.loc_id}`, 'weekly', '0.6')),
     u('/about', 'monthly', '0.5'), u('/privacy', 'yearly', '0.3')].join('\n') + '\n</urlset>\n';
}

const rows = (await load()).filter((l) => l.verified !== false && /^[a-z0-9-]+$/i.test(l.loc_id));
if (!rows.length) throw new Error('Нет подтверждённых точек — страницы не пересобираем');

if (existsSync('spot')) rmSync('spot', { recursive: true });
mkdirSync('spot', { recursive: true });
for (const loc of rows) writeFileSync(`spot/${loc.loc_id}.html`, spotPage(loc, rows));
writeFileSync('spots.html', hubPage(rows));
writeFileSync('sitemap.xml', sitemap(rows));
console.log(`Готово: ${rows.length} страниц находок + /spots + sitemap.xml`);
