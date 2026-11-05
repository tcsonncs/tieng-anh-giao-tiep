/* art.js - nhân vật "Bi" (quả cầu phát sáng, vẽ bằng SVG, hình gốc), vòng tiến độ, pháo giấy. */
(function () {
  var N = 0;
  // MS(mood, px): mood = 'happy' | 'cheer' | 'think' | 'wink'
  window.MS = function (mood, px) {
    var id = 'mg' + (++N), m = mood || 'happy', s = px || 96;
    var mouth = m === 'cheer'
      ? '<path d="M56 78 Q70 98 84 78 Z" fill="#14123a"/><path d="M62 90 Q70 96 78 90 Q70 85 62 90Z" fill="#ff8fb0"/>'
      : m === 'think'
        ? '<path d="M62 84 H78" stroke="#14123a" stroke-width="4" stroke-linecap="round"/>'
        : '<path d="M58 80 Q70 92 82 80" stroke="#14123a" stroke-width="4.2" fill="none" stroke-linecap="round"/>';
    var eyes = m === 'wink'
      ? '<ellipse cx="54" cy="62" rx="6.5" ry="8" fill="#14123a"/><circle cx="56.5" cy="58.5" r="2.4" fill="#fff"/><path d="M78 63 Q85 55 92 63" stroke="#14123a" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<ellipse cx="54" cy="62" rx="6.5" ry="8" fill="#14123a"/><ellipse cx="86" cy="62" rx="6.5" ry="8" fill="#14123a"/><circle cx="56.5" cy="58.5" r="2.4" fill="#fff"/><circle cx="88.5" cy="58.5" r="2.4" fill="#fff"/>';
    var brow = m === 'think' ? '<path d="M78 46 L95 49" stroke="#14123a" stroke-width="3.4" stroke-linecap="round"/>' : '';
    var spark = m === 'cheer'
      ? '<path d="M128 24 l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#ffd36b"/><path d="M12 30 l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4Z" fill="#8fe9ff"/>'
      : '';
    return '<svg class="mascot" viewBox="0 0 140 140" width="' + s + '" height="' + s + '" role="img" aria-label="Nhân vật Bi">' +
      '<defs>' +
      '<radialGradient id="' + id + 'b" cx=".35" cy=".28" r=".9"><stop offset="0" style="stop-color:var(--o1,#7ff0d8)"/><stop offset=".45" style="stop-color:var(--o2,#3c8dff)"/><stop offset="1" style="stop-color:var(--o3,#7a45e6)"/></radialGradient>' +
      '<radialGradient id="' + id + 'g" cx=".5" cy=".5" r=".5"><stop offset=".6" style="stop-color:var(--og,#5aa8ff)" stop-opacity=".45"/><stop offset="1" style="stop-color:var(--og,#5aa8ff)" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<circle cx="70" cy="70" r="68" fill="url(#' + id + 'g)"/>' +
      '<circle cx="70" cy="72" r="46" fill="url(#' + id + 'b)"/>' +
      '<path d="M32 78 Q38 66 52 70 Q56 82 44 90 Q34 90 32 78Z" fill="#7ff0d8" opacity=".55"/>' +
      '<path d="M92 94 L108 80 M108 80 L112 66" stroke="#9fe8ff" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="112" cy="64" r="4" fill="#9fe8ff" opacity=".9"/>' +
      '<path d="M96 104 Q70 118 46 104 Q60 118 96 104Z" fill="#a37bff" opacity=".6"/>' +
      '<ellipse cx="48" cy="44" rx="16" ry="8" fill="#fff" opacity=".38" transform="rotate(-32 48 44)"/>' +
      eyes + brow + mouth + spark + '</svg>';
  };
  // Bóng nói của Bi
  window.BUBBLE = function (txt) { return '<div class="bubble">' + txt + '</div>'; };
  // Sao lấp lánh trang trí
  window.STARS = function () {
    return '<span class="stars" aria-hidden="true"><i style="left:8%;top:18%"></i><i style="left:88%;top:10%;width:14px;height:14px"></i><i style="left:80%;top:62%;width:8px;height:8px"></i><i style="left:14%;top:70%;width:9px;height:9px"></i></span>';
  };
  // Pháo giấy cho màn hoàn thành
  window.CONFETTI = function () {
    var c = ['#ffd36b', '#ff8fb0', '#5aa8ff', '#a37bff', '#5fe3c4'], h = '<div class="confetti" aria-hidden="true">';
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
