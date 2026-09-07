/* =========================================================
   LEONIDA MAP — app.js
   ========================================================= */

/* ---------------------------------------------------------
   1. КОНФИГ КАТЕГОРИЙ, РЕДКОСТИ И ТЭГОВ УСЛОВИЙ
--------------------------------------------------------- */
const CATEGORIES = {
  weapons:    { label: 'Оружие',            color: '#ff007f' },
  vehicles:   { label: 'Транспорт',         color: '#00f0ff' },
  events:     { label: 'Случайные события', color: '#ffd400' },
  eastereggs: { label: 'Пасхалки',          color: '#a259ff' },
  underwater: { label: 'Подводный мир',     color: '#00b4d8' },
  activities: { label: 'Активности',        color: '#8bc34a' },
};

const RARITY = {
  common: { label: 'Обычная' },
  rare:   { label: 'Редкая' },
  unique: { label: 'Уникальная' },
};

// Известные тэги условий доступности точки — если встретится тэг не из
// этого списка, просто покажем его как есть (без перевода на русский).
const CONDITION_LABELS = {
  'night': 'Ночь',
  'rain': 'Дождь',
  'requires-crowbar': 'Нужен лом',
  'requires-tool': 'Нужен инструмент',
  'high-wanted-risk': 'Высокий розыск',
  'underwater': 'Под водой',
  'daytime-only': 'Только днём',
};
function conditionLabel(tag) {
  return CONDITION_LABELS[tag] || tag;
}

/* ---------------------------------------------------------
   2. БАЗА ДАННЫХ ТОЧЕК
   Грузится асинхронно из locations.json. Поддерживаемые поля
   объекта (кроме обязательных id/name/category/x/y/description):
   - images: string[]   — необязательно; для обратной совместимости
     старое одиночное поле "image" тоже поддерживается (см. getImages)
   - rarity: "common" | "rare" | "unique" — по умолчанию common
   - conditions: string[] — тэги условий (ночь/дождь/инструмент…)
   - verified: boolean — false для точек, ожидающих проверки
     модератором; они скрыты, пока пользователь не включит тогл
     «Показывать неподтверждённые точки»
--------------------------------------------------------- */
let locations = [];

// Достаёт массив картинок независимо от того, какое поле использовано —
// новое "images" или старое одиночное "image" (для точек, добавленных
// до миграции схемы).
function getImages(location) {
  if (Array.isArray(location.images) && location.images.length) return location.images;
  if (location.image) return [location.image];
  return [];
}

/* ---------------------------------------------------------
   3. ПАРАМЕТРЫ ТАЙЛОВОЙ КАРТЫ (CRS.Simple + gdal2tiles)
--------------------------------------------------------- */
const mapConfig = {
  tileMinZoom: 0,
  tileMaxZoom: 5,
  tileSize: 256,
  fullWidth: 8192,
  fullHeight: 8192,
};

/* ---------------------------------------------------------
   4. LOCALSTORAGE — состояние «найдено»
--------------------------------------------------------- */
const STORAGE_KEY = 'leonida-map-found';

function getFoundSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveFoundSet(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

let foundIds = getFoundSet();

/* ---------------------------------------------------------
   5. ИНИЦИАЛИЗАЦИЯ КАРТЫ (Leaflet + CRS.Simple)
--------------------------------------------------------- */
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: mapConfig.tileMinZoom,
  maxZoom: mapConfig.tileMaxZoom,
  zoomControl: false,
  attributionControl: false,
});

const bounds = L.latLngBounds(
  map.unproject([0, mapConfig.fullHeight], mapConfig.tileMaxZoom),
  map.unproject([mapConfig.fullWidth, 0], mapConfig.tileMaxZoom)
);

const mapTiles = L.tileLayer('tiles/{z}/{x}/{y}.png', {
  minZoom: mapConfig.tileMinZoom,
  maxZoom: mapConfig.tileMaxZoom,
  tileSize: mapConfig.tileSize,
  noWrap: true,
  bounds: bounds,
}).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds.pad(0.25));

L.control.zoom({ position: 'bottomright' }).addTo(map);

function pointToLatLng(x, y) {
  return map.unproject([x, y], mapConfig.tileMaxZoom);
}

/* ---------------------------------------------------------
   6. СОЗДАНИЕ МАРКЕРОВ (с учётом редкости и статуса проверки)
--------------------------------------------------------- */
const layerGroups = {};
const markerIndex = {};

Object.keys(CATEGORIES).forEach(cat => {
  layerGroups[cat] = L.layerGroup().addTo(map);
});

function createIcon(location) {
  const color = CATEGORIES[location.category].color;
  const isFound = foundIds.has(location.id);
  const rarity = location.rarity && RARITY[location.rarity] ? location.rarity : 'common';
  const isUnverified = location.verified === false;

  const classes = ['leo-marker'];
  if (isFound) classes.push('is-found');
  if (rarity !== 'common') classes.push(`rarity-${rarity}`);
  if (isUnverified) classes.push('is-unverified');

  return L.divIcon({
    className: '',
    html: `<div class="${classes.join(' ')}" style="--m-color:${color}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

function buildPopupHtml(location) {
  const cat = CATEGORIES[location.category];
  const isFound = foundIds.has(location.id);
  const rarity = location.rarity && RARITY[location.rarity] ? location.rarity : 'common';

  const images = getImages(location);
  const imageHtml = images.length
    ? `<div class="leo-popup-img-wrap"><img src="${images[0]}" alt="${location.name}" class="leo-popup-img" loading="lazy" onerror="this.closest('.leo-popup-img-wrap').style.display='none'"></div>`
    : '';

  const rarityHtml = rarity !== 'common'
    ? ` · <span class="leo-popup-rarity rarity-${rarity}">${RARITY[rarity].label}</span>`
    : '';

  const tagsHtml = (location.conditions && location.conditions.length)
    ? `<div class="leo-popup-tags">${location.conditions.map(c => `<span class="leo-popup-tag">${conditionLabel(c)}</span>`).join('')}</div>`
    : '';

  const unverifiedHtml = location.verified === false
    ? `<div class="leo-popup-unverified">⏳ Ожидает проверки — координаты могут быть неточными</div>`
    : '';

  return `
    <div class="leo-popup-inner" style="--pop-color:${cat.color}">
      <div class="leo-popup-band"></div>
      ${imageHtml}
      <div class="leo-popup-body">
        ${unverifiedHtml}
        <div class="leo-popup-category">${cat.label.toUpperCase()}${rarityHtml}</div>
        <h3 class="leo-popup-title">${location.name}</h3>
        ${tagsHtml}
        <p class="leo-popup-desc">${location.description}</p>
        <div class="leo-popup-actions">
          <button class="leo-popup-btn${isFound ? ' is-active' : ''}" data-loc-id="${location.id}">
            ${isFound ? '✔ Отмечено как найденное' : 'Отметить как найденное'}
          </button>
          <button class="leo-popup-share-btn" data-loc-id="${location.id}" title="Скопировать ссылку на находку" aria-label="Поделиться этой точкой">🔗</button>
        </div>
      </div>
    </div>`;
}

function renderMarkers() {
  locations.forEach(loc => {
    const marker = L.marker(pointToLatLng(loc.x, loc.y), { icon: createIcon(loc) });
    marker.bindPopup(buildPopupHtml(loc), { className: 'leo-popup', closeButton: true });
    marker.addTo(layerGroups[loc.category]);
    marker._leoId = loc.id; // для deep-link (#loc-002) и обновления хэша при открытии попапа
    markerIndex[loc.id] = { marker, data: loc };
  });
}

// Leaflet divIcon оборачивает переданный html в свой собственный контейнер
// (marker.getElement() возвращает именно эту обёртку, с классами вроде
// "leaflet-marker-icon" — БЕЗ "leo-marker"). Сам .leo-marker div, к которому
// привязаны стили/анимации, лежит на уровень глубже. Классы вроде fade-out
// или is-highlighted нужно вешать именно на него, иначе CSS-селектор
// ".leo-marker.fade-out" не совпадёт и анимация молча не сработает.
// Фоллбэк на wrapper — на случай, если .leo-marker вдруг не найден.
function getMarkerEl(marker) {
  const wrapper = marker.getElement && marker.getElement();
  if (!wrapper) return null;
  return wrapper.querySelector('.leo-marker') || wrapper;
}

/* ---------------------------------------------------------
   7. ЛОГИКА «ОТМЕТИТЬ КАК НАЙДЕННОЕ»
--------------------------------------------------------- */
function bindPopupButton(popupNode) {
  const btn = popupNode.querySelector('.leo-popup-btn');
  if (btn) {
    btn.onclick = () => toggleFound(btn.dataset.locId);
  }

  const shareBtn = popupNode.querySelector('.leo-popup-share-btn');
  if (shareBtn) {
    shareBtn.onclick = () => shareLocation(shareBtn.dataset.locId, shareBtn);
  }
}

// Делится прямой ссылкой на находку (map.html#loc-002). На мобильных с
// поддержкой Web Share API открывает системное меню «Поделиться»
// (Telegram/WhatsApp/Discord и т.д.), иначе копирует ссылку в буфер
// обмена и на секунду показывает галочку прямо на кнопке.
function shareLocation(id, btnEl) {
  const entry = markerIndex[id];
  if (!entry) return;

  const url = `${location.origin}${location.pathname}#${id}`;
  const title = `LEONIDA MAP — ${entry.data.name}`;

  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {
      // Пользователь просто закрыл системное меню — это не ошибка, ничего не делаем
    });
    return;
  }

  const showCopied = () => {
    btnEl.textContent = '✓';
    btnEl.classList.add('is-copied');
    setTimeout(() => {
      btnEl.textContent = '🔗';
      btnEl.classList.remove('is-copied');
    }, 1600);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(showCopied).catch(() => {
      prompt('Скопируйте ссылку вручную:', url);
    });
  } else {
    prompt('Скопируйте ссылку вручную:', url);
  }
}

map.on('popupopen', (e) => bindPopupButton(e.popup.getElement()));

// Синхронизируем URL-хэш с открытым попапом (только для реальных точек,
// не для временного маркера режима картографа — у него нет _leoId).
// replaceState не создаёт запись в истории и не триггерит hashchange —
// поэтому не конфликтует с обработчиком window.addEventListener('hashchange', ...) ниже.
map.on('popupopen', (e) => {
  const id = e.popup._source && e.popup._source._leoId;
  if (id) history.replaceState(null, '', '#' + id);
});
map.on('popupclose', (e) => {
  const id = e.popup._source && e.popup._source._leoId;
  if (id && location.hash === '#' + id) {
    history.replaceState(null, '', location.pathname + location.search);
  }
});

function toggleFound(id) {
  if (foundIds.has(id)) {
    foundIds.delete(id);
  } else {
    foundIds.add(id);
  }
  saveFoundSet(foundIds);

  const { marker, data } = markerIndex[id];
  marker.setIcon(createIcon(data));
  marker.setPopupContent(buildPopupHtml(data));

  const popupEl = marker.getPopup() && marker.getPopup().getElement();
  if (popupEl) bindPopupButton(popupEl);

  updateProgress();
}

// Прогресс считаем только по проверенным точкам — неподтверждённые ещё
// официально не "на карте", поэтому не должны влиять на статистику.
function updateProgress() {
  const countable = locations.filter(l => l.verified !== false);
  const total = countable.length;
  const found = countable.filter(l => foundIds.has(l.id)).length;
  document.getElementById('progressText').textContent = `${found} / ${total}`;
  document.getElementById('progressFill').style.width = total ? `${(found / total) * 100}%` : '0%';
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Сбросить все отметки «найдено»?')) return;
  foundIds.clear();
  saveFoundSet(foundIds);
  locations.forEach(loc => markerIndex[loc.id].marker.setIcon(createIcon(loc)));
  updateProgress();
});

/* ---------------------------------------------------------
   8. САЙДБАР: РЕНДЕР ФИЛЬТРОВ И СЧЁТЧИКОВ
--------------------------------------------------------- */
const filterListEl = document.getElementById('filterList');
const activeCategories = new Set(Object.keys(CATEGORIES));
const filterCountEls = {}; // { category: <span> } — чтобы обновлять счётчик при переключении тогла

let showUnverified = false;

function countByCategory(cat) {
  return locations.filter(l => l.category === cat && (l.verified !== false || showUnverified)).length;
}

function renderFilters() {
  Object.entries(CATEGORIES).forEach(([key, cfg]) => {
    const label = document.createElement('label');
    label.className = 'filter-item';
    label.dataset.category = key;
    label.style.setProperty('--cat-color', cfg.color);
    label.innerHTML = `
      <input type="checkbox" checked data-category="${key}">
      <span class="filter-swatch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span class="filter-name">${cfg.label}</span>
      <span class="filter-count">${countByCategory(key)}</span>
    `;
    filterListEl.appendChild(label);
    filterCountEls[key] = label.querySelector('.filter-count');
  });
}

function updateFilterCounts() {
  Object.keys(CATEGORIES).forEach(key => {
    if (filterCountEls[key]) filterCountEls[key].textContent = countByCategory(key);
  });
}

const showUnverifiedToggle = document.getElementById('showUnverifiedToggle');
showUnverifiedToggle.addEventListener('change', () => {
  showUnverified = showUnverifiedToggle.checked;
  updateFilterCounts();
  applySearchFilter();
});

// Кнопки «Выбрать всё / Сбросить» — просто программно щёлкают по всем
// чекбоксам и диспатчат 'change', чтобы сработала та же логика
// добавления/удаления слоёв с fade-анимацией, что и при ручном клике.
function setAllFilters(checked) {
  filterListEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.checked !== checked) {
      cb.checked = checked;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

document.getElementById('selectAllBtn').addEventListener('click', () => setAllFilters(true));
document.getElementById('clearAllBtn').addEventListener('click', () => setAllFilters(false));

/* ---------------------------------------------------------
   9. ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
--------------------------------------------------------- */
filterListEl.addEventListener('change', (e) => {
  const checkbox = e.target.closest('input[type="checkbox"]');
  if (!checkbox) return;

  const cat = checkbox.dataset.category;
  const item = checkbox.closest('.filter-item');
  const group = layerGroups[cat];

  if (checkbox.checked) {
    activeCategories.add(cat);
    item.classList.remove('is-off');
    group.addTo(map);
    group.eachLayer(m => {
      const el = getMarkerEl(m);
      if (el) {
        el.classList.add('fade-out');
        requestAnimationFrame(() => el.classList.remove('fade-out'));
      }
    });
  } else {
    activeCategories.delete(cat);
    item.classList.add('is-off');
    group.eachLayer(m => {
      const el = getMarkerEl(m);
      if (el) el.classList.add('fade-out');
    });
    setTimeout(() => {
      if (!activeCategories.has(cat)) map.removeLayer(group);
    }, 300);
  }

  applySearchFilter();
});

/* ---------------------------------------------------------
   10. ПОИСК ПО НАЗВАНИЮ
--------------------------------------------------------- */
const searchInput = document.getElementById('searchInput');

function applySearchFilter() {
  const query = searchInput.value.trim().toLowerCase();

  locations.forEach(loc => {
    const { marker } = markerIndex[loc.id];
    const matchesQuery = query === '' || loc.name.toLowerCase().includes(query);
    const categoryActive = activeCategories.has(loc.category);
    const verifiedOk = loc.verified !== false || showUnverified;
    const shouldShow = matchesQuery && categoryActive && verifiedOk;

    const el = marker.getElement();
    if (!el) return;

    el.style.display = shouldShow ? '' : 'none';
  });
}

function debounce(fn, ms = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

searchInput.addEventListener('input', debounce(applySearchFilter, 150));

/* ---------------------------------------------------------
   11. МОБИЛЬНОЕ МЕНЮ
--------------------------------------------------------- */
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const overlay = document.getElementById('overlay');

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle('is-open', isOpen);
  hamburgerBtn.classList.toggle('is-open', isOpen);
  overlay.classList.toggle('is-visible', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
}

hamburgerBtn.addEventListener('click', () => {
  setSidebarOpen(!sidebar.classList.contains('is-open'));
});
overlay.addEventListener('click', () => setSidebarOpen(false));

map.on('popupopen', () => {
  if (window.innerWidth <= 860) setSidebarOpen(false);
});

/* ---------------------------------------------------------
   12. ЗАГРУЗКА ДАННЫХ + DEEP-LINK ПО ХЭШУ (#loc-002)
--------------------------------------------------------- */

// Центрирует карту на точке и открывает её попап. Если точка ещё
// скрыта фильтром категории или статусом "не проверено" — снимаем
// соответствующие ограничения, чтобы ссылка гарантированно открылась.
function goToLocationById(id) {
  const entry = markerIndex[id];
  if (!entry) return false;
  const { marker, data } = entry;

  if (data.verified === false && !showUnverified) {
    showUnverified = true;
    showUnverifiedToggle.checked = true;
    updateFilterCounts();
  }

  if (!activeCategories.has(data.category)) {
    activeCategories.add(data.category);
    const cb = filterListEl.querySelector(`input[data-category="${data.category}"]`);
    if (cb) {
      cb.checked = true;
      cb.closest('.filter-item').classList.remove('is-off');
      layerGroups[data.category].addTo(map);
    }
  }

  applySearchFilter();
  map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), mapConfig.tileMaxZoom - 1));
  marker.openPopup();
  highlightMarker(marker);
  return true;
}

// Пульсирующая обводка вокруг маркера — привлекает взгляд к нужной точке
// после перехода по прямой ссылке (#loc-002), чтобы не искать её на карте.
function highlightMarker(marker) {
  const el = getMarkerEl(marker);
  if (!el) return;
  el.classList.remove('is-highlighted');
  void el.offsetWidth; // форсируем reflow — иначе повторный переход по той же ссылке не перезапустит анимацию
  el.classList.add('is-highlighted');
  setTimeout(() => el.classList.remove('is-highlighted'), 2700);
}

// При открытии страницы по ссылке вида map.html#loc-002
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#', '');
  if (id) goToLocationById(id);
});

/* ---------------------------------------------------------
   Подключение Supabase. anon-ключ намеренно открытый (не пароль) —
   вся реальная защита на уровне базы через RLS-политики: сейчас
   разрешено только чтение (SELECT), запись пока не разрешена никому.
--------------------------------------------------------- */
const SUPABASE_URL = 'https://izwqsntcwjvrjlbptbew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6d3FzbnRjd2p2cmpsYnB0YmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NTg4NDUsImV4cCI6MjEwNDMzNDg0NX0.ebl2eIKwHWJHohN3dngY2v8pqG-rSajhIUZNX0YXsig';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// В таблице колонка называется loc_id (не id — эта колонка у Supabase
// занята под её собственный внутренний числовой id), поэтому здесь
// переводим формат строки из базы в тот же вид объекта, который уже
// использует весь остальной код (renderMarkers, buildPopupHtml и т.д.).
function rowToLocation(row) {
  return {
    id: row.loc_id,
    name: row.name,
    category: row.category,
    x: row.x,
    y: row.y,
    description: row.description,
    images: row.images || [],
    rarity: row.rarity,
    conditions: row.conditions || [],
    verified: row.verified,
  };
}

db.from('locations').select('*')
  .then(({ data, error }) => {
    if (error) throw error;
    locations = data.map(rowToLocation);
    renderMarkers();
    renderFilters();
    updateProgress();
    applySearchFilter(); // сразу скрывает неподтверждённые точки по умолчанию

    // Если страница открыта сразу по ссылке с хэшем — переходим к точке
    const initialId = location.hash.replace('#', '');
    if (initialId) goToLocationById(initialId);
  })
  .catch(err => {
    console.error('Не удалось загрузить точки из Supabase:', err);
    alert('Не удалось загрузить список точек.');
  });

/* ---------------------------------------------------------
   13. РЕЖИМ КАРТОГРАФА (АДМИНКА)
   Простой код доступа через prompt() — НЕ настоящая защита (код виден
   в исходнике JS любому, кто откроет "Просмотр кода страницы"), но
   отсекает случайных людей, которые наткнутся на Ctrl+Shift+A и просто
   из любопытства попробуют его нажать. Смените ADMIN_PASSCODE на свой.
--------------------------------------------------------- */
let isAdminMode = false;
let tempAdminMarker = null;

const adminPanel = document.getElementById('adminPanel');
const admGoX = document.getElementById('admGoX');
const admGoY = document.getElementById('admGoY');

const ADMIN_PASSCODE = '&yEV3XfVZM_Rw4kH'; // сгенерированный код — смените, если хотите свой

function toggleAdminMode() {
  isAdminMode = !isAdminMode;
  // Панель показывается/прячется классом is-open — так же, как в CSS
  // (.admin-panel.is-open { display:block }), а не через [hidden].
  adminPanel.classList.toggle('is-open', isAdminMode);
}

window.addEventListener('keydown', (e) => {
  if (!(e.ctrlKey && e.shiftKey && e.code === 'KeyA')) return;

  // Выключить можно без повторного ввода кода — спрашиваем код только на вход
  if (isAdminMode) {
    toggleAdminMode();
    return;
  }

  const entered = prompt('Код доступа картографа:');
  if (entered === null) return; // нажали "Отмена" — молча ничего не делаем
  if (entered === ADMIN_PASSCODE) {
    toggleAdminMode();
  } else {
    alert('Неверный код.');
  }
});

// Общий редактор точки: строит попап-форму (название/категория/редкость/
// условия/картинки/статус) в указанных координатах. Используется и при
// клике по карте, и при вводе X/Y вручную в панели картографа — так
// оба способа добавления точки остаются полностью одинаковыми по функциям.
function openAdminEditor(x, y, latlng) {
  if (tempAdminMarker) map.removeLayer(tempAdminMarker);
  tempAdminMarker = L.marker(latlng).addTo(map);

  const conditionOptions = [
    ['night', 'Ночь'], ['rain', 'Дождь'], ['requires-crowbar', 'Нужен лом'],
    ['requires-tool', 'Нужен инструмент'], ['high-wanted-risk', 'Высокий розыск'],
    ['underwater', 'Под водой'], ['daytime-only', 'Только днём'],
  ];
  const conditionsHtml = conditionOptions.map(([val, label]) => `
    <label style="display:inline-flex; align-items:center; gap:4px; font-size:11px; margin:2px 8px 2px 0; color:#ccc;">
      <input type="checkbox" class="admCondition" value="${val}"> ${label}
    </label>
  `).join('');

  const popupHtml = `
    <div class="leo-popup-inner" style="--pop-color: #00f0ff; width: 270px;">
      <div class="leo-popup-band"></div>
      <div class="leo-popup-body">
        <div class="leo-popup-category">НОВАЯ ТОЧКА [X: ${x}, Y: ${y}]</div>

        <input id="admName" type="text" placeholder="Название объекта"
          style="width:100%; margin:8px 0 6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">

        <select id="admCat" style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">
          <option value="weapons">Оружие</option>
          <option value="vehicles">Транспорт</option>
          <option value="events">Случайные события</option>
          <option value="eastereggs">Пасхалки</option>
          <option value="underwater">Подводный мир</option>
          <option value="activities">Активности</option>
        </select>

        <select id="admRarity" style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">
          <option value="common">Обычная</option>
          <option value="rare">Редкая</option>
          <option value="unique">Уникальная</option>
        </select>

        <div style="margin-bottom:6px;">${conditionsHtml}</div>

        <input id="admImg" type="text" placeholder="Картинки через запятую (напр: shotgun.jpg, shotgun2.jpg)"
          style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:12px;">

        <textarea id="admDesc" placeholder="Описание..." rows="2"
          style="width:100%; margin-bottom:8px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:12px; resize:none;"></textarea>

        <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#ccc; margin-bottom:8px;">
          <input type="checkbox" id="admVerified" checked> Проверено (сразу видно всем на карте)
        </label>

        <button id="admCopyBtn" class="leo-popup-btn" style="background:#00f0ff; color:#0f0f13;">
          📋 Скопировать JSON
        </button>
      </div>
    </div>
  `;

  tempAdminMarker.bindPopup(popupHtml, { className: 'leo-popup' }).openPopup();

  setTimeout(() => {
    const copyBtn = document.getElementById('admCopyBtn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const name = document.getElementById('admName').value || 'Без названия';
        const category = document.getElementById('admCat').value;
        const rarity = document.getElementById('admRarity').value;
        const description = document.getElementById('admDesc').value || '';
        const verified = document.getElementById('admVerified').checked;

        const imgVal = document.getElementById('admImg').value.trim();
        const images = imgVal
          ? imgVal.split(',').map(s => s.trim()).filter(Boolean).map(s => `img/${s}`)
          : [];

        const conditions = Array.from(document.querySelectorAll('.admCondition:checked')).map(cb => cb.value);

        const id = 'loc-' + String(Date.now()).slice(-4);
        const jsonObject = { id, name, category, x, y, description, images, rarity, conditions, verified };
        const jsonString = JSON.stringify(jsonObject, null, 2);

        navigator.clipboard.writeText(jsonString).then(() => {
          alert('JSON скопирован в буфер обмена!\nВставь его в массив locations.json');
        }).catch(() => {
          alert('Не удалось скопировать автоматически — открой консоль и скопируй JSON вручную.');
          console.log(jsonString);
        });
      };
    }
  }, 100);
}

// Клик по карте — координаты берём из места клика
map.on('click', (e) => {
  if (!isAdminMode) return;
  const point = map.project(e.latlng, mapConfig.tileMaxZoom);
  openAdminEditor(Math.round(point.x), Math.round(point.y), e.latlng);
});

// Ручной ввод X/Y в панели картографа — центрирует карту на точке
// и сразу открывает тот же редактор, без необходимости кликать.
// Полезно, когда координаты уже известны заранее (например, из датамайна
// или из заявки в форме «Предложить находку»).
document.getElementById('admGoBtn').addEventListener('click', () => {
  const x = parseInt(admGoX.value, 10);
  const y = parseInt(admGoY.value, 10);
  if (Number.isNaN(x) || Number.isNaN(y)) {
    alert('Введите оба значения — X и Y');
    return;
  }
  const latlng = pointToLatLng(x, y);
  map.flyTo(latlng, Math.max(map.getZoom(), mapConfig.tileMaxZoom - 1));
  openAdminEditor(x, y, latlng);
});

/* ---------------------------------------------------------
   14. МОДАЛКА «ПРЕДЛОЖИТЬ НАХОДКУ»
--------------------------------------------------------- */
const suggestBtn = document.getElementById('suggestBtn');
const suggestOverlay = document.getElementById('suggestOverlay');
const suggestModal = document.getElementById('suggestModal');
const suggestCloseBtn = document.getElementById('suggestCloseBtn');
const suggestForm = document.getElementById('suggestForm');
const suggestSubmitBtn = document.getElementById('suggestSubmitBtn');
const suggestStatus = document.getElementById('suggestStatus');
const pickLocationBtn = document.getElementById('pickLocationBtn');

function openSuggestModal() {
  suggestOverlay.classList.add('is-open');
  suggestModal.classList.add('is-open');
  if (window.innerWidth <= 860) setSidebarOpen(false);
}

function closeSuggestModal() {
  suggestOverlay.classList.remove('is-open');
  suggestModal.classList.remove('is-open');
}

suggestBtn.addEventListener('click', openSuggestModal);
suggestCloseBtn.addEventListener('click', closeSuggestModal);
suggestOverlay.addEventListener('click', closeSuggestModal);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && suggestModal.classList.contains('is-open')) closeSuggestModal();
});

pickLocationBtn.addEventListener('click', () => {
  closeSuggestModal();
  pickLocationBtn.classList.add('is-picking');
  pickLocationBtn.textContent = '🗺 Кликните по карте…';

  map.once('click', (e) => {
    const point = map.project(e.latlng, mapConfig.tileMaxZoom);
    document.getElementById('sX').value = Math.round(point.x);
    document.getElementById('sY').value = Math.round(point.y);

    pickLocationBtn.classList.remove('is-picking');
    pickLocationBtn.textContent = '🗺 Указать точку на карте';
    openSuggestModal();
  });
});

suggestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  suggestSubmitBtn.disabled = true;
  suggestStatus.hidden = true;

  const body = new URLSearchParams(new FormData(suggestForm)).toString();

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
    .then(() => {
      suggestStatus.textContent = 'Спасибо! Заявка отправлена на проверку.';
      suggestStatus.className = 'suggest-status is-success';
      suggestStatus.hidden = false;
      suggestForm.reset();
      setTimeout(closeSuggestModal, 1800);
    })
    .catch((err) => {
      console.error('Не удалось отправить форму:', err);
      suggestStatus.textContent = 'Не получилось отправить. Попробуйте ещё раз.';
      suggestStatus.className = 'suggest-status is-error';
      suggestStatus.hidden = false;
    })
    .finally(() => {
      suggestSubmitBtn.disabled = false;
    });
});
