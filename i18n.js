/* =========================================================
   THE VICE MAP — i18n.js
   Переводы интерфейса (RU / EN / ES) и переключатель языка.
   Тексты режима картографа (админка) намеренно оставлены на русском —
   их видит только владелец сайта.
   ========================================================= */
(function () {
  const LANGS = ['ru', 'en', 'es'];

  const DICT = {
    ru: {
      'doc.title': 'THE VICE MAP — Интерактивная карта GTA VI: оружие, транспорт, пасхалки',
      'doc.desc': 'Неофициальная интерактивная карта Leonida (GTA VI): координаты оружия, транспорта, случайных событий и пасхалок. Отмечай найденное, ищи по названию.',
      'page.back': '← Назад к карте',
      'menu.open': 'Открыть меню',
      'brand.subtitle': 'Явные координаты. Никаких секретов.',
      'search.placeholder': 'Найти точку на карте…',
      'filters.aria': 'Фильтры категорий',
      'filters.label': 'Слои карты',
      'filters.all': 'Выбрать всё',
      'filters.none': 'Сбросить',
      'filters.unverified': 'Показывать неподтверждённые точки (бета)',
      'progress.found': 'Отмечено',
      'progress.reset': 'Сбросить отметки',
      'progress.confirm': 'Сбросить все отметки «найдено»?',
      'suggest.btn': '📍 Предложить находку',
      'footer.disclaimer': 'Неофициальный фан-проект. Не связан с Rockstar Games, Take-Two Interactive и не одобрен ими.',
      'footer.spots': 'Все находки',
      'footer.about': 'О проекте',
      'footer.privacy': 'Конфиденциальность',
      'lang.label': 'Язык',
      'cat.weapons': 'Оружие', 'cat.vehicles': 'Транспорт', 'cat.events': 'Случайные события',
      'cat.eastereggs': 'Пасхалки', 'cat.underwater': 'Подводный мир', 'cat.activities': 'Активности',
      'rarity.common': 'Обычная', 'rarity.rare': 'Редкая', 'rarity.unique': 'Уникальная',
      'cond.night': 'Ночь', 'cond.rain': 'Дождь', 'cond.requires-crowbar': 'Нужен лом',
      'cond.requires-tool': 'Нужен инструмент', 'cond.high-wanted-risk': 'Высокий розыск',
      'cond.underwater': 'Под водой', 'cond.daytime-only': 'Только днём',
      'popup.unverified': '⏳ Ожидает проверки — координаты могут быть неточными',
      'popup.found': '✔ Отмечено как найденное',
      'popup.markFound': 'Отметить как найденное',
      'popup.share': 'Скопировать ссылку на находку',
      'popup.shareAria': 'Поделиться этой точкой',
      'share.manual': 'Скопируйте ссылку вручную:',
      'load.error': 'Не удалось загрузить список точек.',
      'untitled': 'Без названия',
      'modal.closeAria': 'Закрыть форму',
      'modal.title': 'Предложить находку',
      'modal.subtitle': 'Нашли что-то на карте Leonida? Опишите — после проверки добавим точку на карту.',
      'form.name': 'Название', 'form.name.ph': 'Например: Тайник с дробовиком',
      'form.category': 'Категория',
      'form.desc': 'Описание', 'form.desc.ph': 'Где находится, как добраться, особенности...',
      'form.photo': 'Фото находки (необязательно, но сильно ускоряет проверку)',
      'form.rarity': 'Насколько редкая находка? (необязательно)',
      'form.rarity.none': 'Не уверен(а)',
      'form.rarity.common': 'Обычная — легко найти',
      'form.rarity.rare': 'Редкая — нужны условия',
      'form.rarity.unique': 'Уникальная — одна на карте',
      'form.pick': '🗺 Указать точку на карте',
      'form.picking': '🗺 Кликните по карте…',
      'form.contact': 'Контакт (необязательно)', 'form.contact.ph': 'Discord/почта, если хотите быть на связи',
      'form.submit': 'Отправить',
      'form.thanks': 'Спасибо! Заявка отправлена на проверку.',
      'form.captcha': '❌ Подтвердите, что вы не робот (галочка выше).',
      'form.noPoint': '❌ Сначала укажите точку на карте.',
      'form.uploading': 'Сжимаю и загружаю фото…',
      'form.photoFail': '❌ Не удалось загрузить фото. Попробуйте другое или отправьте без фото.',
      'form.sending': 'Отправляю заявку…',
      'form.sendFail': '❌ Не получилось отправить. Попробуйте ещё раз.',
    },
    en: {
      'doc.title': 'THE VICE MAP — Interactive GTA VI Map: weapons, vehicles, easter eggs',
      'doc.desc': 'Unofficial interactive map of Leonida (GTA VI): coordinates of weapons, vehicles, random events and easter eggs. Track what you found, search by name.',
      'page.back': '← Back to the map',
      'menu.open': 'Open menu',
      'brand.subtitle': 'Exact coordinates. No secrets.',
      'search.placeholder': 'Find a spot on the map…',
      'filters.aria': 'Category filters',
      'filters.label': 'Map layers',
      'filters.all': 'Select all',
      'filters.none': 'Clear',
      'filters.unverified': 'Show unverified spots (beta)',
      'progress.found': 'Found',
      'progress.reset': 'Reset progress',
      'progress.confirm': 'Reset all "found" marks?',
      'suggest.btn': '📍 Suggest a spot',
      'footer.disclaimer': 'Unofficial fan project. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive.',
      'footer.spots': 'All spots',
      'footer.about': 'About',
      'footer.privacy': 'Privacy',
      'lang.label': 'Language',
      'cat.weapons': 'Weapons', 'cat.vehicles': 'Vehicles', 'cat.events': 'Random events',
      'cat.eastereggs': 'Easter eggs', 'cat.underwater': 'Underwater', 'cat.activities': 'Activities',
      'rarity.common': 'Common', 'rarity.rare': 'Rare', 'rarity.unique': 'Unique',
      'cond.night': 'Night', 'cond.rain': 'Rain', 'cond.requires-crowbar': 'Crowbar needed',
      'cond.requires-tool': 'Tool needed', 'cond.high-wanted-risk': 'High wanted risk',
      'cond.underwater': 'Underwater', 'cond.daytime-only': 'Daytime only',
      'popup.unverified': '⏳ Awaiting review — coordinates may be inaccurate',
      'popup.found': '✔ Marked as found',
      'popup.markFound': 'Mark as found',
      'popup.share': 'Copy link to this spot',
      'popup.shareAria': 'Share this spot',
      'share.manual': 'Copy the link manually:',
      'load.error': 'Could not load the list of spots.',
      'untitled': 'Untitled',
      'modal.closeAria': 'Close form',
      'modal.title': 'Suggest a spot',
      'modal.subtitle': 'Found something on the Leonida map? Describe it — we will add it to the map after review.',
      'form.name': 'Name', 'form.name.ph': 'E.g.: Shotgun stash',
      'form.category': 'Category',
      'form.desc': 'Description', 'form.desc.ph': 'Where it is, how to get there, details...',
      'form.photo': 'Photo of the spot (optional, but speeds up review a lot)',
      'form.rarity': 'How rare is it? (optional)',
      'form.rarity.none': 'Not sure',
      'form.rarity.common': 'Common — easy to find',
      'form.rarity.rare': 'Rare — needs conditions',
      'form.rarity.unique': 'Unique — only one on the map',
      'form.pick': '🗺 Pick a point on the map',
      'form.picking': '🗺 Click on the map…',
      'form.contact': 'Contact (optional)', 'form.contact.ph': 'Discord/email, if you want to stay in touch',
      'form.submit': 'Submit',
      'form.thanks': 'Thanks! Your submission was sent for review.',
      'form.captcha': '❌ Please confirm you are not a robot (checkbox above).',
      'form.noPoint': '❌ Please pick a point on the map first.',
      'form.uploading': 'Compressing and uploading the photo…',
      'form.photoFail': '❌ Could not upload the photo. Try another one or submit without a photo.',
      'form.sending': 'Sending your submission…',
      'form.sendFail': '❌ Could not send it. Please try again.',
    },
    es: {
      'doc.title': 'THE VICE MAP — Mapa interactivo de GTA VI: armas, vehículos, secretos',
      'doc.desc': 'Mapa interactivo no oficial de Leonida (GTA VI): coordenadas de armas, vehículos, eventos aleatorios y secretos. Marca lo que encuentres y busca por nombre.',
      'page.back': '← Volver al mapa',
      'menu.open': 'Abrir menú',
      'brand.subtitle': 'Coordenadas exactas. Sin secretos.',
      'search.placeholder': 'Buscar un punto en el mapa…',
      'filters.aria': 'Filtros de categorías',
      'filters.label': 'Capas del mapa',
      'filters.all': 'Seleccionar todo',
      'filters.none': 'Borrar',
      'filters.unverified': 'Mostrar puntos sin verificar (beta)',
      'progress.found': 'Encontrados',
      'progress.reset': 'Reiniciar progreso',
      'progress.confirm': '¿Reiniciar todas las marcas de «encontrado»?',
      'suggest.btn': '📍 Sugerir un hallazgo',
      'footer.disclaimer': 'Proyecto de fans no oficial. Sin relación con Rockstar Games ni Take-Two Interactive, ni aprobado por ellas.',
      'footer.spots': 'Todos los hallazgos',
      'footer.about': 'Acerca de',
      'footer.privacy': 'Privacidad',
      'lang.label': 'Idioma',
      'cat.weapons': 'Armas', 'cat.vehicles': 'Vehículos', 'cat.events': 'Eventos aleatorios',
      'cat.eastereggs': 'Secretos', 'cat.underwater': 'Submarino', 'cat.activities': 'Actividades',
      'rarity.common': 'Común', 'rarity.rare': 'Rara', 'rarity.unique': 'Única',
      'cond.night': 'Noche', 'cond.rain': 'Lluvia', 'cond.requires-crowbar': 'Requiere palanca',
      'cond.requires-tool': 'Requiere herramienta', 'cond.high-wanted-risk': 'Alto riesgo de búsqueda',
      'cond.underwater': 'Bajo el agua', 'cond.daytime-only': 'Solo de día',
      'popup.unverified': '⏳ Pendiente de revisión — las coordenadas pueden ser inexactas',
      'popup.found': '✔ Marcado como encontrado',
      'popup.markFound': 'Marcar como encontrado',
      'popup.share': 'Copiar enlace de este punto',
      'popup.shareAria': 'Compartir este punto',
      'share.manual': 'Copia el enlace manualmente:',
      'load.error': 'No se pudo cargar la lista de puntos.',
      'untitled': 'Sin nombre',
      'modal.closeAria': 'Cerrar formulario',
      'modal.title': 'Sugerir un hallazgo',
      'modal.subtitle': '¿Encontraste algo en el mapa de Leonida? Descríbelo y lo añadiremos al mapa tras revisarlo.',
      'form.name': 'Nombre', 'form.name.ph': 'Ej.: Alijo con escopeta',
      'form.category': 'Categoría',
      'form.desc': 'Descripción', 'form.desc.ph': 'Dónde está, cómo llegar, detalles...',
      'form.photo': 'Foto del hallazgo (opcional, pero acelera mucho la revisión)',
      'form.rarity': '¿Qué tan raro es? (opcional)',
      'form.rarity.none': 'No estoy seguro/a',
      'form.rarity.common': 'Común — fácil de encontrar',
      'form.rarity.rare': 'Raro — requiere condiciones',
      'form.rarity.unique': 'Único — solo uno en el mapa',
      'form.pick': '🗺 Elegir un punto en el mapa',
      'form.picking': '🗺 Haz clic en el mapa…',
      'form.contact': 'Contacto (opcional)', 'form.contact.ph': 'Discord/correo, si quieres que te contactemos',
      'form.submit': 'Enviar',
      'form.thanks': '¡Gracias! Tu propuesta fue enviada para revisión.',
      'form.captcha': '❌ Confirma que no eres un robot (casilla de arriba).',
      'form.noPoint': '❌ Primero elige un punto en el mapa.',
      'form.uploading': 'Comprimiendo y subiendo la foto…',
      'form.photoFail': '❌ No se pudo subir la foto. Prueba con otra o envía sin foto.',
      'form.sending': 'Enviando tu propuesta…',
      'form.sendFail': '❌ No se pudo enviar. Inténtalo de nuevo.',
    },
  };

  const STORAGE_KEY = 'vicemap-lang';
  let lang = 'ru';
  let STATIC_ORIG = null;

  function detect() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (_) { /* localStorage может быть недоступен */ }
    const nav = (navigator.language || 'ru').slice(0, 2).toLowerCase();
    return LANGS.includes(nav) ? nav : 'ru';
  }

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || DICT.ru[key] || key;
  }

  function apply() {
    document.documentElement.lang = lang;
    const root = document.documentElement;
    const md = document.querySelector('meta[name="description"]');
    if (root.classList.contains('static-page-html')) {
      // статические страницы (О проекте, Конфиденциальность): заголовок берём из data-атрибутов
      if (!STATIC_ORIG) STATIC_ORIG = { title: document.title, desc: md ? md.getAttribute('content') : '' };
      const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
      document.title = root.dataset['title' + cap] || STATIC_ORIG.title;
      if (md) md.setAttribute('content', root.dataset['desc' + cap] || STATIC_ORIG.desc);
    } else {
      document.title = t('doc.title');
      if (md) md.setAttribute('content', t('doc.desc'));
    }
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('.lang-btn').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* не критично */ }
    apply();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  lang = detect();
  window.I18N = { t, getLang: () => lang, setLang, apply, LANGS };
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('.lang-btn').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  });
})();
