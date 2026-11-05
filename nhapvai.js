/* Nhập vai (giai đoạn 4, đợt A): "chọn rồi nói". Người kia nói (giọng máy, có chữ); lượt của Thầy hiện 2–3 cách nói, Thầy chọn một cách rồi nói to.
   File này chỉ chứa: làm sạch dữ liệu tình huống, trạng thái lượt, và dựng HTML. Ghi âm / nhận giọng / lưu phiên dở dùng chung cơ chế Luyện nói trong app.js.
   Nạp trước app.js. Không gửi gì lên mạng. */
(function () {
'use strict';
var ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
var MAXTURN = 30, MAXCHON = 3;
function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
function str(x, n) { return typeof x === 'string' ? x.slice(0, n || 400) : ''; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
var NV = {};

// Làm sạch dữ liệu: lượt hỏng bị bỏ; tình huống không có lượt nào của Thầy thì bỏ cả tình huống.
NV.list = function (data, showUnrev) {
  if (!Array.isArray(data)) return [];
  var out = [];
  data.forEach(function (x) {
    if (!isObj(x) || !ID_RE.test(String(x.id)) || String(x.id) === '__proto__' || !Array.isArray(x.luot)) return;
    var luot = [];
    x.luot.slice(0, MAXTURN).forEach(function (t) {
      if (!isObj(t)) return;
      if (t.w === 'A' && typeof t.en === 'string' && t.en.trim()) luot.push({ w: 'A', en: str(t.en), vi: str(t.vi) });
      else if (t.w === 'T' && Array.isArray(t.chon)) {
        var ch = t.chon.filter(function (c) { return isObj(c) && typeof c.en === 'string' && c.en.trim(); }).slice(0, MAXCHON)
          .map(function (c) { return { en: str(c.en), vi: str(c.vi), gc: str(c.gc) }; });
        if (ch.length) luot.push({ w: 'T', chon: ch });
      }
    });
    if (!luot.some(function (t) { return t.w === 'T'; })) return;
    if (!showUnrev && x.duyet === 'chua') return;
    out.push({ id: String(x.id), ten: str(x.ten, 120) || String(x.id), nhom: str(x.nhom, 60) || 'Khác', boicanh: str(x.boicanh), nguoi: str(x.nguoi, 60) || 'Người kia',
      duyet: x.duyet, luot: luot, en: '', vi: '' });
  });
  return out;
};

function tCount(item, t) { var n = 0; for (var i = 0; i < t && i < item.luot.length; i++) if (item.luot[i].w === 'T') n++; return n; }
NV.nT = function (item) { return tCount(item, item.luot.length); };
function phaseAt(item, t) { var u = item.luot[t]; return !u ? 'sum' : u.w === 'A' ? 'nva' : 'nvc'; }

// Khởi tạo trạng thái của một phiên (mới hoặc làm tiếp từ r = S.sp). Dữ liệu dở không khớp thì bắt đầu lại từ đầu.
NV.init = function (sp, item, r) {
  var t = 0, p = -1, h = [], k = [];
  if (isObj(r) && Array.isArray(r.h) && Array.isArray(r.k)) {
    var rt = Math.round(Number(r.t));
    if (rt >= 0 && rt < item.luot.length && r.h.length === tCount(item, rt) && r.k.length === r.h.length) {
      t = rt;
      var Ts = item.luot.filter(function (u) { return u.w === 'T'; });
      h = r.h.map(function (x, i) { x = Math.round(Number(x)); return x >= 0 && x < Ts[i].chon.length ? x : 0; });
      k = r.k.map(function (x) { return Number(x) === 1 ? 1 : 0; });
      var rp = Math.round(Number(r.p));
      if (item.luot[t].w === 'T' && rp >= 0 && rp < item.luot[t].chon.length) p = rp;
    }
  }
  sp.t = t; sp.p = p; sp.h = h; sp.k = k; sp.ph = phaseAt(item, t);
  sp.n = k.length; sp.ok = k.filter(Boolean).length;
};
// Lượt hiện tại: nội dung tiếng Anh đang được nói / mẫu (không có dấu * hay thẻ).
NV.curEn = function (sp) {
  var item = sp && sp.q && sp.q[0], u = item && item.luot[sp.t];
  if (!u) return '';
  if (u.w === 'A') return u.en;
  var c = u.chon[sp.p]; return c ? c.en : '';
};
NV.canSpeakNow = function (sp) { return !!sp && sp.m === 'nv' && sp.ph === 'nvc' && sp.p >= 0; };
NV.pick = function (sp, k) {
  if (!sp || sp.ph !== 'nvc') return false;
  var u = sp.q[0].luot[sp.t]; k = Math.round(Number(k));
  if (!u || !(k >= 0 && k < u.chon.length)) return false;
  sp.p = k; return true;
};
NV.nextA = function (sp) { if (!sp || sp.ph !== 'nva') return false; sp.t++; sp.p = -1; sp.ph = phaseAt(sp.q[0], sp.t); return true; };
NV.rated = function (sp, ok) {
  sp.h.push(sp.p); sp.k.push(ok ? 1 : 0); sp.n = sp.k.length; sp.ok = sp.k.filter(Boolean).length;
  sp.t++; sp.p = -1; sp.ph = phaseAt(sp.q[0], sp.t);
};
NV.persist = function (sp) { return { t: sp.t, p: sp.p, h: sp.h.slice(0, 30), k: sp.k.slice(0, 30) }; };

function lineHTML(who, en, vi, H, extra) {
  return '<div class="th" style="margin:8px 0 0"><b>' + esc(who) + '</b>' + (extra || '') + '</div><div lang="en" style="font-size:1.05rem">' + H.phMark(en) + '</div>' + (vi ? '<div class="th">' + esc(vi) + '</div>' : '');
}
function transcript(item, sp, full) {
  var out = [], ti = 0;
  var upto = full ? item.luot.length : sp.t;
  for (var i = 0; i < upto && i < item.luot.length; i++) {
    var u = item.luot[i];
    if (u.w === 'A') out.push({ who: item.nguoi, en: u.en, vi: u.vi });
    else {
      var c = u.chon[sp.h[ti]]; var ok = sp.k[ti]; ti++;
      if (c) out.push({ who: 'Thầy', en: c.en, vi: c.vi, ok: ok });
    }
  }
  return out;
}

NV.menu = function (list, H) {
  var h = '<h1>Nhập vai</h1><p class="th">Người kia nói; Thầy chọn một cách trả lời rồi nói to (ghi âm nếu bật). Không chấm đúng sai, Thầy tự đánh giá.</p>';
  if (H.resume) h += H.resume;
  if (!list.length) h += '<div class="warn">Chưa có tình huống nào. Bật “Hiện cả nội dung chưa duyệt” trong Cài đặt.</div>';
  var groups = [];
  list.forEach(function (x) { if (groups.indexOf(x.nhom) < 0) groups.push(x.nhom); });
  groups.forEach(function (g) {
    h += '<h2>' + esc(g) + '</h2><div class="list">' + list.filter(function (x) { return x.nhom === g; }).map(function (x) {
      return '<button class="item" data-act="sstart" data-m="nv" data-id="' + esc(x.id) + '">' + esc(x.ten) + (x.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') +
        '<small>' + esc(x.boicanh) + ' · ' + NV.nT(x) + ' lượt của Thầy</small></button>';
    }).join('') + '</div>';
  });
  h += '<p class="th">Đã chơi: ' + H.n.nv + ' lượt nói (' + H.n.nvOk + ' “được”).</p>';
  if (!H.canSpeak) h += '<div class="warn">Trình duyệt này không đọc được tiếng Anh nên không có giọng của người kia (vẫn đọc được chữ). Thầy mở bằng Safari trên iPhone.</div>';
  if (!H.rec) h += '<div class="warn">Ghi âm đang tắt hoặc máy không ghi âm được. Thầy vẫn chơi được bằng cách nói to rồi tự đánh giá.</div>';
  return h;
};

// Dựng HTML cho mọi pha của một phiên nhập vai. H: { phMark, speakBtnsSp, canSpeak, stepBarN, diff(text, heard), asr, N }
NV.view = function (sp, H) {
  var item = sp.q[0], nT = NV.nT(item), done = tCount(item, sp.t);
  var h = '<button class="ghost" data-act="nvmenu">← Nhập vai</button>';
  if (sp.ph === 'sum') {
    var tr = transcript(item, sp, true);
    return h + '<h1>Xong tình huống</h1><div class="card"><div class="tag">' + esc(item.ten) + '</div><p>Thầy tự đánh giá “được” ' + sp.ok + ' / ' + sp.n + ' lượt.</p>' +
      '<p class="th">Không có điểm đúng sai. Dưới đây là cả cuộc hội thoại Thầy vừa chơi.</p>' +
      tr.map(function (x) { return lineHTML(x.who, x.en, x.vi, H, x.ok === 1 ? ' <span class="pill">được</span>' : x.ok === 0 ? ' <span class="pill">chưa được</span>' : ''); }).join('') + '</div>' +
      '<button class="pri big" data-act="sstart" data-m="nv" data-id="' + esc(item.id) + '">Chơi lại tình huống này</button>' +
      '<button class="ghost" style="margin-top:10px;width:100%" data-act="nvmenu">Chọn tình huống khác</button>';
  }
  var u = item.luot[sp.t];
  h += H.stepBarN(nT, done, done) + '<div class="card"><div class="tag">Nhập vai · ' + esc(item.ten) + (item.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</div>';
  if (item.boicanh) h += '<div class="note">' + esc(item.boicanh) + '</div>';
  var hist = transcript(item, sp, false);
  // Ở lượt Thầy, câu cuối của người kia là câu cần trả lời; hiện riêng nên bỏ khỏi phần lịch sử.
  var last = null;
  if (sp.ph !== 'nva' && hist.length && hist[hist.length - 1].who === item.nguoi) last = hist.pop();
  if (hist.length) h += '<div style="opacity:.8">' + hist.slice(-4).map(function (x) { return lineHTML(x.who, x.en, '', H); }).join('') + '</div>';
  if (sp.ph === 'nva') {
    h += '<div class="tag" style="margin-top:12px">' + esc(item.nguoi) + ' nói:</div><div class="en" lang="en">' + H.phMark(u.en) + '</div>' + (u.vi ? '<div class="vi">' + esc(u.vi) + '</div>' : '') +
      (H.canSpeak ? H.speakBtnsSp() : '') +
      '<button class="pri big" data-act="nvnext">' + (sp.t + 1 >= item.luot.length ? 'Xong tình huống' : item.luot[sp.t + 1].w === 'A' ? 'Tiếp' : 'Tiếp: đến lượt Thầy') + '</button>';
  } else {
    if (last) h += '<div class="tag" style="margin-top:12px">' + esc(item.nguoi) + ' vừa nói:</div><div lang="en" style="font-size:1.15rem">' + H.phMark(last.en) + '</div>' + (last.vi ? '<div class="th">' + esc(last.vi) + '</div>' : '');
    var c = u.chon[sp.p];
    if (sp.ph === 'nvc') {
      h += '<div class="en" style="font-size:1.1rem;margin-top:12px">Thầy trả lời thế nào? Chọn một cách rồi nói to:</div>' +
        u.chon.map(function (x, k) {
          return '<button class="opt' + (k === sp.p ? ' sel' : '') + '" data-act="nvpick" data-p="' + k + '" aria-pressed="' + (k === sp.p ? 'true' : 'false') + '"><span lang="en">' + H.phMark(x.en) + '</span>' +
            '<small style="display:block;color:var(--mute)">' + esc(x.vi) + '</small>' + (x.gc ? '<small style="display:block;color:var(--mute)">' + esc(x.gc) + '</small>' : '') + '</button>' +
            (H.canSpeak ? '<div class="row" style="margin:-4px 0 8px"><button data-act="nvhear" data-w="' + k + '" aria-label="Nghe cách nói ' + (k + 1) + '"><span aria-hidden="true">🔊</span> Nghe cách ' + (k + 1) + '</button></div>' : '');
        }).join('') +
        '<button class="pri big"' + (c ? ' data-act="sbegin"' : ' disabled') + '><span aria-hidden="true">🎤</span> ' + (c ? 'Bắt đầu nói' : 'Chọn một cách trước') + '</button>';
    } else if (sp.ph === 'talk') {
      h += '<div class="tag" style="margin-top:12px">Thầy nói:</div><div class="en" lang="en">' + H.phMark(c ? c.en : '') + '</div>' +
        '<div class="note" id="talkmsg" role="status">' + esc(sp.msg || 'Thầy nói to nhé… (nếu máy hỏi quyền micro, chọn Cho phép)') + '</div>' +
        (H.asr && !sp.msg ? '<div class="th">Máy nghe được:</div><div class="en" id="heard" lang="en" style="font-size:1.1rem">…</div>' : '') +
        '<button class="pri big" data-act="sstop">Nói xong</button>';
    } else if (sp.ph === 'wait') {
      h += '<p>Đang xử lý…</p>';
    } else {   // rev
      h += '<div class="tag" style="margin-top:12px">Câu mẫu Thầy đã chọn</div><div class="en" lang="en">' + H.phMark(c ? c.en : '') + '</div>' + (c && c.vi ? '<div class="vi">' + esc(c.vi) + '</div>' : '') + (c && c.gc ? '<div class="th">' + esc(c.gc) + '</div>' : '') +
        (H.canSpeak ? H.speakBtnsSp() : '');
      if (sp.url) h += '<div class="row" style="margin:8px 0"><button data-act="smine"><span aria-hidden="true">▶️</span> Nghe giọng của Thầy</button></div>';
      if (sp.heard) {
        h += '<div class="th">Máy nghe được: <span lang="en">' + esc(sp.heard) + '</span></div><div class="note">Chữ gạch đỏ là chữ máy không nghe ra, hoặc Thầy nói cách khác với câu mẫu. Máy có thể nghe nhầm, nên đây không phải điểm: Thầy tự nghe lại và đánh giá.</div>' +
          '<div class="en" lang="en" style="font-size:1.1rem">' + H.diff(c ? c.en : '', sp.heard) + '</div>';
      } else if (!sp.url) h += '<div class="note">' + esc(sp.msg || 'Thầy tự so phần mình vừa nói với câu mẫu.') + '</div>';
      h += '<div class="row"><button data-act="srate" data-ok="0">Chưa được</button><button class="pri" data-act="srate" data-ok="1">Được rồi</button></div>';
    }
  }
  return h + '</div>';
};
window.NV = NV;
})();
