/* =========================================================
   THE VICE MAP — app.js
   ========================================================= */

/* ---------------------------------------------------------
   1. КОНФИГ КАТЕГОРИЙ, РЕДКОСТИ И ТЭГОВ УСЛОВИЙ
--------------------------------------------------------- */
const CATEGORIES = {
  weapons:    { label: 'Оружие',            color: '#ff007f', icon: '<svg viewBox="0 0 512 512"><path d="M55.505 435.172h91.88v-16.518h-91.88zm265.317-173.437v-49.326l16.518-.795v66.639H218.618c2.158-5.162 4.316-11.356 6.442-16.518zM466.385 76.828l14.949 9.405h-14.949zm-387.136.114h15.486v9.291H79.249zm179.982 138.45c.207 9.374 2.468 21.442 10.592 32.458-9.952-2.065-22.712-14.03-30.61-22.444 1.353-3.407 2.602-6.504 3.697-9.219zm-134.558-63.088v-49.553h16.518v49.553zm66.071 0v-49.553h16.518v49.553zm-120.786 0v-49.553h38.198v49.553zm87.75 0v-49.553h16.519v49.553zM96.49 217.488c.413-12.389-14.608-33.335-30.899-33.335-20.977 0-11.593-8.104-1.331-15.33H486V187.9l-254.312 12.285c-4.976 11.625-22.712 56.976-36.39 92.149l4.779 10.324-9.477 1.858c-3.49 9.033-11.5 29.69-14.856 38.414l3.645 9.797-8.26 2.953c-12.388 32.313-17.55 46.456-17.55 46.456H53.44S26 393.216 26 385.216c-.124-43.99 69.292-131.74 70.49-167.728zM223.78 102.75H486v49.553H223.78z" fill="white"/></svg>' },
  vehicles:   { label: 'Транспорт',         color: '#00f0ff', icon: '<svg viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M469.71 234.6c-7.33-9.73-34.56-16.43-46.08-33.94s-20.95-55.43-50.27-70S288 112 256 112s-88 4-117.36 18.63s-38.75 52.52-50.27 70s-38.75 24.24-46.08 33.97S29.8 305.84 32.94 336s9 48 9 48h86c14.08 0 18.66-5.29 47.46-8c31.6-3 62.6-4 80.6-4s50 1 81.58 4c28.8 2.73 33.53 8 47.46 8h85s5.86-17.84 9-48s-2.04-91.67-9.33-101.4M400 384h56v16h-56zm-344 0h56v16H56z"/><path fill="currentColor" d="M364.47 309.16c-5.91-6.83-25.17-12.53-50.67-16.35S279 288 256.2 288s-33.17 1.64-57.61 4.81s-42.79 8.81-50.66 16.35C136.12 320.6 153.42 333.44 167 335c13.16 1.5 39.47.95 89.31.95s76.15.55 89.31-.95c13.56-1.65 29.62-13.6 18.85-25.84m67.1-66.11a3.23 3.23 0 0 0-3.1-3c-11.81-.42-23.8.42-45.07 6.69a93.9 93.9 0 0 0-30.08 15.06c-2.28 1.78-1.47 6.59 1.39 7.1a455 455 0 0 0 52.82 3.1c10.59 0 21.52-3 23.55-12.44a52.4 52.4 0 0 0 .49-16.51m-351.14 0a3.23 3.23 0 0 1 3.1-3c11.81-.42 23.8.42 45.07 6.69a93.9 93.9 0 0 1 30.08 15.06c2.28 1.78 1.47 6.59-1.39 7.1a455 455 0 0 1-52.82 3.1c-10.59 0-21.52-3-23.55-12.44a52.4 52.4 0 0 1-.49-16.51"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M432 192h16m-384 0h16m-2 19s46.35-12 178-12s178 12 178 12"/></svg>' },
  events:     { label: 'Случайные события', color: '#ffd400', icon: '<svg viewBox="0 0 24 24"><polygon points="13,2 5,14 11,14 9,22 19,10 13,10" fill="white"/></svg>' },
  eastereggs: { label: 'Пасхалки',          color: '#a259ff', icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="6" ry="8" fill="white"/></svg>' },
  underwater: { label: 'Подводный мир',     color: '#00b4d8', icon: '<svg viewBox="0 0 512 512"><g transform="translate(12.521728515625,-75.82608032226562)"><path d="M245 29v26h22V29h-22zM105 62.563v30.874l14-7V69.564l-14-7zm302 0-14 7v16.874l14 7V62.564zM137 69v18h90V69h-90zm148 0v18h90V69h-90zm-40 4v14h22V73h-22zm114 26.416v20.176c14.247 8.412 24.376 19.263 32.05 31.947 13.556 22.404 19.038 51.316 21.991 82.326 2.953 31.01 3.422 63.895 8.324 94.211 2.322 14.36 5.68 28.27 10.928 41.06 4.237-4.39 9.665-7.622 15.746-9.15-4.048-10.489-6.864-22.163-8.904-34.783-4.598-28.43-5.13-61.05-8.176-93.045-3.047-31.994-8.565-63.586-24.51-89.937-10.598-17.516-26-32.356-47.449-42.805zM128.922 105c-6.642 5.152-12.31 11.225-17.026 18-15.783 22.68-21.907 51.968-25.406 80.758-3.499 28.79-4.261 57.394-7.527 77.955-1.633 10.28-4.005 18.474-6.746 23.185-2.741 4.712-4.482 5.932-8.604 6.11-5.089.219-8.12-.96-10.912-3.225-2.792-2.266-5.358-6.06-7.369-11.437-4.021-10.754-5.363-27.23-4.809-43.99.772-23.314 4.797-46.823 7.2-59.143 3.026-.782 5.619-2.307 7.789-3.879 3.577-2.59 6.449-5.698 8.924-8.719 4.949-6.041 8.32-12.072 8.32-12.072l-15.674-8.85s-2.819 4.933-6.572 9.514c-1.877 2.29-3.984 4.411-5.555 5.549-.605.438-.917.555-1.203.681-.235-.193-.486-.373-.938-.937-1.192-1.491-2.645-4.064-3.832-6.742-2.373-5.356-3.763-10.803-3.763-10.803l-17.463 4.361s1.632 6.654 4.77 13.735c1.568 3.54 3.493 7.268 6.234 10.693a32.14 32.14 0 0 0 1.69 1.934c-2.456 12.196-7.052 37.955-7.917 64.082-.594 17.958.391 36.053 5.94 50.89 2.774 7.419 6.803 14.173 12.886 19.11 6.084 4.936 14.21 7.612 23.028 7.232 10.16-.437 18.631-6.864 23.388-15.04 4.757-8.178 7.17-18.114 8.965-29.415 3.59-22.601 4.258-50.96 7.617-78.607 3.36-27.648 9.525-54.272 22.315-72.649 6.733-9.674 15.051-17.384 26.328-22.318V105h-24.078zM171 105v30.818a104.29 104.29 0 0 1 13-.818c4.354 0 8.708.278 13 .818V105h-26zm144 0v30.818a104.29 104.29 0 0 1 13-.818c4.354 0 8.708.278 13 .818V105h-26zm-131 48c-27.5 0-55 13-55 39v23h110v-23c0-26-27.5-39-55-39zm144 0c-27.5 0-55 13-55 39v23h110v-23c0-26-27.5-39-55-39zm-199 80v30h254v-30H129zm0 48v62h110v-62H129zm144 0v62h110v-62H273zm-144 80v30h254v-30H129zm327 16c-8.39 0-15 6.61-15 15s6.61 15 15 15 15-6.61 15-15-6.61-15-15-15zm-327 32v78h110v-78H129zm144 0v78h110v-78H273z" fill="white"/></g></svg>' },
  activities: { label: 'Активности',        color: '#8bc34a', icon: '<svg viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M467.51 248.83c-18.4-83.18-45.69-136.24-89.43-149.17A91.5 91.5 0 0 0 352 96c-26.89 0-48.11 16-96 16s-69.15-16-96-16a99 99 0 0 0-27.2 3.66C89 112.59 61.94 165.7 43.33 248.83c-19 84.91-15.56 152 21.58 164.88c26 9 49.25-9.61 71.27-37c25-31.2 55.79-40.8 119.82-40.8s93.62 9.6 118.66 40.8c22 27.41 46.11 45.79 71.42 37.16c41.02-14.01 40.44-79.13 21.43-165.04Z"/><circle cx="292" cy="224" r="20" fill="currentColor"/><path fill="currentColor" d="M336 288a20 20 0 1 1 20-19.95A20 20 0 0 1 336 288"/><circle cx="336" cy="180" r="20" fill="currentColor"/><circle cx="380" cy="224" r="20" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M160 176v96m48-48h-96"/></svg>' },
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
  // hasOwnProperty, а не просто CONDITION_LABELS[tag]: иначе тег вроде
  // "constructor" вернул бы не строку, а встроенную функцию объекта.
  return Object.prototype.hasOwnProperty.call(CONDITION_LABELS, tag) ? CONDITION_LABELS[tag] : tag;
}

/* ---------------------------------------------------------
   Защита от вредоносных данных. С тех пор как форма заявок пишет прямо
   в базу, любой может записать туда произвольный текст (в обход самого
   сайта, через публичный API) — поэтому ВСЁ, что пришло из базы,
   экранируется перед подстановкой в HTML и проверяется при загрузке.
--------------------------------------------------------- */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Картинка допустима, только если это файл из папки img/ на самом сайте
// или из публичного хранилища нашего же проекта Supabase.
function isSafeImagePath(p) {
  return typeof p === 'string' && p.length <= 500 && !/[\s"'<>\\]/.test(p) &&
    (p.startsWith('img/') || p.startsWith(SUPABASE_URL + '/storage/v1/object/public/'));
}

// Админ вводит голое имя файла (shotgun.jpg) — добавляем img/. А полные
// ссылки (фото из заявок лежат в хранилище Supabase) оставляем как есть,
// иначе получилось бы сломанное img/https://...
function normalizeImagePath(name) {
  return /^https?:\/\//.test(name) ? name : 'img/' + name;
}

// Общий HTML чекбоксов условий — используется и формой новой точки, и формой
// редактирования. checkedTags — какие из них отметить галочкой заранее
// (пусто для новой точки, location.conditions при редактировании).
function buildConditionsHtml(checkedTags) {
  checkedTags = checkedTags || [];
  return Object.entries(CONDITION_LABELS).map(([val, label]) => `
    <label style="display:inline-flex; align-items:center; gap:4px; font-size:11px; margin:2px 8px 2px 0; color:#ccc;">
      <input type="checkbox" class="admCondition" value="${val}" ${checkedTags.includes(val) ? 'checked' : ''}> ${label}
    </label>
  `).join('');
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
  const cat = CATEGORIES[location.category];
  const color = cat.color;
  const isFound = foundIds.has(location.id);
  const rarity = location.rarity && RARITY[location.rarity] ? location.rarity : 'common';
  const isUnverified = location.verified === false;

  const classes = ['leo-marker'];
  if (isFound) classes.push('is-found');
  if (rarity !== 'common') classes.push(`rarity-${rarity}`);
  if (isUnverified) classes.push('is-unverified');

  // Маркер теперь в форме метки-«капли» (кружок + хвостик снизу, см. CSS
  // ::after) — точка карты должна указывать на КОНЧИК хвостика, а не в
  // центр кружка, как было раньше. Размеры круга и хвостика растут вместе
  // с редкостью точки (см. .rarity-rare/.rarity-unique в CSS), поэтому и
  // якорь считаем отдельно под каждый размер.
  const geometry = {
    common: { circle: 18, tail: 7 },
    rare:   { circle: 20, tail: 8 },
    unique: { circle: 24, tail: 9 },
  }[rarity];
  const totalHeight = geometry.circle + geometry.tail;

  return L.divIcon({
    className: '',
    html: `<div class="${classes.join(' ')}" style="--m-color:${color}"><span class="leo-marker-icon">${cat.icon}</span></div>`,
    iconSize: [geometry.circle, totalHeight],
    iconAnchor: [geometry.circle / 2, totalHeight], // низ хвостика = точная координата
    popupAnchor: [0, -totalHeight - 1], // попап открывается чуть выше кружка
  });
}

function buildPopupHtml(location) {
  const cat = CATEGORIES[location.category];
  const isFound = foundIds.has(location.id);
  const rarity = location.rarity && RARITY[location.rarity] ? location.rarity : 'common';

  const images = getImages(location);
  const safeId = escapeHtml(location.id);
  const imageHtml = images.length
    ? `<div class="leo-popup-img-wrap"><img src="${escapeHtml(images[0])}" alt="${escapeHtml(location.name)}" class="leo-popup-img" loading="lazy" onerror="this.closest('.leo-popup-img-wrap').style.display='none'"></div>`
    : '';

  const rarityHtml = rarity !== 'common'
    ? ` · <span class="leo-popup-rarity rarity-${rarity}">${RARITY[rarity].label}</span>`
    : '';

  const tagsHtml = (location.conditions && location.conditions.length)
    ? `<div class="leo-popup-tags">${location.conditions.map(c => `<span class="leo-popup-tag">${escapeHtml(conditionLabel(c))}</span>`).join('')}</div>`
    : '';

  const unverifiedHtml = location.verified === false
    ? `<div class="leo-popup-unverified">
         ⏳ Ожидает проверки — координаты могут быть неточными
         ${isAdminMode ? `<button class="leo-popup-approve-btn" data-loc-id="${safeId}">✔ Одобрить</button>` : ''}
       </div>`
    : '';

  return `
    <div class="leo-popup-inner" style="--pop-color:${cat.color}">
      <div class="leo-popup-band"></div>
      ${imageHtml}
      <div class="leo-popup-body">
        ${unverifiedHtml}
        <div class="leo-popup-category">${cat.icon} ${cat.label.toUpperCase()}${rarityHtml}</div>
        <h3 class="leo-popup-title">${escapeHtml(location.name)}</h3>
        ${tagsHtml}
        <p class="leo-popup-desc">${escapeHtml(location.description)}</p>
        <div class="leo-popup-actions">
          <button class="leo-popup-btn${isFound ? ' is-active' : ''}" data-loc-id="${safeId}">
            ${isFound ? '✔ Отмечено как найденное' : 'Отметить как найденное'}
          </button>
          <button class="leo-popup-share-btn" data-loc-id="${safeId}" title="Скопировать ссылку на находку" aria-label="Поделиться этой точкой">🔗</button>
        </div>
        ${isAdminMode ? `
          <div style="display:flex; gap:6px; margin-top:8px;">
            <button class="leo-popup-edit-btn" data-loc-id="${safeId}" style="flex:1;">✎ Редактировать</button>
            <button class="leo-popup-delete-btn" data-loc-id="${safeId}" style="flex:1; margin-top:0;">🗑 Удалить</button>
          </div>
        ` : ''}
      </div>
    </div>`;
}

// Создаёт и добавляет на карту ОДИН маркер для точки. Вынесено отдельно
// от renderMarkers(), чтобы можно было добавить единственную новую точку
// (после сохранения в базу через режим картографа) без пересоздания всех
// остальных маркеров — иначе получились бы задвоенные маркеры и задвоенные
// строки фильтров при повторном вызове renderMarkers()/renderFilters().
function addMarkerForLocation(loc) {
  const marker = L.marker(pointToLatLng(loc.x, loc.y), { icon: createIcon(loc) });
  marker.bindPopup(buildPopupHtml(loc), { className: 'leo-popup', closeButton: true });
  marker.addTo(layerGroups[loc.category]);
  marker._leoId = loc.id; // для deep-link (#loc-002) и обновления хэша при открытии попапа
  markerIndex[loc.id] = { marker, data: loc };
}

function renderMarkers() {
  locations.forEach((loc) => {
    try {
      addMarkerForLocation(loc);
    } catch (err) {
      console.error('Не удалось отрисовать точку', loc && loc.id, err);
    }
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

  const approveBtn = popupNode.querySelector('.leo-popup-approve-btn');
  if (approveBtn) {
    approveBtn.onclick = () => approveLocation(approveBtn.dataset.locId, approveBtn);
  }

  const editBtn = popupNode.querySelector('.leo-popup-edit-btn');
  if (editBtn) {
    editBtn.onclick = () => openEditForm(editBtn.dataset.locId);
  }

  // Удаление — с двухшаговым подтверждением прямо на кнопке, а не через
  // window.confirm(). Браузеры иногда молча блокируют системные диалоги
  // после нескольких подряд за сессию (с этим уже сталкивались в форме
  // картографа) — текст на самой кнопке от этого не зависит.
  const deleteBtn = popupNode.querySelector('.leo-popup-delete-btn');
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (deleteBtn.dataset.confirming === 'true') {
        deleteLocation(deleteBtn.dataset.locId, deleteBtn);
        return;
      }
      deleteBtn.dataset.confirming = 'true';
      deleteBtn.textContent = '❗ Точно удалить?';
      deleteBtn.classList.add('is-confirming');
      setTimeout(() => {
        // Если за 4 секунды не нажали второй раз — сбрасываем обратно,
        // чтобы случайный повторный тап спустя время не удалил точку.
        if (deleteBtn.dataset.confirming === 'true') {
          deleteBtn.dataset.confirming = 'false';
          deleteBtn.textContent = '🗑 Удалить точку';
          deleteBtn.classList.remove('is-confirming');
        }
      }, 4000);
    };
  }
}

// Открывает форму редактирования ПРЯМО в попапе уже существующего маркера —
// в отличие от openAdminEditor() (форма для НОВОЙ точки), тут не создаётся
// второй временный маркер, просто подменяется содержимое попапа. Координаты
// (x, y) в этой форме не редактируются — чтобы передвинуть точку, проще
// удалить и добавить заново через клик по нужному месту карты.
function openEditForm(id) {
  const entry = markerIndex[id];
  if (!entry) return;
  const loc = entry.data;

  const conditionsHtml = buildConditionsHtml(loc.conditions);
  // images хранятся как ["img/shotgun.jpg", ...] — полю нужны голые имена
  // файлов через запятую, без префикса img/ (он добавляется автоматически)
  const imagesValue = (loc.images || []).map((p) => p.replace(/^img\//, '')).join(', ');
  const rarityValue = loc.rarity && RARITY[loc.rarity] ? loc.rarity : 'common';

  const editHtml = `
    <div class="leo-popup-inner" style="--pop-color: #00f0ff;">
      <div class="leo-popup-band"></div>
      <div class="leo-popup-body" style="max-height: 70vh; overflow-y: auto;">
        <div class="leo-popup-category">РЕДАКТИРОВАНИЕ [X: ${loc.x}, Y: ${loc.y}]</div>

        <input id="admName" type="text" value="${escapeHtml(loc.name)}" placeholder="Название объекта"
          style="width:100%; margin:8px 0 6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">

        <select id="admCat" style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">
          <option value="weapons" ${loc.category === 'weapons' ? 'selected' : ''}>🔫 Оружие</option>
          <option value="vehicles" ${loc.category === 'vehicles' ? 'selected' : ''}>🚗 Транспорт</option>
          <option value="events" ${loc.category === 'events' ? 'selected' : ''}>⚡ Случайные события</option>
          <option value="eastereggs" ${loc.category === 'eastereggs' ? 'selected' : ''}>🥚 Пасхалки</option>
          <option value="underwater" ${loc.category === 'underwater' ? 'selected' : ''}>🤿 Подводный мир</option>
          <option value="activities" ${loc.category === 'activities' ? 'selected' : ''}>🎯 Активности</option>
        </select>

        <select id="admRarity" style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">
          <option value="common" ${rarityValue === 'common' ? 'selected' : ''}>Обычная</option>
          <option value="rare" ${rarityValue === 'rare' ? 'selected' : ''}>Редкая</option>
          <option value="unique" ${rarityValue === 'unique' ? 'selected' : ''}>Уникальная</option>
        </select>

        <div style="margin-bottom:6px;">${conditionsHtml}</div>

        <input id="admImg" type="text" value="${escapeHtml(imagesValue)}" placeholder="Картинки через запятую"
          style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:12px;">

        <textarea id="admDesc" placeholder="Описание..." rows="2"
          style="width:100%; margin-bottom:8px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:12px; resize:none;">${escapeHtml(loc.description)}</textarea>

        <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#ccc; margin-bottom:8px;">
          <input type="checkbox" id="admVerified" ${loc.verified !== false ? 'checked' : ''}> Проверено (видно всем на карте)
        </label>

        <div style="display:flex; gap:6px;">
          <button id="admEditSaveBtn" class="leo-popup-btn" style="flex:1; background:#00f0ff; color:#0f0f13;">
            💾 Сохранить изменения
          </button>
          <button id="admEditCancelBtn" class="leo-popup-btn" style="flex:1; background:transparent; border:1px solid #666; color:#999;">
            Отмена
          </button>
        </div>

        <p id="admEditStatus" style="margin:8px 0 0; font-size:12px; font-weight:700; min-height:16px;"></p>
      </div>
    </div>
  `;

  entry.marker.setPopupContent(editHtml);

  setTimeout(() => {
    // Та же логика, что и в openAdminEditor() — ищем поля ТОЛЬКО внутри
    // попапа ЭТОЙ конкретной точки, а не по всему документу, иначе при
    // одновременно открытой форме новой точки (те же ID полей) можно
    // случайно прочитать/записать чужие значения.
    const popupNode = entry.marker.getPopup() && entry.marker.getPopup().getElement();
    if (!popupNode) {
      console.error('Попап формы редактирования не найден в DOM');
      return;
    }

    const saveBtn = popupNode.querySelector('#admEditSaveBtn');
    const cancelBtn = popupNode.querySelector('#admEditCancelBtn');
    const statusEl = popupNode.querySelector('#admEditStatus');
    if (!saveBtn || !cancelBtn) {
      console.error('Кнопки формы редактирования не найдены в DOM');
      return;
    }

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#fff';
    }

    cancelBtn.onclick = () => {
      // Возвращаем попап к обычному виду точки, без сохранения изменений
      entry.marker.setPopupContent(buildPopupHtml(entry.data));
      const popupEl = entry.marker.getPopup() && entry.marker.getPopup().getElement();
      if (popupEl) bindPopupButton(popupEl);
    };

    saveBtn.onclick = () => {
      try {
        const name = popupNode.querySelector('#admName').value || 'Без названия';
        const category = popupNode.querySelector('#admCat').value;
        const rarity = popupNode.querySelector('#admRarity').value;
        const description = popupNode.querySelector('#admDesc').value || '';
        const verified = popupNode.querySelector('#admVerified').checked;
        const imgVal = popupNode.querySelector('#admImg').value.trim();
        const images = imgVal
          ? imgVal.split(',').map((s) => s.trim()).filter(Boolean).map(normalizeImagePath)
          : [];
        const conditions = Array.from(popupNode.querySelectorAll('.admCondition:checked')).map((cb) => cb.value);

        saveBtn.disabled = true;
        saveBtn.textContent = 'Сохраняю…';
        setStatus('Отправляю изменения…', '#00f0ff');

        db.from('locations')
          .update({ name, category, rarity, description, verified, images, conditions })
          .eq('loc_id', id)
          .then(({ error }) => {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Сохранить изменения';

            if (error) {
              setStatus('❌ Ошибка: ' + error.message, '#ff007f');
              return;
            }

            // Обновляем локальные данные и маркер/попап на лету. Если категория
            // поменялась — маркер нужно физически перенести в другую
            // слой-группу (layerGroups[категория]), иначе переключение
            // фильтров в сайдбаре будет работать для него неправильно —
            // setIcon() меняет только иконку, но не группу.
            const categoryChanged = entry.data.category !== category;
            Object.assign(entry.data, { name, category, rarity, description, verified, images, conditions });

            if (categoryChanged) {
              entry.marker.remove();
              entry.marker.addTo(layerGroups[category]);
            }
            entry.marker.setIcon(createIcon(entry.data));
            entry.marker.setPopupContent(buildPopupHtml(entry.data));
            const popupEl = entry.marker.getPopup() && entry.marker.getPopup().getElement();
            if (popupEl) bindPopupButton(popupEl);

            updateFilterCounts();
            updateProgress();
            applySearchFilter();
          })
          .catch((err) => {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Сохранить изменения';
            setStatus('❌ Ошибка сети: ' + err.message, '#ff007f');
          });
      } catch (err) {
        setStatus('❌ Ошибка в форме: ' + err.message, '#ff007f');
        console.error(err);
      }
    };
  }, 100);
}

// Удаляет точку из базы и сразу убирает её маркер с карты, без перезагрузки.
function deleteLocation(id, btnEl) {
  const entry = markerIndex[id];
  if (!entry) return;

  btnEl.disabled = true;
  btnEl.textContent = 'Удаляю…';

  db.from('locations').delete().eq('loc_id', id)
    .then(({ error }) => {
      if (error) {
        btnEl.disabled = false;
        btnEl.dataset.confirming = 'false';
        btnEl.classList.remove('is-confirming');
        btnEl.textContent = '❌ Не вышло, нажмите ещё раз';
        console.error('Не удалось удалить точку:', error);
        return;
      }

      // marker.remove() сам убирает маркер из того слоя, где он лежит
      // (layerGroups[категория]) — не нужно знать, в какой именно группе.
      entry.marker.remove();
      delete markerIndex[id];
      const idx = locations.findIndex((l) => l.id === id);
      if (idx !== -1) locations.splice(idx, 1);

      updateProgress();
      updateFilterCounts();
    })
    .catch((err) => {
      btnEl.disabled = false;
      btnEl.dataset.confirming = 'false';
      btnEl.classList.remove('is-confirming');
      btnEl.textContent = '❌ Не вышло, нажмите ещё раз';
      console.error('Ошибка сети при удалении:', err);
    });
}

// Меняет verified: false -> true прямо в базе, без пересоздания точки через
// режим картографа. Кнопка видна только вошедшему админу (см. isAdminMode
// в buildPopupHtml) — но и на уровне базы это разрешено только роли
// authenticated (RLS-политика UPDATE), так что случайный посетитель не
// сможет провернуть это даже через прямой запрос к API.
function approveLocation(id, btnEl) {
  const entry = markerIndex[id];
  if (!entry) return;

  btnEl.disabled = true;
  btnEl.textContent = 'Одобряю…';

  db.from('locations').update({ verified: true }).eq('loc_id', id)
    .then(({ error }) => {
      if (error) {
        btnEl.disabled = false;
        btnEl.textContent = '❌ Не вышло, нажмите ещё раз';
        console.error('Не удалось одобрить точку:', error);
        return;
      }

      // Обновляем локальные данные и перерисовываем маркер/попап — баннер
      // "ожидает проверки" и эта кнопка сами исчезнут, раз buildPopupHtml
      // не показывает их для verified: true.
      entry.data.verified = true;
      entry.marker.setIcon(createIcon(entry.data));
      entry.marker.setPopupContent(buildPopupHtml(entry.data));

      const popupEl = entry.marker.getPopup() && entry.marker.getPopup().getElement();
      if (popupEl) bindPopupButton(popupEl);

      updateProgress();
      updateFilterCounts();
      applySearchFilter(); // точка была скрыта, если тогл непроверенных был выключен — теперь должна стать видимой
    })
    .catch((err) => {
      btnEl.disabled = false;
      btnEl.textContent = '❌ Не вышло, нажмите ещё раз';
      console.error('Ошибка сети при одобрении:', err);
    });
}

// Делится прямой ссылкой на находку (map.html#loc-002). На мобильных с
// поддержкой Web Share API открывает системное меню «Поделиться»
// (Telegram/WhatsApp/Discord и т.д.), иначе копирует ссылку в буфер
// обмена и на секунду показывает галочку прямо на кнопке.
function shareLocation(id, btnEl) {
  const entry = markerIndex[id];
  if (!entry) return;

  const url = `${location.origin}${location.pathname}#${id}`;
  const title = `THE VICE MAP — ${entry.data.name}`;

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
      <span class="filter-name">${cfg.icon} ${cfg.label}</span>
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
  if (!row) return null;
  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  const id = String(row.loc_id == null ? '' : row.loc_id);
  const x = Number(row.x);
  const y = Number(row.y);

  // Строка с неизвестной категорией, странным id или без координат не должна
  // ломать загрузку остальных точек — просто пропускаем её.
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(id) || !has(CATEGORIES, row.category) ||
      !Number.isFinite(x) || !Number.isFinite(y)) {
    console.warn('Пропущена некорректная строка из базы:', row.loc_id);
    return null;
  }

  return {
    id,
    name: String(row.name == null ? '' : row.name).trim().slice(0, 120) || 'Без названия',
    category: row.category,
    x,
    y,
    description: String(row.description == null ? '' : row.description).slice(0, 2000),
    images: Array.isArray(row.images) ? row.images.filter(isSafeImagePath).slice(0, 5) : [],
    rarity: has(RARITY, row.rarity) ? row.rarity : null,
    conditions: Array.isArray(row.conditions)
      ? row.conditions.filter((c) => typeof c === 'string' && c.length <= 40).slice(0, 12)
      : [],
    verified: row.verified === false ? false : true,
  };
}

db.from('locations').select('loc_id,name,category,x,y,description,images,rarity,conditions,verified')
  .then(({ data, error }) => {
    if (error) throw error;
    locations = data.map(rowToLocation).filter(Boolean);
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
   Вход через Supabase Auth (email + пароль) — проверка идёт на сервере
   Supabase, а не в браузере, поэтому это настоящая защита (в отличие
   от кода-строки, зашитого в JS). Supabase сам запоминает сессию, так
   что повторно вводить пароль на каждой перезагрузке страницы не нужно.
--------------------------------------------------------- */
let isAdminMode = false;
let tempAdminMarker = null;

const adminPanel = document.getElementById('adminPanel');
const admGoX = document.getElementById('admGoX');
const admGoY = document.getElementById('admGoY');

function toggleAdminMode() {
  isAdminMode = !isAdminMode;
  // Панель показывается/прячется классом is-open — так же, как в CSS
  // (.admin-panel.is-open { display:block }), а не через [hidden].
  adminPanel.classList.toggle('is-open', isAdminMode);
}

// Общая точка входа в режим картографа — вызывается и по Ctrl+Shift+A
// (десктоп), и по 5 быстрым тапам на логотип (мобильные, где физически
// нет клавиш Ctrl/Shift).
function attemptAdminAccess() {
  // Выключить можно без повторного входа
  if (isAdminMode) {
    toggleAdminMode();
    return;
  }

  // Если сессия уже есть (входили раньше в этом браузере) — не спрашиваем
  // логин заново, Supabase сам её помнит между перезагрузками страницы.
  db.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      toggleAdminMode();
      return;
    }
    openLoginModal();
  });
}

/* ---------------------------------------------------------
   Форма входа картографа (модальное окно вместо prompt())
--------------------------------------------------------- */
const loginOverlay = document.getElementById('loginOverlay');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginStatus = document.getElementById('loginStatus');
const loginCloseBtn = document.getElementById('loginCloseBtn');

function showLoginStatus(text, isError) {
  loginStatus.textContent = text;
  loginStatus.className = 'suggest-status ' + (isError ? 'is-error' : 'is-success');
  loginStatus.hidden = false;
}

function openLoginModal() {
  loginStatus.hidden = true;
  loginOverlay.classList.add('is-open');
  loginModal.classList.add('is-open');
  if (window.innerWidth <= 860) setSidebarOpen(false);
  setTimeout(() => loginEmail.focus(), 50);
}

function closeLoginModal() {
  loginOverlay.classList.remove('is-open');
  loginModal.classList.remove('is-open');
  // Пароль из поля убираем с небольшой задержкой — чтобы браузер успел
  // предложить сохранить его в менеджере паролей.
  setTimeout(() => { loginPassword.value = ''; }, 800);
}

loginCloseBtn.addEventListener('click', closeLoginModal);
loginOverlay.addEventListener('click', closeLoginModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loginModal.classList.contains('is-open')) closeLoginModal();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginSubmitBtn.disabled = true;
  showLoginStatus('Входим…', false);

  try {
    const { error } = await db.auth.signInWithPassword({
      email: loginEmail.value.trim(),
      password: loginPassword.value,
    });

    if (error) {
      // Самую частую ошибку переводим, остальные показываем как есть
      const text = error.message === 'Invalid login credentials'
        ? 'Неверный email или пароль.'
        : 'Не удалось войти: ' + error.message;
      showLoginStatus('❌ ' + text, true);
      return;
    }

    closeLoginModal();
    if (!isAdminMode) toggleAdminMode();
  } catch (err) {
    console.error('Ошибка сети при входе:', err);
    showLoginStatus('❌ Ошибка сети. Попробуйте ещё раз.', true);
  } finally {
    loginSubmitBtn.disabled = false;
  }
});

// Триггер для десктопа — Ctrl+Shift+A
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') attemptAdminAccess();
});

// Триггер для мобильных — 5 быстрых тапов по логотипу подряд (в течение
// 3 секунд). На телефоне физически нет клавиш Ctrl/Shift, поэтому без
// этого войти в режим картографа с мобильного было бы невозможно.
let logoTapCount = 0;
let logoTapTimer = null;
const brandTitleEl = document.querySelector('.brand-title');
if (brandTitleEl) {
  brandTitleEl.addEventListener('click', () => {
    logoTapCount += 1;
    clearTimeout(logoTapTimer);
    logoTapTimer = setTimeout(() => { logoTapCount = 0; }, 3000);
    if (logoTapCount >= 5) {
      logoTapCount = 0;
      attemptAdminAccess();
    }
  });
}

// Общий редактор точки: строит попап-форму (название/категория/редкость/
// условия/картинки/статус) в указанных координатах. Используется и при
// клике по карте, и при вводе X/Y вручную в панели картографа — так
// оба способа добавления точки остаются полностью одинаковыми по функциям.
function openAdminEditor(x, y, latlng) {
  if (tempAdminMarker) map.removeLayer(tempAdminMarker);
  tempAdminMarker = L.marker(latlng).addTo(map);

  const conditionsHtml = buildConditionsHtml();

  const popupHtml = `
    <div class="leo-popup-inner" style="--pop-color: #00f0ff;">
      <div class="leo-popup-band"></div>
      <div class="leo-popup-body" style="max-height: 70vh; overflow-y: auto;">
        <div class="leo-popup-category">НОВАЯ ТОЧКА [X: ${x}, Y: ${y}]</div>

        <input id="admName" type="text" placeholder="Название объекта"
          style="width:100%; margin:8px 0 6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">

        <select id="admCat" style="width:100%; margin-bottom:6px; padding:6px; background:#14141d; border:1px solid #333; color:#fff; border-radius:4px; font-size:13px;">
          <option value="weapons">🔫 Оружие</option>
          <option value="vehicles">🚗 Транспорт</option>
          <option value="events">⚡ Случайные события</option>
          <option value="eastereggs">🥚 Пасхалки</option>
          <option value="underwater">🤿 Подводный мир</option>
          <option value="activities">🎯 Активности</option>
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

        <div style="display:flex; gap:6px;">
          <button id="admSaveBtn" class="leo-popup-btn" style="flex:1; background:#00f0ff; color:#0f0f13;">
            💾 Сохранить в базу
          </button>
          <button id="admCopyBtn" class="leo-popup-btn" style="flex:1; background:transparent; border:1px solid #00f0ff; color:#00f0ff;">
            📋 JSON
          </button>
        </div>

        <p id="admStatus" style="margin:8px 0 0; font-size:12px; font-weight:700; min-height:16px;"></p>
      </div>
    </div>
  `;

  tempAdminMarker.bindPopup(popupHtml, { className: 'leo-popup admin-popup' }).openPopup();

  setTimeout(() => {
    // Ищем поля ТОЛЬКО внутри попапа ЭТОЙ формы, а не по всему документу.
    // Форма редактирования (openEditForm) использует те же ID полей
    // (#admName и т.д.) — если одновременно в DOM окажутся обе формы
    // (например, админ не закрыл форму новой точки и открыл редактирование
    // другой точки), document.getElementById() вернул бы поле из ЧУЖОЙ
    // формы, а не этой. Scoped-запрос внутри popupNode решает это надёжно.
    const popupNode = tempAdminMarker.getPopup() && tempAdminMarker.getPopup().getElement();
    if (!popupNode) {
      console.error('Попап формы картографа не найден в DOM');
      return;
    }

    // Читает значения полей формы — общее для обеих кнопок (сохранить в базу
    // и скопировать JSON), чтобы не дублировать одно и то же дважды.
    function collectAdminFormValues() {
      const name = popupNode.querySelector('#admName').value || 'Без названия';
      const category = popupNode.querySelector('#admCat').value;
      const rarity = popupNode.querySelector('#admRarity').value;
      const description = popupNode.querySelector('#admDesc').value || '';
      const verified = popupNode.querySelector('#admVerified').checked;

      const imgVal = popupNode.querySelector('#admImg').value.trim();
      const images = imgVal
        ? imgVal.split(',').map(s => s.trim()).filter(Boolean).map(normalizeImagePath)
        : [];

      const conditions = Array.from(popupNode.querySelectorAll('.admCondition:checked')).map(cb => cb.value);

      return { name, category, rarity, description, verified, images, conditions };
    }

    const saveBtn = popupNode.querySelector('#admSaveBtn');
    const copyBtn = popupNode.querySelector('#admCopyBtn');
    const statusEl = popupNode.querySelector('#admStatus');

    // Статус выводится текстом прямо в форме, а не через alert() — мобильные
    // браузеры после нескольких подряд идущих alert() иногда молча
    // блокируют вообще все следующие диалоги на странице (галочка
    // "больше не показывать"), и тогда даже сообщения об ошибках
    // становятся не видны. Текст в форме такому не подвержен.
    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#fff';
    }

    // Если кнопки вообще не нашлись в DOM — сообщаем явно вместо тишины.
    // Это может значить, что попап ещё не успел отрисоваться за 100мс.
    if (!saveBtn || !copyBtn) {
      console.error('Кнопки формы картографа не найдены в DOM:', { saveBtn, copyBtn });
      return;
    }

    saveBtn.onclick = () => {
      try {
        const values = collectAdminFormValues();
        const id = 'loc-' + String(Date.now()).slice(-4);

        saveBtn.disabled = true;
        saveBtn.textContent = 'Сохраняю…';
        setStatus('Отправляю в базу…', '#00f0ff');

        db.from('locations').insert([{ loc_id: id, x, y, ...values }]).then(({ error }) => {
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Сохранить в базу';

          if (error) {
            setStatus('❌ Ошибка: ' + error.message, '#ff007f');
            return;
          }

          // Точка сразу появляется на карте — без перезагрузки страницы
          const newLocation = rowToLocation({ loc_id: id, x, y, ...values });
          if (!newLocation) {
            // Точка записана в базу, но не прошла проверку формата —
            // на карте появится после перезагрузки страницы (если вообще
            // пройдёт проверку), без падения кода сейчас.
            setStatus('✔ Сохранено в базу. Обновите страницу, чтобы увидеть точку.', '#00f0ff');
            return;
          }
          locations.push(newLocation);
          addMarkerForLocation(newLocation);
          updateFilterCounts();
          updateProgress();

          setStatus('✔ Сохранено и добавлено на карту!', '#00f0ff');
          map.removeLayer(tempAdminMarker);
          tempAdminMarker = null;
        }).catch(err => {
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Сохранить в базу';
          setStatus('❌ Ошибка сети: ' + err.message, '#ff007f');
        });
      } catch (err) {
        setStatus('❌ Ошибка в форме: ' + err.message, '#ff007f');
        console.error(err);
      }
    };

    copyBtn.onclick = () => {
      try {
        const values = collectAdminFormValues();
        const id = 'loc-' + String(Date.now()).slice(-4);
        const jsonObject = { id, x, y, ...values };
        const jsonString = JSON.stringify(jsonObject, null, 2);

        navigator.clipboard.writeText(jsonString).then(() => {
          setStatus('✔ JSON скопирован в буфер обмена', '#00f0ff');
        }).catch(() => {
          setStatus('❌ Не удалось скопировать — см. консоль', '#ff007f');
          console.log(jsonString);
        });
      } catch (err) {
        setStatus('❌ Ошибка в форме: ' + err.message, '#ff007f');
        console.error(err);
      }
    };
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
const sPhoto = document.getElementById('sPhoto');
const sPhotoPreview = document.getElementById('sPhotoPreview');

// Сжимает фото прямо в браузере перед загрузкой — телефонные камеры обычно
// снимают в 3-10 МБ, а для миниатюры в попапе достаточно намного меньше.
// Уменьшаем до максимум 1280px по широкой стороне и пережимаем в JPEG.
function compressImage(file, maxWidth = 1280, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Не удалось сжать изображение'));
      }, 'image/jpeg', quality);
    };
    img.onerror = () => reject(new Error('Файл повреждён или это не изображение'));
    reader.readAsDataURL(file);
  });
}

// Превью выбранного фото прямо в форме — просто уверенность, что выбрали то,
// что нужно, до отправки.
sPhoto.addEventListener('change', () => {
  const file = sPhoto.files[0];
  if (!file) {
    sPhotoPreview.hidden = true;
    return;
  }
  const url = URL.createObjectURL(file);
  sPhotoPreview.innerHTML = `<img src="${url}" alt=""> ${escapeHtml(file.name)}`;
  sPhotoPreview.hidden = false;
});

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

suggestForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Собственная honeypot-проверка (раньше это делал Netlify Forms
  // автоматически — теперь пишем напрямую в Supabase, значит и спам-фильтр
  // свой). Боты обычно заполняют все поля подряд, включая скрытые —
  // обычный человек это поле физически не видит и не трогает.
  const botField = suggestForm.querySelector('[name="bot-field"]').value;
  if (botField) {
    // Бот не должен понять, что его поймали — просто "успешно" закрываем форму
    suggestStatus.textContent = 'Спасибо! Заявка отправлена на проверку.';
    suggestStatus.className = 'suggest-status is-success';
    suggestStatus.hidden = false;
    suggestForm.reset();
    setTimeout(closeSuggestModal, 1800);
    return;
  }

  suggestSubmitBtn.disabled = true;
  suggestStatus.hidden = true;

  const name = document.getElementById('sName').value.trim();
  const category = document.getElementById('sCategory').value;
  const description = document.getElementById('sDescription').value.trim();
  const rarity = document.getElementById('sRarity').value || null; // "" -> null, если не выбрали
  const x = parseInt(document.getElementById('sX').value, 10);
  const y = parseInt(document.getElementById('sY').value, 10);
  const contact = document.getElementById('sContact').value.trim() || null;
  const photoFile = sPhoto.files[0] || null;

  if (Number.isNaN(x) || Number.isNaN(y)) {
    suggestSubmitBtn.disabled = false;
    suggestStatus.textContent = '❌ Сначала укажите точку на карте.';
    suggestStatus.className = 'suggest-status is-error';
    suggestStatus.hidden = false;
    return;
  }

  const locId = 'loc-' + String(Date.now()).slice(-4);
  const images = [];

  // Если приложили фото — сжимаем и загружаем в Storage (bucket "submissions")
  // ДО записи точки, чтобы сразу получить публичную ссылку и вставить её
  // в images. Если это упадёт — не отправляем заявку молча без фото,
  // а честно сообщаем и даём попробовать ещё раз.
  if (photoFile) {
    suggestStatus.textContent = 'Сжимаю и загружаю фото…';
    suggestStatus.className = 'suggest-status is-success';
    suggestStatus.hidden = false;

    try {
      const compressed = await compressImage(photoFile);
      const filePath = `${locId}-${Date.now()}.jpg`;

      const { error: uploadError } = await db.storage
        .from('submissions')
        .upload(filePath, compressed, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: urlData } = db.storage.from('submissions').getPublicUrl(filePath);
      images.push(urlData.publicUrl);
    } catch (err) {
      suggestSubmitBtn.disabled = false;
      console.error('Не удалось загрузить фото:', err);
      suggestStatus.textContent = '❌ Не удалось загрузить фото. Попробуйте другое или отправьте без фото.';
      suggestStatus.className = 'suggest-status is-error';
      suggestStatus.hidden = false;
      return;
    }
  }

  suggestStatus.textContent = 'Отправляю заявку…';

  // verified: false — заявка сразу попадает в общую очередь модерации
  // (ту же, что видит режим картографа через тогл "Показывать
  // неподтверждённые"), а не в отдельную панель Netlify Forms.
  db.from('locations').insert([{
    loc_id: locId, name, category, description, rarity, x, y, contact,
    images, conditions: [], verified: false,
  }])
    .then(({ error }) => {
      suggestSubmitBtn.disabled = false;

      if (error) {
        console.error('Не удалось отправить заявку:', error);
        suggestStatus.textContent = '❌ Не получилось отправить. Попробуйте ещё раз.';
        suggestStatus.className = 'suggest-status is-error';
        suggestStatus.hidden = false;
        return;
      }

      suggestStatus.textContent = 'Спасибо! Заявка отправлена на проверку.';
      suggestStatus.className = 'suggest-status is-success';
      suggestStatus.hidden = false;
      sPhotoPreview.hidden = true;
      suggestForm.reset();
      setTimeout(closeSuggestModal, 1800);
    })
    .catch((err) => {
      suggestSubmitBtn.disabled = false;
      console.error('Ошибка сети при отправке заявки:', err);
      suggestStatus.textContent = '❌ Не получилось отправить. Попробуйте ещё раз.';
      suggestStatus.className = 'suggest-status is-error';
      suggestStatus.hidden = false;
    });
});
