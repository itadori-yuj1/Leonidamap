// Приём заявок на новую точку: проверка Cloudflare Turnstile на сервере + валидация,
// затем запись через service role. Прямую анонимную вставку в таблицу закрываем.
const CATEGORIES = ['weapons', 'vehicles', 'events', 'eastereggs', 'underwater', 'activities'];
const RARITIES = ['common', 'rare', 'unique'];
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
};
const reply = (body: string, status = 200) => new Response(body, { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return reply('method not allowed', 405);

  try {
    const b = await req.json();
    const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secret) return reply('captcha not configured', 500);

    const v = await (await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: String(b.token ?? '') }),
    })).json();
    if (!v.success) return reply('captcha failed', 403);

    const name = String(b.name ?? '').trim();
    const description = String(b.description ?? '').trim();
    const contact = b.contact ? String(b.contact).trim() : null;
    const x = Number(b.x), y = Number(b.y);
    const images = Array.isArray(b.images) ? b.images.map(String).slice(0, 3) : [];
    const base = Deno.env.get('SUPABASE_URL')!;

    if (!/^loc-\d{1,10}$/.test(String(b.loc_id))) return reply('bad id', 400);
    if (!CATEGORIES.includes(b.category)) return reply('bad category', 400);
    if (b.rarity && !RARITIES.includes(b.rarity)) return reply('bad rarity', 400);
    if (name.length < 1 || name.length > 80) return reply('bad name', 400);
    if (description.length < 1 || description.length > 1000) return reply('bad description', 400);
    if (contact && contact.length > 100) return reply('bad contact', 400);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 8192 || y < 0 || y > 8192) return reply('bad coords', 400);
    // картинки — только из нашего хранилища
    if (images.some((u) => !u.startsWith(`${base}/storage/v1/object/public/submissions/`))) return reply('bad image', 400);

    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const r = await fetch(`${base}/rest/v1/locations`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        loc_id: b.loc_id, name, category: b.category, description,
        rarity: b.rarity || null, x: Math.round(x), y: Math.round(y), contact,
        images, conditions: [], verified: false,
      }),
    });
    if (!r.ok) return reply('db error', 500);
    return reply('ok');
  } catch (_) {
    return reply('error', 500);
  }
});
