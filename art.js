/* art.js - nhân vật "Bi" (linh vật của app, vẽ bằng SVG, hình gốc), tranh minh hoạ và hiệu ứng ăn mừng. */
(function () {
  var N = 0;
  // MS(mood, px): mood = 'happy' | 'cheer' | 'think' | 'wink'
  window.MS = function (mood, px) {
    var id = 'mg' + (++N), m = mood || 'happy', s = px || 96;
    var mouth = m === 'cheer'
      ? '<path d="M50 62 Q60 82 70 62 Z" fill="#12332b"/><path d="M54 72 Q60 78 66 72 Q60 68 54 72Z" fill="#ff8f86"/>'
      : m === 'think'
        ? '<path d="M54 68 H65" stroke="#12332b" stroke-width="3.5" stroke-linecap="round"/>'
        : '<path d="M50 63 Q60 75 70 63" stroke="#12332b" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
    var eyes = m === 'wink'
      ? '<ellipse cx="48" cy="52" rx="5.5" ry="7" fill="#12332b"/><circle cx="50" cy="49" r="2" fill="#fff"/><path d="M67 53 Q72 47 77 53" stroke="#12332b" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
      : '<ellipse cx="48" cy="52" rx="5.5" ry="7" fill="#12332b"/><ellipse cx="72" cy="52" rx="5.5" ry="7" fill="#12332b"/><circle cx="50" cy="49" r="2" fill="#fff"/><circle cx="74" cy="49" r="2" fill="#fff"/>';
    var brow = m === 'think' ? '<path d="M64 40 L79 42" stroke="#12332b" stroke-width="3" stroke-linecap="round"/>' : '';
    var arms = m === 'cheer'
      ? '<path d="M24 62 Q6 54 8 34" stroke="#14906f" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M96 62 Q114 54 112 34" stroke="#14906f" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M110 12 l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5Z" fill="#f5a623"/><path d="M8 14 l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f5a623"/>'
      : '';
    return '<svg class="mascot" viewBox="0 0 120 120" width="' + s + '" height="' + s + '" role="img" aria-label="Nhân vật Bi">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ed3ac"/><stop offset="1" stop-color="#139170"/></linearGradient></defs>' +
      '<ellipse cx="60" cy="113" rx="30" ry="4.5" fill="rgba(0,0,0,.13)"/>' + arms +
      '<path d="M22 30Q22 12 42 12H78Q98 12 98 30V74Q98 92 78 92H60L38 108L42 92H42Q22 92 22 74Z" fill="url(#' + id + ')"/>' +
      '<ellipse cx="60" cy="57" rx="33" ry="27" fill="#effbf7"/>' + eyes + brow +
      '<circle cx="37" cy="65" r="5" fill="#ffb3a7" opacity=".85"/><circle cx="83" cy="65" r="5" fill="#ffb3a7" opacity=".85"/>' + mouth +
      '<path d="M42 21V31Q60 40 78 31V21" fill="#2d4a42"/><polygon points="60,3 98,16 60,29 22,16" fill="#1b2f29"/>' +
      '<path d="M98 16V34" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/><circle cx="98" cy="37" r="4.5" fill="#f5a623"/></svg>';
  };
  // Bóng nói của Bi
  window.BUBBLE = function (txt) { return '<div class="bubble">' + txt + '</div>'; };
  // Pháo giấy cho màn hoàn thành
  window.CONFETTI = function () {
    var c = ['#f5a623', '#e5484d', '#3e8ef7', '#8e5ce6', '#2fb98f'], h = '<div class="confetti" aria-hidden="true">';
    for (var i = 0; i < 26; i++) {
      h += '<i style="left:' + ((i * 37 + 11) % 100) + '%;background:' + c[i % c.length] + ';animation-delay:' + ((i % 9) * 0.12).toFixed(2) + 's;transform:rotate(' + (i * 29 % 180) + 'deg)"></i>';
    }
    return h + '</div>';
  };
  // Vòng tiến độ (0..1)
  window.RING = function (p, label) {
    var r = 26, c = 2 * Math.PI * r, d = Math.max(0, Math.min(1, p)) * c;
    return '<svg class="ring" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="7"/>' +
      '<circle cx="32" cy="32" r="' + r + '" fill="none" stroke="var(--pri)" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + d.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 32 32)"/>' +
      '<text x="32" y="37" text-anchor="middle" font-size="15" font-weight="800" fill="var(--ink)">' + (label || '') + '</text></svg>';
  };
})();
