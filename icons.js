/* icons.js - bộ biểu tượng nét đường (SVG), tô theo màu chữ hiện tại. IC('tên') trả về chuỗi SVG. */
(function () {
  var P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    cards: '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>',
    math: '<path d="M5 6h6M8 3v6"/><path d="M13.5 7.5h6"/><path d="M5.5 16.5h6"/><path d="m14 14.5 5 5M19 14.5l-5 5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4.5" height="6.5" rx="2"/><rect x="16" y="14" width="4.5" height="6.5" rx="2"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/>',
    roles: '<path d="M4 5.5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3.5v-3.5H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" transform="translate(1.5 -0.5)"/><path d="M8 9.5h6M8 12.5h3.5" transform="translate(1.5 -0.5)"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.8 7.5 8.2 6 8.2-6"/>',
    volume: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    turtle: '<circle cx="12" cy="12.5" r="8"/><path d="M12 8v4.8l3 2"/><path d="M9.5 3h5"/>',
    bolt: '<path d="M13 3 5 13.5h6l-1 7.5 8-10.5h-6l1-7.5Z"/>',
    play: '<path d="M8 5.5v13l11-6.5-11-6.5Z"/>',
    copy: '<rect x="8.5" y="8.5" width="11.5" height="12" rx="2.2"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/>',
    edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m13.5 8 3 3"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    cross: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
    spark: '<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4-5.7-1.8L10.2 9 12 3.5Z"/>',
    flame: '<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.4-2.4-5.2-3.4-8.3-2.4 1.1-3.4 3.2-3.5 5-1.1-.6-1.8-1.7-1.9-3.2C7.3 9.8 5.5 12 5.5 14.8 5.5 18.4 8.1 21 12 21Z"/>'
  };
  window.IC = function (n, cls) {
    return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" width="1.25em" height="1.25em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[n] || '') + '</svg>';
  };
})();
