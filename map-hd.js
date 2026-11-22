/* =============================
   HD-подложка карты (5862×8192 — сетка координат НЕ меняется)
   Подключается после app.js. Если что-то пойдёт не так, карта
   просто останется на прежней подложке.
   ============================= */
(function () {
  try {
    // Детали подложки заканчиваются примерно на зуме 4–4.5.
    // Опорный зум координат (mapConfig.tileMaxZoom = 5) не трогаем —
    // сохранённые X/Y считаются через него и остаются на месте.
    map.options.zoomSnap = 0.5;
    map.setMaxZoom(4.5);

    var img = document.querySelector('#map .leaflet-image-layer');
    if (img) img.src = 'assets/leonida-map-hd.webp';
  } catch (e) {
    if (window.console) console.warn('map-hd.js:', e);
  }
})();
