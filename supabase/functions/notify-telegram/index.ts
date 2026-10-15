// Уведомление в Telegram о новой заявке (вызывается триггером базы с loc_id).
// Шлёт только по существующей неподтверждённой и ещё не отправленной заявке.
const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

Deno.serve(async (req: Request) => {
  try {
    const { loc_id } = await req.json();
    if (!loc_id || typeof loc_id !== 'string') return new Response('bad request', { status: 400 });
    const url = Deno.env.get('SUPABASE_URL')!;
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chat = Deno.env.get('TELEGRAM_CHAT_ID');
    if (!token || !chat) return new Response('telegram not configured', { status: 500 });
    const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
    const q = `${url}/rest/v1/locations?loc_id=eq.${encodeURIComponent(loc_id)}&verified=eq.false&tg_notified=eq.false&select=loc_id,name,category,rarity,description,contact,images,x,y&limit=1`;
    const rows = await (await fetch(q, { headers })).json();
    const loc = Array.isArray(rows) ? rows[0] : null;
    if (!loc) return new Response('nothing to send', { status: 200 });
    const photo = Array.isArray(loc.images) && loc.images[0] ? `\n🖼 ${esc(loc.images[0])}` : '';
    const text =
      `🆕 <b>Новая заявка на карту</b>\n\n<b>${esc(loc.name)}</b>\n` +
      `Категория: ${esc(loc.category)}${loc.rarity ? ' · ' + esc(loc.rarity) : ''}\n` +
      `Координаты: ${esc(loc.x)}, ${esc(loc.y)}\n\n${esc(loc.description)}\n` +
      (loc.contact ? `\n📩 Контакт: ${esc(loc.contact)}` : '') + photo +
      `\n\nhttps://thevicemap.com/#${esc(loc.loc_id)}`;
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    if (!tg.ok) return new Response('telegram error ' + tg.status, { status: 502 });
    await fetch(`${url}/rest/v1/locations?loc_id=eq.${encodeURIComponent(loc_id)}`, {
      method: 'PATCH', headers, body: JSON.stringify({ tg_notified: true }),
    });
    return new Response('sent', { status: 200 });
  } catch (_) { return new Response('error', { status: 500 }); }
});
