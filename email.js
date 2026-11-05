/* Email mẫu (giai đoạn 4, đợt B): mỗi [nhãn] là một ô điền, bản xem trước cập nhật ngay, bấm Sao chép.
   File này chỉ chứa: làm sạch dữ liệu, ghép chữ, dựng HTML, và hàm sao chép vào clipboard.
   Chữ Thầy gõ KHÔNG được lưu ở đâu cả (nằm trong biến tạm của app.js, mất khi rời màn). Không mailto:, không gửi gì lên mạng.
   Nạp trước app.js. */
(function () {
'use strict';
var ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
var LAB_RE = /\[([^\[\]]{1,40})\]/g;
var MAXDOAN = 12, MAXLAB = 16, MAXVAL = 200;
function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
function str(x, n) { return typeof x === 'string' ? x.slice(0, n || 600) : ''; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
var EM = {};
EM.MAXVAL = MAXVAL;

function labelsOf(texts) {
  var out = [];
  texts.forEach(function (t) {
    String(t).replace(LAB_RE, function (m, l) { l = l.trim(); if (l && out.indexOf(l) < 0 && out.length < MAXLAB) out.push(l); return m; });
  });
  return out;
}
// Làm sạch dữ liệu: mẫu hỏng bị bỏ; nhãn lấy từ tiêu đề và các đoạn tiếng Anh theo thứ tự xuất hiện.
EM.list = function (data, showUnrev) {
  if (!Array.isArray(data)) return [];
  var out = [];
  data.forEach(function (x) {
    if (!isObj(x) || !ID_RE.test(String(x.id)) || String(x.id) === '__proto__' || !Array.isArray(x.doan)) return;
    if (!showUnrev && x.duyet === 'chua') return;
    var tieude = str(x.tieude, 200);
    var doan = x.doan.slice(0, MAXDOAN).filter(function (d) { return isObj(d) && typeof d.en === 'string' && d.en.trim(); })
      .map(function (d) { return { en: str(d.en), vi: str(d.vi) }; });
    if (!tieude.trim() || !doan.length) return;
    var cum = (Array.isArray(x.cum) ? x.cum : []).slice(0, 3).filter(function (c) { return isObj(c) && typeof c.en === 'string' && c.en.trim(); })
      .map(function (c) { return { en: str(c.en, 200), vi: str(c.vi, 200) }; });
    out.push({ id: String(x.id), loai: str(x.loai, 80) || 'Khác', ten: str(x.ten, 120) || String(x.id), boicanh: str(x.boicanh), duyet: x.duyet,
      tieude: tieude, tieudevi: str(x.tieudevi, 200), doan: doan, cum: cum,
      labels: labelsOf([tieude].concat(doan.map(function (d) { return d.en; }))) });
  });
  return out;
};
function val(vals, l) { var v = vals && vals['k:' + l]; return typeof v === 'string' ? v.trim() : ''; }
EM.empties = function (item, vals) { return item.labels.filter(function (l) { return !val(vals, l); }).length; };
// Thay [nhãn] bằng chữ Thầy gõ; chưa gõ thì giữ nguyên [nhãn]. mark=true: dựng HTML, chỗ còn trống tô vàng.
function fill(text, vals, mark) {
  var res = '', last = 0, m, re = new RegExp(LAB_RE.source, 'g');
  text = String(text);
  while ((m = re.exec(text))) {
    var l = m[1].trim(), v = val(vals, l);
    res += (mark ? esc(text.slice(last, m.index)) : text.slice(last, m.index));
    res += v ? (mark ? esc(v) : v) : (mark ? '<mark>[' + esc(l) + ']</mark>' : m[0]);
    last = m.index + m[0].length;
  }
  return res + (mark ? esc(text.slice(last)) : text.slice(last));
}
EM.fill = fill;
// Nội dung sao chép: dòng "Subject: …", dòng trống, các đoạn cách nhau bằng dòng trống.
EM.text = function (item, vals) {
  return 'Subject: ' + fill(item.tieude, vals, false) + '\n\n' + item.doan.map(function (d) { return fill(d.en, vals, false); }).join('\n\n');
};
EM.previewHTML = function (item, vals) {
  return '<div><b>Subject:</b> ' + fill(item.tieude, vals, true) + '</div><div style="margin-top:10px">' +
    item.doan.map(function (d) { return fill(d.en, vals, true); }).join('\n\n') + '</div>';
};
EM.noteHTML = function (item, vals) {
  var n = EM.empties(item, vals);
  return n ? 'Còn ' + n + ' chỗ trống (tô vàng). Điền xong rồi bấm Sao chép.' : 'Đã điền hết các chỗ trống.';
};

EM.menu = function (list, H) {
  var h = '<h1>Email mẫu</h1><p class="th">Chọn một mẫu, điền vào các ô, rồi bấm Sao chép để dán sang Mail hoặc Zalo. Chữ điền vào các ô nên viết bằng tiếng Anh (vì chen vào email tiếng Anh), ví dụ ngày: Monday. Dòng “Subject:” ở đầu là tiêu đề, Thầy chuyển sang ô Tiêu đề của Mail. App không gửi gì và không lưu chữ Thầy gõ, nên mỗi lần mở mẫu phải điền lại.</p>';
  if (!list.length) h += '<div class="warn">Chưa có mẫu nào. Bật “Hiện cả nội dung chưa duyệt” trong Cài đặt.</div>';
  var groups = [];
  list.forEach(function (x) { if (groups.indexOf(x.loai) < 0) groups.push(x.loai); });
  groups.forEach(function (g) {
    h += '<h2>' + esc(g) + '</h2><div class="list">' + list.filter(function (x) { return x.loai === g; }).map(function (x) {
      return '<button class="item" data-act="emopen" data-id="' + esc(x.id) + '">' + esc(x.ten) + (x.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') +
        '<small>' + esc(x.boicanh) + ' · ' + x.labels.length + ' ô điền</small></button>';
    }).join('') + '</div>';
  });
  h += '<p class="th">Đã sao chép: ' + H.n.em + ' lần.</p>';
  if (!H.canSpeak) h += '<div class="warn">Trình duyệt này không đọc được tiếng Anh nên không nghe được các cụm hay dùng (vẫn xem được chữ).</div>';
  return h;
};

// Màn một mẫu. vals: chữ đã gõ (chỉ trong bộ nhớ tạm). H: { canSpeak, n }
EM.view = function (item, vals, H) {
  var h = '<button class="ghost" data-act="emmenu">← Email mẫu</button>' +
    '<h1 style="margin-top:10px">' + esc(item.ten) + (item.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</h1>' +
    (item.boicanh ? '<p class="th">' + esc(item.boicanh) + '</p>' : '');
  h += '<div class="card"><div class="tag">1. Điền vào các ô (viết bằng tiếng Anh)</div>';
  if (!item.labels.length) h += '<p class="th">Mẫu này không có chỗ cần điền.</p>';
  item.labels.forEach(function (l, i) {
    h += '<label class="th" for="emf' + i + '" style="display:block;margin-top:8px">' + esc(l) + '</label>' +
      '<input type="text" id="emf' + i + '" data-emf="' + i + '" maxlength="' + MAXVAL + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" value="' + esc(val(vals, l)) + '">';
  });
  h += '</div><div class="card"><div class="tag">2. Bản email (xem trước)</div>' +
    '<div id="emprev" lang="en" style="white-space:pre-wrap;user-select:text;-webkit-user-select:text;font-size:1.02rem">' + EM.previewHTML(item, vals) + '</div>' +
    '<div class="note" id="emfillmsg" role="status">' + esc(EM.noteHTML(item, vals)) + '</div>' +
    '<button class="pri big" data-act="emcopy">' + IC('copy') + ' Sao chép</button>' +
    '<div class="note" id="emmsg" role="status" style="display:none"></div></div>';
  h += '<details class="card"><summary><b>Nghĩa tiếng Việt từng đoạn</b></summary><div style="white-space:pre-wrap;margin-top:8px">' +
    '<div class="th">Tiêu đề: ' + esc(item.tieudevi) + '</div>' +
    item.doan.map(function (d, i) { return '<div style="margin-top:8px"><span class="th">Đoạn ' + (i + 1) + ':</span> ' + esc(d.vi) + '</div>'; }).join('') + '</div></details>';
  if (item.cum.length) {
    h += '<div class="card"><div class="tag">3 cụm hay dùng</div>' + item.cum.map(function (c, i) {
      return '<div style="margin:8px 0 12px"><div lang="en" style="font-size:1.05rem">' + esc(c.en) + '</div><div class="th">' + esc(c.vi) + '</div>' +
        (H.canSpeak ? '<div class="row" style="margin-top:4px"><button data-act="emsay" data-k="' + i + '" data-r="slow" aria-label="Nghe chậm cụm ' + (i + 1) + '">' + IC('turtle') + ' Chậm</button>' +
          '<button data-act="emsay" data-k="' + i + '" data-r="normal" aria-label="Nghe cụm ' + (i + 1) + '">' + IC('volume') + ' Thường</button></div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  return h;
};

// Sao chép vào clipboard. Trả về Promise<boolean>. Cần gọi trực tiếp trong lúc xử lý bấm nút (iOS).
function legacyCopy(text) {
  var ta = null, ok = false;
  try {
    ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;font-size:16px';
    document.body.appendChild(ta);
    ta.focus({ preventScroll: true }); ta.select(); ta.setSelectionRange(0, text.length);
    ok = !!document.execCommand('copy');
  } catch (e) { ok = false; }
  try { if (ta && ta.parentNode) ta.parentNode.removeChild(ta); } catch (e2) { /* bỏ qua */ }
  return ok;
}
EM.copy = function (text) {
  function fallback() { return Promise.resolve(legacyCopy(text)); }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, fallback);
    }
  } catch (e) { /* xuống dự phòng */ }
  return fallback();
};
window.EM = EM;
})();
