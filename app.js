/* Tiếng Anh giao tiếp trường học — giai đoạn 1 (lõi). Không thư viện ngoài, dữ liệu lưu trong máy. */
(function () {
'use strict';

var D = window.APP_DATA || {};
var KEY = 'tagt_v1';
var INTV = [0, 1, 2, 4, 8, 16];            // số ngày đến lần ôn kế tiếp theo hộp 1..5
var RATE = { slow: 0.65, normal: 1, fast: 1.3 };

// ---------- tiện ích ----------
function $(s) { return document.querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function stress(s) { return esc(s).replace(/\*([^*]+)\*/g, '<b>$1</b>'); }
function plain(s) { return String(s == null ? '' : s).replace(/\*/g, ''); }
function dayNum(d) { d = d || new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
function ymd(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

// ---------- lưu trữ (an toàn khi localStorage bị chặn) ----------
var mem = null, saveFail = false;
var DATE_RE = /^\d{4}-\d\d-\d\d$/;
var ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
function defaults() {
  return { cards: {}, days: {}, streak: { last: '', count: 0 }, mathSeen: {}, custom: [],
    l: { dict: 0, lia: 0, dlg: {} }, ls: null, sp: null, n: { rx: 0, rxOk: 0, sh: 0, shOk: 0, gc: 0, gcOk: 0, dl: 0, dlOk: 0, nv: 0, nvOk: 0, em: 0 },
    set: { hideKnown: true, unrev: true, newPerDay: 5, theme: 'light', voice: '', rec: true, asr: true } };
}
function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
function num(x, d) { x = Number(x); return isFinite(x) ? x : d; }
// Làm sạch mọi dữ liệu đọc từ bộ nhớ hoặc file nhập: sai kiểu thì lấy mặc định.
function normalize(o) {
  var s = defaults();
  if (!isObj(o)) return s;
  if (isObj(o.cards)) Object.keys(o.cards).forEach(function (id) {
    var p = o.cards[id];
    if (id !== '__proto__' && isObj(p)) s.cards[id] = { box: Math.min(5, Math.max(1, Math.round(num(p.box, 1)))), due: Math.round(num(p.due, 0)) };
  });
  if (isObj(o.days)) Object.keys(o.days).forEach(function (k) { if (DATE_RE.test(k)) s.days[k] = true; });
  if (isObj(o.streak)) s.streak = { last: DATE_RE.test(o.streak.last) ? o.streak.last : '', count: Math.max(0, Math.round(num(o.streak.count, 0))) };
  if (isObj(o.mathSeen)) Object.keys(o.mathSeen).forEach(function (k) { if (k !== '__proto__') s.mathSeen[k] = String(o.mathSeen[k]).slice(0, 10); });
  if (Array.isArray(o.custom)) s.custom = o.custom.filter(isObj).map(function (c, i) {
    var id = String(c.id || '').replace(/[^A-Za-z0-9_-]/g, '') || ('U' + Date.now() + i);
    if (id === '__proto__' || id === 'constructor' || id === 'prototype') id = 'U' + Date.now() + i;
    return { id: id, en: String(c.en || ''), vi: String(c.vi || ''), nhom: 'Câu của Thầy', muc: 1, tinhhuong: String(c.tinhhuong || ''), loi: '', noiam: '', duyet: 'thay' };
  }).filter(function (c) { return c.en && c.vi; });
  // Luyện nghe: thống kê (l) và bài đang dở (ls) — mọi giá trị được ép kiểu/cắt độ dài.
  if (isObj(o.l)) {
    s.l.dict = Math.max(0, Math.round(num(o.l.dict, 0))); s.l.lia = Math.max(0, Math.round(num(o.l.lia, 0)));
    if (isObj(o.l.dlg)) Object.keys(o.l.dlg).slice(0, 50).forEach(function (k) {
      var p = o.l.dlg[k];
      if (k !== '__proto__' && ID_RE.test(k) && isObj(p)) s.l.dlg[k] = { best: Math.min(20, Math.max(0, Math.round(num(p.best, 0)))), n: Math.min(9999, Math.max(1, Math.round(num(p.n, 1)))) };
    });
  }
  if (isObj(o.ls) && ['dict', 'lia', 'dlg'].indexOf(o.ls.mode) >= 0 && Array.isArray(o.ls.q)) {
    var q = o.ls.q.map(String).filter(function (id) { return ID_RE.test(id); }).slice(0, o.ls.mode === 'dlg' ? 1 : 10);
    var mx = o.ls.mode === 'dlg' ? 10 : q.length;
    var r = (Array.isArray(o.ls.r) ? o.ls.r : []).slice(0, mx).map(function (x) {
      x = num(x, 0);
      return o.ls.mode === 'dlg' ? Math.min(2, Math.max(0, Math.round(x))) : Math.min(1, Math.max(0, x));
    });
    var qOrig = o.ls.q;
    if (q.length && q.length === qOrig.length && qOrig.length <= (o.ls.mode === 'dlg' ? 1 : 10) && q.indexOf('__proto__') < 0) s.ls = { mode: o.ls.mode, q: q, r: r };
  }
  if (isObj(o.n)) ['rx', 'rxOk', 'sh', 'shOk', 'gc', 'gcOk', 'dl', 'dlOk', 'nv', 'nvOk', 'em'].forEach(function (k) { s.n[k] = Math.min(999999, Math.max(0, Math.round(num(o.n[k], 0)))); });
  // Phiên luyện nói đang dở (để tải lại vẫn làm tiếp): m = kiểu, q = id các mục, i = lượt hiện tại, s = bước (đoạn dài), j = câu (đoạn dài).
  if (isObj(o.sp) && ['rx', 'sh', 'gc', 'dl', 'nv'].indexOf(o.sp.m) >= 0 && Array.isArray(o.sp.q)) {
    var spq = o.sp.q.map(String).filter(function (id) { return ID_RE.test(id) && id !== '__proto__'; }).slice(0, (o.sp.m === 'dl' || o.sp.m === 'nv') ? 1 : 5);
    if (spq.length && spq.length === o.sp.q.length && ((o.sp.m !== 'dl' && o.sp.m !== 'nv') || spq.length === 1)) {
      var spi = Math.round(num(o.sp.i, 0));
      if (spi >= 0 && spi < spq.length) s.sp = { m: o.sp.m, q: spq, i: spi, s: Math.min(3, Math.max(1, Math.round(num(o.sp.s, 1)))), j: Math.min(60, Math.max(0, Math.round(num(o.sp.j, 0)))) };
      if (s.sp && o.sp.m === 'nv') {      // nhập vai: lượt đang ở (t), cách đang chọn (p), các cách đã chọn (h) và tự đánh giá (k)
        s.sp.t = Math.min(40, Math.max(0, Math.round(num(o.sp.t, 0)))); s.sp.p = Math.min(2, Math.max(-1, Math.round(num(o.sp.p, -1))));
        s.sp.h = (Array.isArray(o.sp.h) ? o.sp.h : []).slice(0, 30).map(function (x) { return Math.min(2, Math.max(0, Math.round(num(x, 0)))); });
        s.sp.k = (Array.isArray(o.sp.k) ? o.sp.k : []).slice(0, 30).map(function (x) { return num(x, 0) === 1 ? 1 : 0; });
      }
    }
  }
  var st = isObj(o.set) ? o.set : {};
  s.set = { hideKnown: st.hideKnown !== false, unrev: st.unrev !== false,
    newPerDay: [3, 5, 8].indexOf(Number(st.newPerDay)) >= 0 ? Number(st.newPerDay) : 5,
    theme: st.theme === 'dark' ? 'dark' : 'light', voice: String(st.voice || ''), rec: st.rec !== false, asr: st.asr !== false };
  return s;
}
function load() {
  var raw = null;
  try { raw = localStorage.getItem(KEY); } catch (e) { saveFail = true; }
  if (raw) {
    try { return normalize(JSON.parse(raw)); }
    catch (e) { try { var hk = KEY + (localStorage.getItem(KEY + '_hong') ? '_hong2' : '_hong'); localStorage.setItem(hk, raw); } catch (e2) { /* bỏ qua */ } }   // giữ bản hỏng để cứu
  }
  return mem || defaults();
}
var S = load();
function save() { mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); saveFail = false; } catch (e) { saveFail = true; } }

// ---------- nghe đọc ----------
var voices = [];
var canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
function loadVoices() {
  if (!canSpeak) return;
  voices = speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
  if (VIEW === 'settings') render();      // cập nhật danh sách giọng khi vừa tải xong
}
if (canSpeak) { try { speechSynthesis.onvoiceschanged = loadVoices; loadVoices(); setTimeout(loadVoices, 500); } catch (e) { /* bỏ qua */ } }
// Chỉ gán giọng khi Thầy đã chọn; còn lại để hệ thống dùng giọng en-US mặc định của máy.
function chosenVoice() {
  if (!S.set.voice) return null;
  return voices.filter(function (x) { return x.voiceURI === S.set.voice; })[0] || null;
}
function ttsText(t) {
  return plain(t).replace(/[\[\]]/g, '').replace(/²/g, ' squared').replace(/=/g, ' equals ').replace(/\+/g, ' plus ').replace(/\s*\/\s*/g, ', or ');
}
function say(text, mode) {
  if (!canSpeak) return;
  try {
    var sp = speechSynthesis, wasBusy = sp.speaking || sp.pending;
    if (wasBusy) sp.cancel();
    var u = new SpeechSynthesisUtterance(ttsText(text));
    u.lang = 'en-US'; u.rate = RATE[mode] || 1;
    var v = chosenVoice(); if (v) u.voice = v;
    var run = function () { try { sp.resume(); sp.speak(u); } catch (e) { /* bỏ qua */ } };
    if (wasBusy) setTimeout(run, 80); else run();   // đợi một nhịp sau cancel để iOS không nuốt câu
  } catch (e) { /* bỏ qua */ }
}
function speakBtns(key) {
  if (!canSpeak) return '<div class="warn">Máy này không hỗ trợ đọc tiếng Anh trong trình duyệt. Thầy thử bằng Safari trên iPhone.</div>';
  function b(r, ic, name) { return '<button data-act="say" data-k="' + key + '" data-r="' + r + '" aria-label="Nghe ' + name + '">' + IC(ic) + ' ' + name.charAt(0).toUpperCase() + name.slice(1) + '</button>'; }
  return '<div class="speak">' + b('slow', 'turtle', 'chậm') + b('normal', 'volume', 'thường') + b('fast', 'bolt', 'nhanh') + '</div>';
}

// ---------- dữ liệu ----------
function allCards() {
  var a = [].concat(S.custom || [], D.cau_chao_lop || [], D.cau_giang_toan || [], D.cau_giao_bai || [], D.cau_hoi_dap || [], D.cau_khen_nhac || [], D.cau_quan_lop || [], D.cau_dong_nghiep || [], D.cau_hoi_thao || []);   // câu của Thầy lên đầu hàng thẻ mới
  if (!S.set.unrev) a = a.filter(function (c) { return c.duyet !== 'chua'; });
  return a;
}
function allTerms() { var a = D.toan || []; if (!S.set.unrev) a = a.filter(function (c) { return c.duyet !== 'chua'; }); return a; }

// ---------- ôn cách quãng ----------
function rateCard(c, ok) {
  var t = dayNum(), p = S.cards[c.id] || { box: 0, due: t };
  p.box = ok ? Math.min(5, Math.max(1, p.box) + 1) : 1;
  p.due = t + INTV[p.box];
  S.cards[c.id] = p; save();
}
function counts() {
  var cs = allCards(), t = dayNum(), due = 0, fresh = 0, known = 0;
  cs.forEach(function (c) { var p = S.cards[c.id]; if (!p) fresh++; else { if (p.due <= t) due++; if (p.box >= 3) known++; } });
  return { due: due, fresh: fresh, known: known, total: cs.length };
}
function modeOf(c, isNew) {
  var p = S.cards[c.id];
  if (isNew || !p) return 'new';
  if (S.set.hideKnown && p.box >= 3) return 'recall';
  return 'learn';
}

// ---------- thẻ câu ----------
var CUR = {};   // key -> nội dung đọc
function cardHTML(c, mode, rev, rating) {
  CUR.card = c.en;
  var showEn = mode !== 'recall' || rev;
  var showVi = mode === 'new' || rev;
  var h = '<div class="card"><div class="tag">' + esc(c.nhom) + (c.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</div>';
  if (showEn) { h += '<div class="en" lang="en">' + stress(c.en) + '</div>' + speakBtns('card'); }
  else { h += '<div class="en" style="font-size:1.2rem">Hãy nói bằng tiếng Anh:</div><div class="vi">' + esc(c.tinhhuong || c.vi) + '</div>'; }
  if (showVi) {
    h += '<div class="vi">' + esc(c.vi) + '</div>';
    if (c.tinhhuong) h += '<div class="th">Tình huống: ' + esc(c.tinhhuong) + '</div>';
    if (c.loi) h += '<div class="note">Lỗi hay mắc: ' + esc(c.loi) + '</div>';
    if (c.noiam) h += '<div class="note">Nối âm: ' + esc(c.noiam) + '</div>';
  }
  if (!showVi || !showEn) h += '<button class="pri big" data-act="reveal">' + (mode === 'recall' ? 'Hiện câu mẫu' : 'Hiện nghĩa Việt') + '</button>';
  else if (rating) h += '<div class="row"><button data-act="rate" data-ok="0">Chưa nhớ</button><button class="pri" data-act="rate" data-ok="1">Nhớ rồi</button></div>';
  return h + '</div>';
}

// ---------- phiên Luyện hôm nay ----------
var SES = null;
function startSession() {
  var cs = allCards(), t = dayNum();
  var due = cs.filter(function (c) { return S.cards[c.id] && S.cards[c.id].due <= t; })
    .sort(function (a, b) { return S.cards[a.id].due - S.cards[b.id].due; }).slice(0, 10);
  var fresh = cs.filter(function (c) { return !S.cards[c.id]; }).slice(0, S.set.newPerDay);
  SES = { si: 0, rev: false, again: {}, did: 0, fin: false, stat: { rev: 0, nw: 0, listen: '', term: '' },
    steps: [{ k: 'review', title: 'Ôn thẻ đến hạn', q: due }, { k: 'new', title: 'Thẻ mới', q: fresh },
      { k: 'listen', title: 'Nghe nhanh' }, { k: 'term', title: 'Từ Toán mới' }] };
  skipEmpty(); go('session');
}
function skipEmpty() {
  while (SES.si < SES.steps.length) {
    var s = SES.steps[SES.si];
    if ((s.k === 'review' || s.k === 'new') && !s.q.length) { SES.si++; continue; }
    if (s.k === 'listen') {
      if (!s.card) {
        var seen = allCards().filter(function (c) { return S.cards[c.id]; });
        if (!seen.length) { SES.si++; continue; }
        s.card = pick(seen); s.shown = false;
      }
    }
    if (s.k === 'term' && !s.term) {
      var ts = allTerms(); if (!ts.length) { SES.si++; continue; }
      var unseen = ts.filter(function (x) { return !S.mathSeen[x.id]; });
      s.term = unseen.length ? unseen[0] : pick(ts);
    }
    break;
  }
}
function stepBar() {
  var h = '<div class="steps">';
  for (var i = 0; i < SES.steps.length; i++) h += '<i class="' + (i < SES.si ? 'on' : i === SES.si ? 'cur' : '') + '"></i>';
  return h + '</div>';
}
function renderSession(v) {
  skipEmpty();
  if (SES.si >= SES.steps.length) return finishSession(v);
  var s = SES.steps[SES.si], h = stepBar();
  var top = '<div class="tag">Bước ' + (SES.si + 1) + '/4 · ' + s.title + '</div>';
  if (s.k === 'review' || s.k === 'new') {
    var c = s.q[0];
    h += top + '<div class="tag">Còn ' + s.q.length + ' thẻ</div>' + cardHTML(c, modeOf(c, s.k === 'new'), SES.rev || s.k === 'new', true);
  } else if (s.k === 'listen') {
    var cc = s.card; CUR.card = cc.en;
    h += top + '<div class="card"><p>Nghe ở tốc độ nhanh. Đoán nghĩa trước, rồi bấm hiện chữ.</p>' +
      '<div class="row"><button class="pri" data-act="say" data-k="card" data-r="fast">' + IC('bolt') + ' Nghe nhanh</button><button data-act="say" data-k="card" data-r="normal">' + IC('volume') + ' Nghe thường</button></div>';
    if (s.shown) {
      h += '<div class="en" lang="en">' + stress(cc.en) + '</div><div class="vi">' + esc(cc.vi) + '</div>' +
        (cc.noiam ? '<div class="note">Nối âm: ' + esc(cc.noiam) + '</div>' : '') +
        '<div class="row"><button data-act="listen" data-ok="0">Chưa hiểu hết</button><button class="pri" data-act="listen" data-ok="1">Hiểu rồi</button></div>';
    } else h += '<button class="pri big" style="margin-top:12px" data-act="lshow">Hiện chữ</button>';
    h += '</div>';
  } else {
    var t = s.term; CUR.term = t.en; CUR.vd = t.vd;
    h += top + termHTML(t) + '<button class="pri big" data-act="termdone">Đã xem</button>';
  }
  h += '<button class="ghost" style="margin-top:10px;width:100%" data-act="skip">Bỏ qua bước này</button>';
  v.innerHTML = h;
}
function yesterdayKey() { var y = new Date(); y.setDate(y.getDate() - 1); return ymd(y); }
function shownStreak() { return (S.streak.last === ymd() || S.streak.last === yesterdayKey()) ? S.streak.count : 0; }
function finishSession(v) {
  if (!SES.did) {      // không luyện bước nào (bỏ qua hết hoặc chưa có nội dung): không tính chuỗi ngày
    v.innerHTML = '<h1>Chưa luyện bước nào</h1><div class="card"><p>Thầy chưa làm bước nào, hoặc chưa có nội dung phù hợp. Nếu chưa duyệt nội dung, bật “Hiện cả nội dung chưa duyệt” trong Cài đặt.</p></div>' +
      '<button class="pri big" data-go="home">Về màn hình chính</button>';
    return;
  }
  var tk = ymd();
  if (!SES.fin) {
    SES.fin = true;
    if (S.streak.last !== tk) { S.streak.count = S.streak.last === yesterdayKey() ? S.streak.count + 1 : 1; S.streak.last = tk; }
    S.days[tk] = true; save();
  }
  v.innerHTML = '<h1>Xong buổi luyện hôm nay</h1><div class="card"><p>Chuỗi ngày: <b>' + S.streak.count + '</b></p>' +
    '<p>Thẻ đã ôn: <b>' + SES.stat.rev + '</b> · Thẻ mới: <b>' + SES.stat.nw + '</b></p>' +
    (SES.stat.listen ? '<p>Bài nghe nhanh: ' + SES.stat.listen + '</p>' : '') +
    (SES.stat.term ? '<p>Từ Toán: ' + esc(SES.stat.term) + '</p>' : '') + '</div>' +
    '<button class="pri big" data-go="home">Về màn hình chính</button>';
}

// ---------- từ điển Toán ----------
function spokenParts(t) {
  var out = [], re = /đọc:\s*([^;]+)/g, m;
  while ((m = re.exec(t.doc || ''))) out.push(m[1].trim());
  return out;
}
function termHTML(t) {
  var parts = spokenParts(t);
  var h = '<div class="card"><div class="tag">' + esc(t.mang) + (t.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</div>' +
    '<div class="en" lang="en"><b>' + esc(t.en) + '</b></div>' + speakBtns('term') +
    '<div class="vi">' + esc(t.vi) + '</div>';
  if (t.ipa) h += '<div class="ipa">Phiên âm (chờ xác nhận): ' + esc(t.ipa) + '</div>';
  if (t.doc) h += '<div class="note">Cách đọc: ' + esc(t.doc) + '</div>';
  if (parts.length) h += '<button data-act="sayparts" data-r="normal">' + IC('volume') + ' Nghe cách đọc công thức</button>';
  if (t.vd) h += '<div class="en" lang="en" style="font-size:1.1rem;margin-top:12px">' + esc(t.vd) + '</div>' + speakBtns('vd');
  return h + '</div>';
}
var MATH = { mang: '', q: '', open: null };
function mathList() {
  var ts = allTerms().filter(function (t) {
    var q = MATH.q.toLowerCase();
    return (!MATH.mang || t.mang.indexOf(MATH.mang) === 0) && (!q || (t.en + ' ' + t.vi).toLowerCase().indexOf(q) >= 0);
  });
  return ts.map(function (t) { return '<button class="item" data-act="topen" data-id="' + esc(t.id) + '"><span lang="en">' + esc(t.en) + '</span><small>' + esc(t.vi) + '</small></button>'; }).join('') || '<p>Không có thuật ngữ phù hợp.</p>';
}
function renderMath(v) {
  if (MATH.open) {
    var t = allTerms().filter(function (x) { return x.id === MATH.open; })[0];
    if (t) { CUR.term = t.en; CUR.vd = t.vd; v.innerHTML = '<button data-act="tback">← Danh sách</button>' + termHTML(t); S.mathSeen[t.id] = ymd(); save(); return; }
    MATH.open = null;
  }
  var mangs = ['Số học', 'Đại số', 'Hình học', 'Xác suất', 'PPDH'];
  v.innerHTML = '<h1>Từ điển Toán</h1><input type="search" id="mq" placeholder="Tìm: fraction, phân số…" value="' + esc(MATH.q) + '">' +
    '<div class="row" style="margin:10px 0"><select id="mm"><option value="">Tất cả mảng</option>' +
    mangs.map(function (m) { return '<option' + (MATH.mang === m ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></div>' +
    '<div class="list" id="mlist">' + mathList() + '</div>';
}

// ---------- thư viện thẻ câu ----------
var LIB = { nhom: '', open: null };
function renderLib(v) {
  var cs = allCards();
  if (LIB.open) {
    var c = cs.filter(function (x) { return x.id === LIB.open; })[0];
    if (c) {
      v.innerHTML = '<button data-act="lback">← Danh sách</button>' + cardHTML(c, 'new', true, false) +
        (c.duyet === 'thay' ? '<button data-act="delc" style="color:var(--bad)">Xoá câu này</button>' : '');
      return;
    }
    LIB.open = null;
  }
  var nhoms = []; cs.forEach(function (c) { if (nhoms.indexOf(c.nhom) < 0) nhoms.push(c.nhom); });
  var list = cs.filter(function (c) { return !LIB.nhom || c.nhom === LIB.nhom; });
  v.innerHTML = '<h1>Thẻ câu</h1><select id="ln"><option value="">Tất cả nhóm (' + cs.length + ' câu)</option>' +
    nhoms.map(function (n) { return '<option' + (LIB.nhom === n ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select>' +
    '<div class="list" style="margin-top:10px">' + list.map(function (c) {
      var p = S.cards[c.id];
      return '<button class="item" data-act="lopen" data-id="' + esc(c.id) + '"><span lang="en">' + esc(plain(c.en)) + '</span><span class="pill">' + (p ? 'hộp ' + Number(p.box) : 'mới') + '</span><small>' + esc(c.vi) + '</small></button>';
    }).join('') + '</div>' +
    '<h2>Thêm câu của Thầy</h2><div class="card"><input type="text" id="ae" placeholder="Câu tiếng Anh" style="margin-bottom:8px"><input type="text" id="av" placeholder="Nghĩa tiếng Việt" style="margin-bottom:8px"><button class="pri" data-act="addc">Thêm câu</button></div>';
}

// ---------- màn hình chính ----------
function renderHome(v) {
  var n = counts(), tk = ymd(), done = !!S.days[tk];
  function tile(act, ic, label, sub) { return '<button class="tile" data-act="' + act + '"><span class="tic">' + IC(ic) + '</span><span class="tt">' + label + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</button>'; }
  var lsub = (function () { var it = S.ls && lsItems(); return it && S.ls.r.length > 0 && S.ls.r.length < lsTotal(it) ? 'có bài đang dở' : ''; })();
  v.innerHTML = '<div class="brand"><img src="icon-192.png" alt="" width="44" height="44"><div><div class="eyebrow">Xin chào Thầy</div><div class="bn">Tiếng Anh trường học</div></div><button class="ghost iconbtn" data-act="theme" aria-label="' + (S.set.theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối') + '">' + IC(S.set.theme === 'dark' ? 'sun' : 'moon') + '</button></div>' +
    '<button class="pri big hero" data-act="start"><span class="tic">' + IC('play') + '</span><span class="ht">' + (done ? 'Luyện thêm hôm nay' : 'Luyện hôm nay') + '<small>' + (done ? 'Đã xong buổi hôm nay' : 'Khoảng 10 phút') + '</small></span></button>' +
    (done ? '<p class="okmsg">' + IC('check') + ' Hôm nay Thầy đã luyện xong.</p>' : '') +
    '<h2 class="sec">Luyện kỹ năng</h2><div class="tiles">' +
    tile('lmenu', 'headphones', 'Luyện nghe', lsub) +
    tile('smenu', 'mic', 'Luyện nói', '') +
    (window.NV ? tile('nvmenu', 'roles', 'Nhập vai', S.sp && S.sp.m === 'nv' && resumeItems() ? 'có tình huống đang dở' : '') : '') +
    (window.EM ? tile('emmenu', 'mail', 'Email mẫu', '') : '') + '</div>' +
    '<div class="stats"><div class="stat"><b>' + shownStreak() + '</b><span>chuỗi ngày</span></div><div class="stat"><b>' + n.known + '</b><span>câu đã thuộc</span></div><div class="stat"><b>' + n.due + '</b><span>thẻ đến hạn</span></div></div>' +
    '<p>Thẻ chưa học: ' + n.fresh + ' / ' + n.total + '. Mỗi buổi: ôn thẻ đến hạn → ' + S.set.newPerDay + ' thẻ mới → 1 bài nghe nhanh → 1 từ Toán mới.</p>' +
    (S.set.unrev ? '<div class="warn">Bản thử: đang hiện cả nội dung <b>chưa được Thầy duyệt</b> (có nhãn “Chưa duyệt”). Tắt trong Cài đặt khi đã duyệt xong.</div>' : '') +
    (saveFail ? '<div class="warn">Không lưu được tiến độ vào máy (có thể đang ở chế độ riêng tư hoặc bộ nhớ đầy). Tắt app là mất; hãy dùng Cài đặt → Xuất sao lưu.</div>' : '') +
    (canSpeak ? '' : '<div class="warn">Trình duyệt này không đọc được tiếng Anh. Hãy mở bằng Safari trên iPhone.</div>');
}

// ---------- cài đặt, sao lưu ----------
function renderSettings(v) {
  var vs = voices.map(function (x) { return '<option value="' + esc(x.voiceURI) + '"' + (S.set.voice === x.voiceURI ? ' selected' : '') + '>' + esc(x.name + ' (' + x.lang + ')') + '</option>'; }).join('');
  v.innerHTML = '<h1>Cài đặt</h1>' +
    '<label class="set">Thẻ đã quen: ẩn câu mẫu, chỉ hiện tình huống<input type="checkbox" data-set="hideKnown"' + (S.set.hideKnown ? ' checked' : '') + '></label>' +
    '<label class="set">Hiện cả nội dung chưa duyệt (bản thử)<input type="checkbox" data-set="unrev"' + (S.set.unrev ? ' checked' : '') + '></label>' +
    '<label class="set">Thẻ mới mỗi buổi<select data-set="newPerDay" style="width:90px">' + [3, 5, 8].map(function (n) { return '<option' + (S.set.newPerDay === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
    '<label class="set">Giao diện<select data-set="theme" style="width:140px">' + [['light', 'Sáng'], ['dark', 'Tối']].map(function (o) { return '<option value="' + o[0] + '"' + (S.set.theme === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
    '<label class="set">Giọng đọc<select data-set="voice" style="width:200px"><option value="">Tự chọn giọng Mỹ</option>' + vs + '</select></label>' +
    '<h2>Luyện nói</h2>' +
    '<label class="set">Ghi âm giọng Thầy (lưu trong máy ' + (window.NOI ? NOI.days : 7) + ' ngày)<input type="checkbox" data-set="rec"' + (S.set.rec ? ' checked' : '') + '></label>' +
    '<label class="set">Hiện chữ máy nghe được (trình duyệt có thể gửi âm thanh cho Apple/Google để nhận dạng)<input type="checkbox" data-set="asr"' + (S.set.asr ? ' checked' : '') + '></label>' +
    '<button data-act="rclear" style="margin-top:8px">Xoá hết ghi âm trong máy</button>' +
    '<h2>Sao lưu</h2><div class="row"><button data-act="export">Xuất sao lưu</button><button data-act="import">Nhập sao lưu</button></div>' +
    '<input type="file" id="imp" accept="application/json" class="hide">' +
    '<p class="th" style="margin-top:8px">File sao lưu chỉ có tiến độ và câu Thầy thêm, không có dữ liệu ai khác.</p>' +
    '<h2>Xoá tiến độ</h2><button data-act="reset" style="color:var(--bad)">Xoá toàn bộ tiến độ trong máy</button>';
}
function applyTheme() { document.documentElement.setAttribute('data-theme', S.set.theme === 'dark' ? 'dark' : 'light'); }

// ---------- luyện nghe (giai đoạn 2) ----------
// Tiến độ bài đang làm lưu ở S.ls = { mode, q: [id...], r: [kết quả từng mục đã làm] }; mục kế tiếp = r.length, nên tải lại vẫn tiếp được.
var LXS = freshLXS();     // trạng thái tạm của màn hình: fb (mục đang xem nhận xét), d (kết quả so từ), rev (đã hiện chữ), show (xem lời thoại)
function freshLXS() { return { fb: null, d: null, rev: false, show: false }; }
var LG = { open: null };
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function pickSet(pool, n) {     // ưu tiên câu Thầy đã học (có trong hộp ôn), rồi mới đến câu chưa học
  var seen = pool.filter(function (c) { return S.cards[c.id]; }), fresh = pool.filter(function (c) { return !S.cards[c.id]; });
  return shuffle(seen).concat(shuffle(fresh)).slice(0, n);
}
function dictPool() { return allCards().filter(function (c) { return !/[0-9=+²\/]/.test(plain(c.en)); }); }   // bỏ câu có số/ký hiệu vì máy đọc thành lời, khó chấm
function noiamPhrase(c) { return String(c.noiam || '').split(':')[0].trim().toLowerCase(); }
function validNoiam(c) {        // cụm nối âm phải thật sự nằm trong câu
  var p = noiamPhrase(c); return !!p && plain(c.en).toLowerCase().replace(/[’]/g, "'").indexOf(p) >= 0;
}
function liaPool() { return allCards().filter(validNoiam); }
function hoiList() { var a = D.hoithoai || []; if (!S.set.unrev) a = a.filter(function (x) { return x.duyet !== 'chua'; }); return a; }
function lsItems() {            // trả về danh sách mục của bài đang dở; null nếu dữ liệu không còn khớp
  var L = S.ls; if (!L) return null;
  if (L.mode === 'dlg') { var d = hoiList().filter(function (x) { return x.id === L.q[0]; })[0]; if (d && L.r.length > d.qs.length) L.r = L.r.slice(0, d.qs.length); return d ? [d] : null; }
  var cs = allCards(), out = [];
  for (var i = 0; i < L.q.length; i++) {
    var c = cs.filter(function (x) { return x.id === L.q[i]; })[0];
    if (!c || (L.mode === 'lia' && !validNoiam(c))) return null;
    out.push(c);
  }
  if (L.r.length > out.length) L.r = L.r.slice(0, out.length);
  return out;
}
function lsTotal(its) { return S.ls.mode === 'dlg' ? its[0].qs.length : its.length; }
function startListen(mode, id) {
  var cur = lsItems();
  if (cur && S.ls.r.length && S.ls.r.length < lsTotal(cur) && !confirm('Bỏ bài đang dở để làm bài mới?')) return;
  var q;
  if (mode === 'dlg') { if (!hoiList().some(function (x) { return x.id === id; })) return; q = [id]; }
  else {
    var pool = mode === 'dict' ? dictPool() : liaPool();
    if (!pool.length) { alert('Chưa có câu phù hợp cho bài này.'); return; }
    q = pickSet(pool, 5).map(function (c) { return c.id; });
  }
  S.ls = { mode: mode, q: q, r: [] }; save(); LXS = freshLXS(); go('lx');
}
// So từng từ (bỏ qua hoa thường, dấu câu, dấu nháy; gạch nối coi như dấu cách). Dùng LCS để tìm từ nghe sai/thiếu/thừa.
function tokw(w) { return w.toLowerCase().replace(/[’‘`']/g, '').replace(/[^a-z0-9]/g, ''); }
function diffWords(target, ans, maxw) {
  var tw = plain(target).replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  var aw = String(ans).replace(/-/g, ' ').split(/\s+/).filter(Boolean).slice(0, maxw || 60);
  var tt = tw.map(tokw), at = aw.map(tokw), n = tw.length, m = aw.length, i, j;
  var dp = []; for (i = 0; i <= n; i++) { dp.push([]); for (j = 0; j <= m; j++) dp[i].push(0); }
  for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--)
    dp[i][j] = (tt[i] && tt[i] === at[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  var okT = {}, okA = {}; i = 0; j = 0;
  while (i < n && j < m) {
    if (tt[i] && tt[i] === at[j]) { okT[i] = 1; okA[j] = 1; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  var words = [], total = 0, hit = 0, extra = [];
  for (i = 0; i < n; i++) {
    if (!tt[i]) { words.push({ w: tw[i], ok: true }); continue; }
    total++; if (okT[i]) hit++;
    words.push({ w: tw[i], ok: !!okT[i] });
  }
  for (j = 0; j < m; j++) if (at[j] && !okA[j]) extra.push(aw[j]);
  return { words: words, extra: extra, hit: hit, total: total, score: total ? Math.max(0, hit - extra.length) / total : 0 };
}
function diffHTML(d) {
  return d.words.map(function (x) { return x.ok ? '<span class="w-ok">' + esc(x.w) + '</span>' : '<span class="w-miss">' + esc(x.w) + '<span class="sr"> (nghe sai hoặc thiếu)</span></span>'; }).join(' ');
}
function markPhrase(c) {
  var p = plain(c.en), ph = noiamPhrase(c), i = p.toLowerCase().replace(/[’]/g, "'").indexOf(ph);
  if (i < 0) return esc(p);
  return esc(p.slice(0, i)) + '<mark>' + esc(p.slice(i, i + ph.length)) + '</mark>' + esc(p.slice(i + ph.length));
}
// Đọc nhiều lượt liền nhau; người A cao giọng hơn người B (iPhone có thể bỏ qua chênh lệch này).
function sayLines(lines, mode) {
  if (!canSpeak) return;
  try {
    var sp = speechSynthesis, busy = sp.speaking || sp.pending;
    if (busy) sp.cancel();
    var run = function () {
      try {
        if (VIEW !== 'lx') return;
        sp.resume();
        lines.forEach(function (ln) {
          var u = new SpeechSynthesisUtterance(ttsText(ln.en));
          u.lang = 'en-US'; u.rate = RATE[mode] || 1; u.pitch = ln.w === 'B' ? 0.8 : 1.1;
          var v = chosenVoice(); if (v) u.voice = v;
          sp.speak(u);
        });
      } catch (e) { /* bỏ qua */ }
    };
    if (busy) setTimeout(run, 80); else run();
  } catch (e) { /* bỏ qua */ }
}
function stepBarN(total, done, cur) {
  var h = '<div class="steps">';
  for (var i = 0; i < total; i++) h += '<i class="' + (i < done ? 'on' : i === cur ? 'cur' : '') + '"></i>';
  return h + '</div>';
}
function lsName(L) { return L.mode === 'dict' ? 'Nghe chép' : L.mode === 'lia' ? 'Nghe nối âm' : 'Nghe hội thoại'; }

function renderListen(v) {
  var cur = lsItems(), h = '<h1>Luyện nghe</h1>' +
    '<p class="th">Giọng máy đọc đều và rõ hơn người thật. Dùng để tập tai; người bản xứ thật còn nhanh và lẫn tiếng ồn hơn.</p>';
  var lost = false;
  if (S.ls && !cur) { S.ls = null; save(); lost = true; }
  if (lost) h += '<div class="warn">Bài nghe đang dở không còn khớp với nội dung hiện có (có thể do Thầy vừa tắt “Hiện cả nội dung chưa duyệt”), nên đã được bỏ.</div>';
  if (cur) {
    var tot = lsTotal(cur), dn = S.ls.r.length;
    h += '<div class="card"><div class="tag">Bài đang dở</div><p><b>' + esc(lsName(S.ls)) + '</b>' + (S.ls.mode === 'dlg' ? ': ' + esc(cur[0].ten) : '') + ' · đã làm ' + dn + '/' + tot + '</p>' +
      '<div class="row"><button class="pri" data-act="lresume">' + (dn >= tot ? 'Xem kết quả' : 'Làm tiếp') + '</button><button data-act="ldrop">Bỏ bài này</button></div></div>';
  }
  h += '<div class="card"><h2 style="margin-top:0">' + IC('edit') + ' Nghe chép</h2>' +
    '<p>Nghe 5 câu, gõ lại, app tô chỗ nghe sai hoặc thiếu. Chọn câu từ các thẻ Thầy đã học trước.</p><button class="pri" data-act="ldict">Bắt đầu nghe chép</button></div>' +
    '<div class="card"><h2 style="margin-top:0">' + IC('link') + ' Nghe nối âm</h2>' +
    '<p>Nghe nhanh 5 câu có chỗ nối âm, nuốt âm (ví dụ get started nghe như “ge’ started”), rồi xem cách nối.</p><div class="row"><button class="pri" data-act="llia">Bắt đầu nghe nối âm</button><button data-act="lgenv">Dạng hay gặp: gonna, wanna…</button></div></div>';
  var hl = hoiList();
  h += '<h2>Nghe hội thoại ngắn</h2><p class="th">Nghe 2–4 lượt, rồi trả lời câu hỏi.</p><div class="list">' + (hl.map(function (x) {
    var st = S.l.dlg[x.id];
    return '<button class="item" data-act="ldlg" data-id="' + esc(x.id) + '">' + esc(x.ten) + (x.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') +
      (st ? '<span class="pill">tốt nhất ' + Math.min(st.best, x.qs.length) + '/' + x.qs.length + '</span>' : '') + '<small>' + esc(x.boicanh) + '</small></button>';
  }).join('') || '<p>Chưa có hội thoại. Bật “Hiện cả nội dung chưa duyệt” trong Cài đặt.</p>') + '</div>';
  h += '<p class="th" style="margin-top:10px">Đã hoàn thành: nghe chép ' + S.l.dict + ' bộ · nối âm ' + S.l.lia + ' bộ.</p>';
  if (!canSpeak) h += '<div class="warn">Trình duyệt này không đọc được tiếng Anh. Hãy mở bằng Safari trên iPhone.</div>';
  v.innerHTML = h;
}

function renderLgen(v) {
  var list = D.noiam_chung || [], h;
  if (!S.set.unrev) list = list.filter(function (x) { return x.duyet !== 'chua'; });
  var it = LG.open ? list.filter(function (x) { return x.id === LG.open; })[0] : null;
  if (it) {
    CUR.nf = it.full; CUR.nq = it.nhanh;
    h = '<button data-act="gback">← Danh sách</button><div class="card"><div class="tag">Nói nhanh, thân mật' + (it.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</div>' +
      '<div class="en" lang="en"><b>' + esc(it.viet) + '</b> → ' + esc(it.noi) + '</div><div class="vi">' + esc(it.vi) + '</div>' +
      '<div class="th">Câu đầy đủ:</div><div class="en" lang="en" style="font-size:1.15rem">' + esc(it.full) + '</div>' +
      '<button data-act="say" data-k="nf" data-r="normal">' + IC('volume') + ' Nghe câu đầy đủ</button>' +
      '<div class="th" style="margin-top:12px">Cách nói nhanh:</div><div class="en" lang="en" style="font-size:1.15rem">' + esc(it.nhanh) + '</div>' + speakBtns('nq') +
      '<div class="note">Chỉ để nghe hiểu. Khi viết email, thông báo hay nói trong lớp trang trọng, dùng dạng đầy đủ. Giọng máy có thể đọc “' + esc(it.noi) + '” không giống người thật.</div></div>';
  } else {
    h = '<button data-act="lmenu">← Luyện nghe</button><h1 style="margin-top:10px">Nối âm hay gặp</h1><div class="list">' + list.map(function (x) {
      return '<button class="item" data-act="gopen" data-id="' + esc(x.id) + '"><span lang="en">' + esc(x.viet) + ' → ' + esc(x.noi) + '</span><small>' + esc(x.vi) + '</small></button>';
    }).join('') + '</div>';
  }
  v.innerHTML = h;
}

function renderLx(v) {
  var L = S.ls, its = lsItems();
  if (!L || !its) { if (L) { S.ls = null; save(); } VIEW = 'listen'; renderListen(v); return; }
  var total = lsTotal(its), done = L.r.length >= total, h = '<button class="ghost" data-act="lexit">← Luyện nghe</button>';
  if (L.mode === 'dict') h += done && LXS.fb == null ? sumDict(L, its) : itemDict(L, its);
  else if (L.mode === 'lia') h += done ? sumLia(L, its) : itemLia(L, its);
  else h += done && LXS.fb == null ? sumDlg(L, its[0]) : itemDlg(L, its[0]);
  v.innerHTML = h;
}

function itemDict(L, its) {
  var idx = LXS.fb != null ? LXS.fb : L.r.length, c = its[idx], n = its.length;
  CUR.dx = c.en;
  var h = stepBarN(n, LXS.fb != null ? idx + 1 : idx, idx) + '<div class="tag">Nghe chép · câu ' + (idx + 1) + '/' + n + '</div>' +
    '<div class="card"><p>Nghe rồi gõ lại câu Thầy nghe được. Không cần viết hoa hay dấu câu.</p>' + speakBtns('dx') +
    '<div class="th">Câu có ' + plain(c.en).replace(/-/g, ' ').split(/\s+/).filter(Boolean).length + ' từ.</div>';
  if (LXS.fb == null) {
    h += '<textarea id="dt" rows="3" maxlength="400" lang="en" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Gõ câu tiếng Anh nghe được" placeholder="Gõ câu nghe được…"></textarea>' +
      '<button class="pri big" style="margin-top:10px" data-act="dcheck">Kiểm tra</button>';
  } else {
    var d = LXS.d, pct = Math.round(L.r[idx] * 100);
    if (d) h += '<div class="vi"><b>' + d.hit + '/' + d.total + ' từ đúng (' + pct + '%)</b></div><div class="en" lang="en">' + diffHTML(d) + '</div>' +
      '<div class="th">Từ <span class="w-miss">gạch chân đậm</span> là chỗ nghe sai hoặc thiếu.</div>' +
      (d.extra.length ? '<div class="note">Từ Thầy gõ thừa hoặc sai: <span lang="en">' + esc(d.extra.join(' ')) + '</span></div>' : '');
    else h += '<div class="en" lang="en">' + stress(c.en) + '</div>';
    h += '<div class="vi">' + esc(c.vi) + '</div>' + (c.noiam ? '<div class="note">Nối âm: ' + esc(c.noiam) + '</div>' : '') + (c.loi ? '<div class="note">Lỗi hay mắc: ' + esc(c.loi) + '</div>' : '') +
      '<button class="pri big" style="margin-top:10px" data-act="lnext">' + (idx + 1 < n ? 'Câu kế' : 'Xem kết quả') + '</button>';
  }
  return h + '</div>';
}
function sumDict(L, its) {
  var sum = 0; L.r.forEach(function (x) { sum += x; });
  var avg = L.r.length ? Math.round(sum / L.r.length * 100) : 0;
  return '<h1>Xong bộ nghe chép</h1><div class="card"><p>Đúng trung bình: <b>' + avg + '%</b></p>' + its.map(function (c, i) {
    return '<p><span lang="en">' + esc(plain(c.en)) + '</span> — <b>' + Math.round((L.r[i] || 0) * 100) + '%</b></p>';
  }).join('') + '<p class="th">Câu dưới 100% nên nghe lại ở tốc độ chậm rồi nhanh.</p></div>' +
    '<button class="pri big" data-act="ldict">Làm bộ khác</button><button class="ghost" style="margin-top:10px;width:100%" data-act="lexit">Về Luyện nghe</button>';
}

function itemLia(L, its) {
  var idx = L.r.length, c = its[idx], n = its.length;
  CUR.lx = c.en;
  var h = stepBarN(n, idx, idx) + '<div class="tag">Nghe nối âm · câu ' + (idx + 1) + '/' + n + '</div><div class="card">' +
    '<p>Nghe nhanh vài lần, chưa nhìn chữ. Thầy nghe ra được mấy từ?</p>' + speakBtns('lx');
  if (!LXS.rev) h += '<button class="pri big" style="margin-top:10px" data-act="lshow2">Hiện chữ và cách nối</button>';
  else h += '<div class="en" lang="en">' + markPhrase(c) + '</div><div class="note">Cách nối: ' + esc(c.noiam) + '</div><div class="vi">' + esc(c.vi) + '</div>' +
    '<div class="th">Nghe lại thêm một lần, chú ý chỗ tô vàng.</div>' +
    '<div class="row"><button data-act="lrate" data-ok="0">Chưa nghe ra</button><button class="pri" data-act="lrate" data-ok="1">Nghe ra rồi</button></div>';
  return h + '</div>';
}
function sumLia(L, its) {
  var ok = 0; L.r.forEach(function (x) { if (x >= 1) ok++; });
  var miss = its.filter(function (c, i) { return !(L.r[i] >= 1); });
  return '<h1>Xong bộ nghe nối âm</h1><div class="card"><p>Nghe ra: <b>' + ok + '/' + its.length + '</b> câu</p>' +
    (miss.length ? '<p class="th">Nên nghe lại:</p>' + miss.map(function (c) { return '<p><span lang="en">' + esc(plain(c.en)) + '</span><br><small>' + esc(c.noiam) + '</small></p>'; }).join('') : '<p>Tốt lắm, nghe ra hết.</p>') + '</div>' +
    '<button class="pri big" data-act="llia">Làm bộ khác</button><button class="ghost" style="margin-top:10px;width:100%" data-act="lexit">Về Luyện nghe</button>';
}

function audioBar(d) {
  var h = '<div class="card"><div class="tag">' + esc(d.ten) + (d.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</div><p class="th">' + esc(d.boicanh) + '</p>';
  if (!canSpeak) return h + '<div class="warn">Máy này không đọc được tiếng Anh. Hãy mở bằng Safari trên iPhone; tạm thời Thầy đọc lời thoại bên dưới.</div>' + transcript(d) + '</div>';
  function b(r, ic, nm) { return '<button data-act="sayd" data-r="' + r + '" aria-label="Nghe cả đoạn, ' + nm + '">' + IC(ic) + ' ' + nm.charAt(0).toUpperCase() + nm.slice(1) + '</button>'; }
  h += '<div class="speak">' + b('slow', 'turtle', 'chậm') + b('normal', 'volume', 'thường') + b('fast', 'bolt', 'nhanh') + '</div>';
  h += '<button class="ghost" data-act="lshowtext" aria-expanded="' + (LXS.show ? 'true' : 'false') + '">' + (LXS.show ? 'Ẩn lời thoại' : 'Xem lời thoại (nên nghe trước)') + '</button>';
  if (LXS.show) h += transcript(d);
  return h + '</div>';
}
function transcript(d) {
  return '<div style="margin-top:8px">' + d.lines.map(function (ln, i) {
    return '<p><b>' + esc(d.nguoi[ln.w] || ln.w) + ':</b> <span lang="en">' + esc(ln.en) + '</span> ' +
      (canSpeak ? '<button class="ghost" style="min-height:40px;padding:2px 10px" data-act="sayd" data-l="' + i + '" data-r="normal" aria-label="Nghe lượt ' + (i + 1) + '">' + IC('volume') + '</button>' : '') +
      '<br><small class="th">' + esc(ln.vi) + '</small></p>';
  }).join('') + '</div>';
}
function itemDlg(L, d) {
  var n = d.qs.length, qi = LXS.fb != null ? LXS.fb : L.r.length, q = d.qs[qi], pick = L.r[qi];
  var h = stepBarN(n, LXS.fb != null ? qi + 1 : qi, qi) + audioBar(d) + '<div class="tag">Câu hỏi ' + (qi + 1) + '/' + n + '</div><div class="card">' +
    '<div class="en" lang="en" style="font-size:1.25rem">' + esc(q.q) + '</div><div class="th">' + esc(q.qvi) + '</div>';
  q.o.forEach(function (o, i) {
    var cls = 'opt', mark = '';
    if (LXS.fb != null) { if (i === q.a) { cls += ' right'; mark = ' (đúng)'; } else if (i === pick) { cls += ' wrong'; mark = ' (Thầy chọn, chưa đúng)'; } }
    h += '<button class="' + cls + '" data-act="dpick" data-i="' + i + '"' + (LXS.fb != null ? ' disabled' : '') + ' lang="en">' + 'ABC'.charAt(i) + '. ' + esc(o) + '<span class="sr">' + mark + '</span>' + (mark ? '<span aria-hidden="true">' + (i === q.a ? ' ✓' : ' ✗') + '</span>' : '') + '</button>';
  });
  if (LXS.fb != null) h += '<div class="note">' + esc(q.ex) + '</div><button class="pri big" style="margin-top:10px" data-act="lnext">' + (qi + 1 < n ? 'Câu kế' : 'Xem kết quả') + '</button>';
  return h + '</div>';
}
function sumDlg(L, d) {
  var sc = 0; d.qs.forEach(function (q, i) { if (L.r[i] === q.a) sc++; });
  return '<h1>Xong bài hội thoại</h1><div class="card"><div class="tag">' + esc(d.ten) + '</div><p>Đúng: <b>' + sc + '/' + d.qs.length + '</b></p>' +
    d.qs.map(function (q, i) {
      var good = L.r[i] === q.a;
      return '<p><span aria-hidden="true">' + (good ? '✓' : '✗') + '</span> <span lang="en">' + esc(q.q) + '</span><br><small>' + (good ? 'Đúng' : 'Chưa đúng, đáp án: ') + (good ? '' : '<span lang="en">' + esc(q.o[q.a]) + '</span>') + '</small></p>';
    }).join('') + '</div>' +
    (canSpeak ? '<div class="card"><div class="tag">Nghe lại cả đoạn</div><div class="speak"><button data-act="sayd" data-r="slow">' + IC('turtle') + ' Chậm</button><button data-act="sayd" data-r="normal">' + IC('volume') + ' Thường</button><button data-act="sayd" data-r="fast">' + IC('bolt') + ' Nhanh</button></div></div>' : '') +
    '<div class="card"><div class="tag">Lời thoại và nghĩa Việt</div>' + transcript(d) + '</div>' +
    '<button class="pri big" data-act="ldlg" data-id="' + esc(d.id) + '">Làm lại bài này</button><button class="ghost" style="margin-top:10px;width:100%" data-act="lexit">Về Luyện nghe</button>';
}

// ---------- luyện nói (giai đoạn 3: phản xạ, nói đuổi, ghép câu, đọc đoạn dài) ----------
// SP = phiên đang chạy: m (kiểu), q (các mục), i (lượt), ph (pha: think/listen/d1–d3/talk/wait/rev/sum), s/j (bước và câu của đoạn dài).
// Phiên dở lưu ở S.sp (id các mục + vị trí) để tải lại vẫn làm tiếp.
var SP = null, SPT = null, spAudio = null, spToken = 0;
var SP_N = 5, SP_SEC = 5, SP_SEC_GC = 8, SP_MAXMS = 60000, SP_MAXMS_DL = 90000;
var spAudioUrl = '', spAuto = null;
var SPN = { rx: 'Phản xạ', sh: 'Nói đuổi', gc: 'Ghép câu', dl: 'Đọc đoạn dài', nv: 'Nhập vai' };
var SPK = { rx: ['rx', 'rxOk'], sh: ['sh', 'shOk'], gc: ['gc', 'gcOk'], dl: ['dl', 'dlOk'], nv: ['nv', 'nvOk'] };
function spStopAudio() { if (spAudio) { try { spAudio.pause(); } catch (e) { /* bỏ qua */ } spAudio = null; } if (spAudioUrl) { try { URL.revokeObjectURL(spAudioUrl); } catch (e) { /* bỏ qua */ } spAudioUrl = ''; } }
function spRevoke() { if (SP && SP.url) { try { URL.revokeObjectURL(SP.url); } catch (e) { /* bỏ qua */ } SP.url = ''; } }
function spLeave() {
  spToken++;
  if (SPT) { clearInterval(SPT); SPT = null; }
  if (spAuto) { clearTimeout(spAuto); spAuto = null; }
  spStopAudio(); spRevoke();
  if (window.NOI) NOI.cancel();
  SP = null;
}
// Khung ghép câu và đoạn dài: làm sạch dữ liệu rồi đổi sang dạng "mục" có en/vi như thẻ câu.
function mauList() {
  var a = (D.mau || []).filter(function (x) { return isObj(x) && ID_RE.test(String(x.id)) && typeof x.khung === 'string' && Array.isArray(x.mau) && x.mau.length && typeof x.mau[0] === 'string'; });
  if (!S.set.unrev) a = a.filter(function (x) { return x.duyet !== 'chua'; });
  return a.map(function (x) { return { id: String(x.id), en: x.mau[0], mau: x.mau.map(String), khung: x.khung, tinhhuong: String(x.tinhhuong || ''), goiy: Array.isArray(x.goiy) ? x.goiy.map(String) : [], vi: String(x.vi || ''), nhom: x.nhom, duyet: x.duyet }; });
}
function doanList() {
  var a = (D.doan || []).filter(function (x) { return isObj(x) && ID_RE.test(String(x.id)) && Array.isArray(x.s) && x.s.length && x.s.every(function (t) { return isObj(t) && typeof t.en === 'string'; }); });
  if (!S.set.unrev) a = a.filter(function (x) { return x.duyet !== 'chua'; });
  return a.map(function (x) {
    return { id: String(x.id), ten: String(x.ten || x.id), chude: String(x.chude || ''), sents: x.s.map(function (t) { return { en: t.en, vi: String(t.vi || '') }; }),
      en: x.s.map(function (t) { return t.en; }).join(' '), vi: x.s.map(function (t) { return t.vi || ''; }).join(' '), ghichu: String(x.ghichu || ''), duyet: x.duyet };
  });
}
function wordCount(t) { return plain(t).replace(/\[|\]/g, '').replace(/-/g, ' ').split(/\s+/).filter(Boolean).length; }
function estSecs(t) { return Math.max(5, Math.round(wordCount(t) / 130 * 60)); }   // ước lượng: khoảng 130 từ/phút ở tốc độ thường
function phMark(s) { return esc(s).replace(/\[([^\]]*)\]/g, '<mark>[$1]</mark>'); }   // chỗ [ ] Thầy tự điền
function spPool(m) {
  var a = allCards();
  if (m === 'rx') { var w = a.filter(function (c) { return c.tinhhuong || c.vi; }); return w.length ? w : a; }
  if (m === 'gc') return mauList();
  if (m === 'dl') return doanList();
  if (m === 'nv') return window.NV ? NV.list(D.tinhhuong, S.set.unrev) : [];
  return a;
}
function spItem(m, id) { return spPool(m).filter(function (c) { return c.id === id; })[0] || null; }
function spPh0(m) { return m === 'rx' || m === 'gc' ? 'think' : m === 'sh' ? 'listen' : 'd1'; }
function spPersist() {      // nhớ phiên dở để tải lại vẫn làm tiếp
  if (!SP || SP.ph === 'sum') S.sp = null;
  else {
    S.sp = { m: SP.m, q: SP.q.map(function (c) { return c.id; }), i: SP.i, s: SP.s || 1, j: SP.j || 0 };
    if (SP.m === 'nv') { var pz = NV.persist(SP); S.sp.t = pz.t; S.sp.p = pz.p; S.sp.h = pz.h; S.sp.k = pz.k; }
  }
  save();
}
function spBuild(m, q, i, s, j, r) {
  var jj = m === 'dl' ? Math.min(Math.max(0, j), q[0].sents.length - 1) : 0, ss = m === 'dl' ? s : 1;
  SP = { m: m, q: q, i: i, s: ss, j: jj, ph: m === 'dl' ? 'd' + ss : spPh0(m), cnt: m === 'gc' ? SP_SEC_GC : SP_SEC, heard: '', url: '', rec: false, asr: false, msg: '', ok: 0, n: 0, secs: 0 };
  if (m === 'nv') NV.init(SP, q[0], r);
  spPersist(); VIEW = 'sx'; render(); window.scrollTo(0, 0);
  if (SP.ph === 'think') spTick();
  nvAuto();
}
function nvAuto() { if (SP && SP.m === 'nv' && SP.ph === 'nva') say(NV.curEn(SP), 'normal'); }   // người kia tự nói khi tới lượt (sau một thao tác của Thầy)
function startSpeak(m, id) {
  if (!SPN[m] || (m === 'nv' && !window.NV)) return;
  var pool = spPool(m);
  if (!pool.length) { alert('Chưa có nội dung để luyện nói. Bật “Hiện cả nội dung chưa duyệt” trong Cài đặt.'); return; }
  if (S.sp && resumeItems() && !confirm('Bỏ bài nói đang dở để làm bài mới?')) return;
  var q;
  if (m === 'dl' || m === 'nv') { var it = pool.filter(function (x) { return x.id === id; })[0]; if (!it) return; q = [it]; }
  else q = pickSet(pool, SP_N);
  spLeave();
  spBuild(m, q, 0, 1, 0);
}
function resumeItems() {      // các mục của phiên dở; null nếu không còn khớp nội dung
  var r = S.sp; if (!r) return null;
  var q = r.q.map(function (id) { return spItem(r.m, id); });
  return q.every(Boolean) ? q : null;
}
function resumeSpeak() {
  var r = S.sp, q = resumeItems();
  if (!r) return;
  if (!q) { S.sp = null; save(); alert('Phiên nói đang dở không còn khớp với nội dung hiện có nên đã được bỏ.'); render(); return; }
  spLeave(); spBuild(r.m, q, r.i, r.s, r.j, r);
}
function spTick() {
  if (SPT) clearInterval(SPT);
  var my = spToken;
  SPT = setInterval(function () {
    if (my !== spToken || !SP || SP.ph !== 'think') { clearInterval(SPT); SPT = null; return; }
    SP.cnt = Math.max(0, SP.cnt - 1);
    var el = $('#cnt'); if (el) el.textContent = String(SP.cnt);
    var tx = $('#cnttxt'); if (tx) tx.textContent = SP.cnt > 0 ? 'giây để nghĩ' : 'Hết giờ nghĩ — bấm nút để nói';
    if (SP.cnt <= 0) { clearInterval(SPT); SPT = null; }
  }, 1000);
}
function spClock() {      // đồng hồ đếm lên khi đọc cả đoạn
  if (SPT) clearInterval(SPT);
  var my = spToken, sp = SP;
  SPT = setInterval(function () {
    if (my !== spToken || SP !== sp || sp.ph !== 'talk') { clearInterval(SPT); SPT = null; return; }
    var el = $('#clk'); if (el) el.textContent = String(Math.round((Date.now() - sp.t0) / 1000));
  }, 1000);
}
function spBegin() {       // bắt đầu nói: ghi âm + nhận giọng (nếu bật và máy hỗ trợ)
  if (!SP || ['think', 'listen', 'd3', 'nvc'].indexOf(SP.ph) < 0 || (SP.ph === 'nvc' && !NV.canSpeakNow(SP))) return;
  if (SPT) { clearInterval(SPT); SPT = null; }
  if (canSpeak) { try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } }
  spStopAudio();
  var my = ++spToken, sp = SP;
  sp.ph = 'talk'; sp.heard = ''; sp.msg = ''; sp.stopped = false; sp.t0 = Date.now(); spRevoke(); render();
  var armed = false, arm = function () {    // đồng hồ và hẹn tự dừng chỉ chạy từ lúc micro đã sẵn sàng (không tính thời gian chờ bấm Cho phép)
    if (armed || SP !== sp || my !== spToken || sp.ph !== 'talk') return; armed = true; sp.t0 = Date.now();
    if (sp.m === 'dl') spClock();
    if (spAuto) clearTimeout(spAuto); spAuto = setTimeout(function () { if (SP === sp && sp.ph === 'talk') spStop(); }, sp.m === 'dl' ? SP_MAXMS_DL : SP_MAXMS);   // tự dừng sau 60 giây (đoạn dài: 90 giây)
  };
  if (!window.NOI) { arm(); return; }
  var want = { rec: !!(S.set.rec && NOI.canRec), asr: !!(S.set.asr && NOI.canAsr) };
  NOI.start(want, function (t) {
    if (my !== spToken || SP !== sp) return;
    sp.heard = t; var el = $('#heard'); if (el) el.textContent = t || '…';
  }).then(function (r) {
    if (my !== spToken || SP !== sp) return;
    sp.rec = r.rec; sp.asr = r.asr; arm();
    if (want.rec && !r.rec) sp.msg = 'Không ghi âm được. Thầy cứ nói to, rồi tự so với câu mẫu.';
    var el = $('#talkmsg'); if (el) el.textContent = sp.msg || (r.rec ? 'Đang ghi âm…' : 'Thầy nói to nhé…');
  }, function (er) {
    if (my !== spToken || SP !== sp || sp.stopped) return;
    sp.msg = er && er.code === 'denied' ? 'Máy chưa cho dùng micro, nên chỉ nói rồi tự đối chiếu. (Bật micro cho trang này trong cài đặt trình duyệt nếu muốn ghi âm.)' :
      er && er.code === 'nomic' ? 'Không tìm thấy micro, nên chỉ nói rồi tự đối chiếu.' : 'Không ghi âm được, nên chỉ nói rồi tự đối chiếu.';
    var el = $('#talkmsg'); if (el) el.textContent = sp.msg;
    var hd = $('#heard'); if (hd) { if (hd.previousElementSibling) hd.previousElementSibling.remove(); hd.remove(); }
    arm();
  });
}
function spStop() {
  if (!SP || SP.ph !== 'talk') return;
  var sp = SP, c = sp.q[sp.i], my = spToken;
  sp.stopped = true; sp.ph = 'wait'; sp.secs = Math.max(1, Math.round((Date.now() - (sp.t0 || Date.now())) / 1000));
  if (SPT) { clearInterval(SPT); SPT = null; }
  if (spAuto) { clearTimeout(spAuto); spAuto = null; } render();
  var fin = function (res) {
    if (SP !== sp || my !== spToken) return;
    sp.heard = res.text || sp.heard || '';
    if (!sp.msg) { if (res.empty && S.set.rec) sp.msg = 'Bản ghi bị trống (có thể micro không thu được). Thầy tự so với câu mẫu.'; else if (!sp.heard && res.asrErr) sp.msg = 'Máy không hiện được chữ lần này. Thầy tự nghe lại và so với câu mẫu.'; }
    if (res.blob) {
      try { sp.url = URL.createObjectURL(res.blob); } catch (e) { sp.url = ''; }
      if (window.NOI && NOI.canStore && S.set.rec) NOI.save({ ts: Date.now(), cid: c.id, en: plain(sp.m === 'nv' ? NV.curEn(sp) : c.en), m: sp.m, mime: res.mime, blob: res.blob }).catch(function () { /* không lưu được thì thôi */ });
    }
    sp.ph = 'rev'; render();
  };
  if (window.NOI) NOI.stop().then(fin, function () { fin({ blob: null, text: '' }); }); else fin({ blob: null, text: '' });
}
function spRate(ok) {
  if (!SP || SP.ph !== 'rev') return;
  var sp = SP; if (sp.m !== 'nv') { sp.n++; if (ok) sp.ok++; }
  var k = SPK[sp.m]; S.n[k[0]]++; if (ok) S.n[k[1]]++;
  spStopAudio(); spRevoke(); if (canSpeak) { try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } } sp.heard = ''; spToken++;
  if (sp.m === 'nv') NV.rated(sp, ok);
  else {
    sp.i++;
    if (sp.i >= sp.q.length) sp.ph = 'sum';
    else { sp.ph = spPh0(sp.m); sp.cnt = sp.m === 'gc' ? SP_SEC_GC : SP_SEC; }
  }
  spPersist(); render(); window.scrollTo(0, 0);
  if (sp.ph === 'think') spTick();
  nvAuto();
}
function spPlayModel(r) { spStopAudio(); if (SP) say(SP.m === 'nv' ? NV.curEn(SP) : SP.q[SP.i].en, r); }
// Đọc nhiều câu liền nhau (đoạn dài): chia từng câu để trình duyệt không cắt giữa chừng.
function sayChain(texts, mode) {
  if (!canSpeak) return;
  var tok = spToken;
  try {
    var sp = speechSynthesis, busy = sp.speaking || sp.pending;
    if (busy) sp.cancel();
    var run = function () {
      try {
        if (VIEW !== 'sx' || tok !== spToken) return;
        sp.resume();
        texts.forEach(function (t) {
          var u = new SpeechSynthesisUtterance(ttsText(t));
          u.lang = 'en-US'; u.rate = RATE[mode] || 1;
          var v = chosenVoice(); if (v) u.voice = v;
          sp.speak(u);
        });
      } catch (e) { /* bỏ qua */ }
    };
    if (busy) setTimeout(run, 80); else run();
  } catch (e) { /* bỏ qua */ }
}
function spPlayMine() {
  if (!SP || !SP.url) return;
  if (canSpeak) { try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } }
  spStopAudio();
  try { spAudio = new Audio(SP.url); var pr = spAudio.play(); if (pr && pr.catch) pr.catch(function () { alert('Máy không phát được bản ghi này.'); }); } catch (e) { /* bỏ qua */ }
}
function playRec(id) {
  if (!(id >= 0) || !window.NOI) return;
  var tok = spToken;
  NOI.get(id).then(function (r) {
    if (tok !== spToken || VIEW !== 'speak') return;
    if (!r || !r.blob) { alert('Bản ghi này không còn.'); return; }
    spStopAudio();
    spAudioUrl = URL.createObjectURL(r.blob);
    spAudio = new Audio(spAudioUrl);
    var pr = spAudio.play(); if (pr && pr.catch) pr.catch(function () { spStopAudio(); alert('Máy không phát được bản ghi này.'); });
  }, function () { alert('Không mở được bản ghi.'); });
}
function fmtTs(ts) { var d = new Date(ts); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
// So chữ máy nghe với câu mẫu; ghép câu có nhiều cách đúng nên lấy câu mẫu gần nhất.
function spDiff(c, heard) {
  var cand = (c.mau || [c.en]).map(function (t) { return String(t).replace(/\[[^\]]*\]/g, ' '); }), best = null, mx = c.sents ? 400 : 60;
  cand.forEach(function (t) { var d = diffWords(t, heard, mx); if (!best || d.score > best.score) best = d; });
  return best;
}
function renderSpeak(v) {
  var N = window.NOI || {};
  var h = '<h1>Luyện nói</h1><p class="th">Không chấm đúng sai. Thầy nói to, nghe lại giọng mình cạnh giọng mẫu, rồi tự đánh giá.</p>';
  if (S.sp) {
    var rq = resumeItems();
    if (rq) h += '<div class="card"><div class="tag">Bài nói đang dở</div><p><b>' + esc(SPN[S.sp.m]) + '</b>' + ((S.sp.m === 'dl' || S.sp.m === 'nv') ? ': ' + esc(rq[0].ten) : ' · lượt ' + (S.sp.i + 1) + '/' + rq.length) + '</p><div class="row"><button class="pri" data-act="sresume">Làm tiếp</button><button data-act="sdrop">Bỏ bài này</button></div></div>';
    else { S.sp = null; save(); h += '<div class="warn">Bài nói đang dở không còn khớp với nội dung hiện có (có thể do Thầy vừa tắt “Hiện cả nội dung chưa duyệt”), nên đã được bỏ.</div>'; }
  }
  h += '<div class="card"><div class="tag">Phản xạ</div><p>Đọc tình huống tiếng Việt, nghĩ 5 giây, rồi nói câu tiếng Anh. Xem câu mẫu để so.</p><button class="pri big" data-act="sstart" data-m="rx">Bắt đầu phản xạ (5 câu)</button></div>' +
    '<div class="card"><div class="tag">Nói đuổi (shadowing)</div><p>Nghe câu mẫu, rồi nói lặp lại ngay, bắt chước nhịp và trọng âm.</p><button class="pri big" data-act="sstart" data-m="sh">Bắt đầu nói đuổi (5 câu)</button></div>' +
    '<div class="card"><div class="tag">Ghép câu từ mẫu</div><p>Có khung câu với chỗ trống ___ và vài từ gợi ý. Thầy tự chọn từ điền vào và nói cả câu.</p><button class="pri big" data-act="sstart" data-m="gc">Bắt đầu ghép câu (5 khung)</button></div>';
  var dl = doanList();
  h += '<div class="card"><div class="tag">Đọc đoạn dài (30–60 giây)</div><p>Ba bước: nghe mẫu cả đoạn, đọc thử từng câu, rồi đọc cả đoạn có đồng hồ và ghi âm.</p><div class="list">' +
    (dl.map(function (x) {
      return '<button class="item" data-act="sstart" data-m="dl" data-id="' + esc(x.id) + '">' + esc(x.ten) + (x.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '<small>' + esc(x.chude) + ' · ' + x.sents.length + ' câu · mẫu khoảng ' + estSecs(x.en) + ' giây</small></button>';
    }).join('') || '<p class="th">Chưa có đoạn nào. Bật “Hiện cả nội dung chưa duyệt” trong Cài đặt.</p>') + '</div></div>' +
    '<p class="th">Đã luyện: phản xạ ' + S.n.rx + ' lượt (' + S.n.rxOk + ' “được”), nói đuổi ' + S.n.sh + ' lượt (' + S.n.shOk + ' “được”), ghép câu ' + S.n.gc + ' lượt (' + S.n.gcOk + ' “được”), đọc đoạn dài ' + S.n.dl + ' lượt (' + S.n.dlOk + ' “được”), nhập vai ' + S.n.nv + ' lượt (' + S.n.nvOk + ' “được”).</p>';
  if (!canSpeak) h += '<div class="warn">Trình duyệt này không đọc được tiếng Anh nên không có giọng mẫu. Thầy mở bằng Safari trên iPhone.</div>';
  if (!S.set.rec) h += '<div class="warn">Ghi âm đang tắt (Cài đặt). Thầy vẫn luyện được bằng cách nói to rồi tự so.</div>';
  else if (!N.canRec) h += '<div class="warn">Trình duyệt này không ghi âm được. Thầy vẫn luyện được bằng cách nói to rồi tự so.</div>';
  if (S.set.asr && !N.canAsr) h += '<div class="warn">Trình duyệt này không tự hiện chữ khi Thầy nói. Thầy vẫn tự nghe và so với câu mẫu.</div>';
  if (S.set.asr && N.canAsr) h += '<div class="th">Khi hiện chữ Thầy vừa nói, trình duyệt có thể gửi âm thanh cho Apple/Google để nhận dạng. Tắt ở Cài đặt nếu không muốn.</div>';
  h += '<h2>Bản ghi gần đây</h2><div id="reclist" class="list"><p class="th">Đang tải…</p></div>' +
    '<p class="th">Bản ghi chỉ nằm trong máy này, tự xoá sau ' + (N.days || 7) + ' ngày, không có trong file sao lưu.</p>';
  v.innerHTML = h;
  if (N.canStore) {
    var tok = spToken;
    NOI.sweep().then(function (a) {
      var el = $('#reclist'); if (!el || VIEW !== 'speak' || tok !== spToken) return;
      el.innerHTML = a.slice(0, 10).map(function (r) {
        return '<button class="item" data-act="playrec" data-id="' + Number(r.id) + '">' + IC('play') + ' <span lang="en">' + esc(String(r.en || '').slice(0, 90)) + '</span><small>' + esc(fmtTs(r.ts)) + ' · ' + esc(String(SPN[r.m] || 'nói').toLowerCase()) + '</small></button>';
      }).join('') || '<p class="th">Chưa có bản ghi nào.</p>';
    }, function () { var el = $('#reclist'); if (el) el.innerHTML = '<p class="th">Máy này không lưu được ghi âm.</p>'; });
  } else $('#reclist').innerHTML = '<p class="th">Máy này không lưu được ghi âm.</p>';
}
function speakBtnsSp(act) {
  act = act || 'smodel';
  function b(r, ic, name) { return '<button data-act="' + act + '" data-r="' + r + '" aria-label="Nghe ' + name + '">' + IC(ic) + ' ' + name.charAt(0).toUpperCase() + name.slice(1) + '</button>'; }
  return '<div class="speak">' + b('slow', 'turtle', 'chậm') + b('normal', 'volume', 'thường') + b('fast', 'bolt', 'nhanh') + '</div>';
}
function nvHelpers() {
  var N = window.NOI || {};
  return { phMark: phMark, speakBtnsSp: speakBtnsSp, canSpeak: canSpeak, stepBarN: stepBarN, asr: !!(S.set.asr && N.canAsr), n: S.n, rec: !!(S.set.rec && N.canRec),
    diff: function (text, heard) { return diffHTML(spDiff({ en: text }, heard)); } };
}
function renderNvm(v) {
  var res = '';
  if (S.sp && S.sp.m === 'nv') {
    var rq = resumeItems();
    if (rq) res = '<div class="card"><div class="tag">Tình huống đang dở</div><p><b>' + esc(rq[0].ten) + '</b></p><div class="row"><button class="pri" data-act="sresume">Làm tiếp</button><button data-act="sdrop">Bỏ bài này</button></div></div>';
    else { S.sp = null; save(); res = '<div class="warn">Tình huống đang dở không còn khớp với nội dung hiện có (có thể do Thầy vừa tắt “Hiện cả nội dung chưa duyệt”), nên đã được bỏ.</div>'; }
  }
  v.innerHTML = window.NV ? NV.menu(spPool('nv'), Object.assign(nvHelpers(), { resume: res })) : '<div class="warn">Không nạp được phần Nhập vai.</div>';
}
function khungHTML(k) { return esc(k).split('___').join('<mark>___</mark>'); }
function renderSx(v) {
  var sp = SP;
  if (!sp) { VIEW = 'speak'; renderSpeak(v); return; }
  if (sp.m === 'nv') { v.innerHTML = NV.view(sp, nvHelpers()); return; }
  var name = SPN[sp.m];
  var h = '<button class="ghost" data-act="sexit">← Luyện nói</button>';
  if (sp.ph === 'sum') {
    var again = sp.m === 'dl' ? '<button class="pri big" data-act="sexit">Chọn đoạn khác</button>' : '<button class="pri big" data-act="sstart" data-m="' + sp.m + '">Làm bộ khác</button>';
    v.innerHTML = h + '<h1>Xong ' + name.toLowerCase() + '</h1><div class="card"><p>Thầy tự đánh giá “được” ' + sp.ok + ' / ' + sp.n + ' lượt.</p><p class="th">Không có điểm đúng sai; quan trọng là nói to đều đặn mỗi ngày. ' + (sp.m === 'rx' || sp.m === 'sh' ? 'Câu nào “chưa được”, Thầy mở Thẻ câu để nghe lại.' : 'Muốn luyện tiếp, Thầy mở lại bài này.') + '</p></div>' +
      again + (sp.m === 'dl' ? '' : '<button class="ghost" style="margin-top:10px;width:100%" data-act="sexit">Về Luyện nói</button>');
    return;
  }
  var c = sp.q[sp.i], N = window.NOI || {}, isDl = sp.m === 'dl';
  h += (isDl ? stepBarN(3, sp.s - 1, sp.s - 1) : stepBarN(sp.q.length, sp.i, sp.i)) +
    '<div class="card"><div class="tag">' + name + ' · ' + (isDl ? esc(c.ten) : 'lượt ' + (sp.i + 1) + '/' + sp.q.length) + (c.duyet === 'chua' ? '<span class="badge">Chưa duyệt</span>' : '') + '</div>';
  if (sp.ph === 'think') {
    if (sp.m === 'gc') {
      h += '<div class="vi">' + esc(c.tinhhuong) + '</div><div class="en" lang="en">' + khungHTML(c.khung) + '</div>' +
        (c.goiy.length ? '<div class="th">' + (canSpeak ? 'Từ gợi ý (bấm để nghe):' : 'Từ gợi ý (máy này không đọc được tiếng Anh nên không nghe được):') + '</div><div class="row">' + c.goiy.map(function (g, k) { return '<button data-act="ghint" data-w="' + k + '" lang="en">' + esc(g) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="th" style="text-align:center"><b id="cnt" style="font-size:2.4rem;color:var(--pri)">' + sp.cnt + '</b><div id="cnttxt">' + (sp.cnt > 0 ? 'giây để nghĩ' : 'Hết giờ nghĩ — bấm nút để nói') + '</div></div>' +
        '<button class="pri big" data-act="sbegin">' + IC('mic') + ' Bắt đầu nói</button>';
    } else {
      h += '<div class="en" style="font-size:1.2rem">Hãy nói bằng tiếng Anh:</div><div class="vi">' + esc(c.tinhhuong || c.vi) + '</div>' +
        '<div class="th" style="text-align:center"><b id="cnt" style="font-size:2.4rem;color:var(--pri)">' + sp.cnt + '</b><div id="cnttxt">' + (sp.cnt > 0 ? 'giây để nghĩ' : 'Hết giờ nghĩ — bấm nút để nói') + '</div></div>' +
        '<button class="pri big" data-act="sbegin">' + IC('mic') + ' Bắt đầu nói</button>';
    }
  } else if (sp.ph === 'listen') {
    h += '<div class="en" lang="en">' + stress(c.en) + '</div><div class="vi">' + esc(c.vi) + '</div>' + (canSpeak ? speakBtnsSp() : '') +
      '<p class="th">Nghe vài lần, rồi bấm nói theo ngay sau khi nghe, bắt chước nhịp và từ nhấn (chữ đậm).</p>' +
      '<button class="pri big" data-act="sbegin">' + IC('mic') + ' Nói theo</button>';
  } else if (sp.ph === 'd1') {
    h += '<div class="tag">Bước 1/3 · Nghe mẫu cả đoạn</div><div class="en" lang="en" style="font-size:1.1rem">' + c.sents.map(function (t) { return '<p>' + phMark(t.en) + '</p>'; }).join('') + '</div>' +
      (canSpeak ? '<div class="th">Nghe cả đoạn:</div>' + speakBtnsSp('dmodel') : '<div class="warn">Máy này không đọc được tiếng Anh nên không có giọng mẫu.</div>') +
      '<div class="th">Đọc ở tốc độ thường khoảng ' + estSecs(c.en) + ' giây (ước lượng).</div>' +
      (c.ghichu ? '<div class="note">' + esc(c.ghichu) + '</div>' : '') +
      (c.en.indexOf('[') >= 0 ? '<div class="note">Chỗ <mark>[ ]</mark> là chỗ Thầy thay bằng thông tin của mình khi nói.</div>' : '') +
      '<button class="pri big" data-act="dstep" data-to="2">Sang bước 2: từng câu</button>';
  } else if (sp.ph === 'd2') {
    var t = c.sents[sp.j] || c.sents[0], last = sp.j >= c.sents.length - 1;
    h += '<div class="tag">Bước 2/3 · Từng câu (' + (sp.j + 1) + '/' + c.sents.length + ')</div><div class="en" lang="en">' + phMark(t.en) + '</div><div class="vi">' + esc(t.vi) + '</div>' +
      (canSpeak ? speakBtnsSp('dsent') : '') +
      '<p class="th">Nghe, rồi đọc to câu này vài lần. Bước này không ghi âm.</p>' +
      '<div class="row"><button data-act="dstep" data-to="jp"' + (sp.j <= 0 ? ' disabled' : '') + '>← Câu trước</button>' + (last ? '' : '<button class="pri" data-act="dstep" data-to="jn">Câu sau →</button>') + '</div>' +
      (last ? '<button class="pri big" style="margin-top:10px" data-act="dstep" data-to="3">Sang bước 3: cả đoạn</button>' : '') +
      '<button class="ghost" style="margin-top:10px;width:100%" data-act="dstep" data-to="1">← Về bước 1</button>';
  } else if (sp.ph === 'd3') {
    h += '<div class="tag">Bước 3/3 · Đọc cả đoạn</div><div class="en" lang="en" style="font-size:1.1rem">' + c.sents.map(function (x) { return '<p>' + phMark(x.en) + '</p>'; }).join('') + '</div>' +
      '<p class="th">Bấm Bắt đầu đọc, đọc to cả đoạn, rồi bấm Đọc xong. Máy tự dừng sau ' + (SP_MAXMS_DL / 1000) + ' giây.</p>' +
      '<button class="pri big" data-act="sbegin">' + IC('mic') + ' Bắt đầu đọc</button>' +
      '<button class="ghost" style="margin-top:10px;width:100%" data-act="dstep" data-to="2">← Về bước 2</button>';
  } else if (sp.ph === 'talk') {
    h += (sp.m === 'sh' ? '<div class="en" lang="en">' + stress(c.en) + '</div>' :
      isDl ? '<div class="th" style="text-align:center"><b id="clk" style="font-size:2.4rem;color:var(--pri)">0</b> giây</div><div class="en" lang="en" style="font-size:1.05rem">' + c.sents.map(function (x) { return '<p>' + phMark(x.en) + '</p>'; }).join('') + '</div>' :
      sp.m === 'gc' ? '<div class="vi">' + esc(c.tinhhuong) + '</div><div class="en" lang="en">' + khungHTML(c.khung) + '</div>' :
      '<div class="vi">' + esc(c.tinhhuong || c.vi) + '</div>') +
      '<div class="note" id="talkmsg" role="status">' + esc(sp.msg || 'Thầy nói to nhé… (nếu máy hỏi quyền micro, chọn Cho phép)') + '</div>' +
      (S.set.asr && N.canAsr && !sp.msg ? '<div class="th">Máy nghe được:</div><div class="en" id="heard" lang="en" style="font-size:1.1rem">…</div>' : '') +
      '<button class="pri big" data-act="sstop">' + (isDl ? 'Đọc xong' : 'Nói xong') + '</button>';
  } else if (sp.ph === 'wait') {
    h += '<p>Đang xử lý…</p>';
  } else {   // rev
    if (isDl) {
      h += '<div class="tag">Đoạn mẫu</div><div class="en" lang="en" style="font-size:1.05rem">' + c.sents.map(function (x) { return '<p>' + phMark(x.en) + '</p>'; }).join('') + '</div>' + (canSpeak ? speakBtnsSp('dmodel') : '') +
        '<div class="th">Thầy đọc mất khoảng ' + sp.secs + ' giây; đọc mẫu ở tốc độ thường khoảng ' + estSecs(c.en) + ' giây (ước lượng, chỉ để tham khảo).</div>';
    } else if (sp.m === 'gc') {
      h += '<div class="tag">Khung và câu mẫu</div><div class="th" lang="en">' + khungHTML(c.khung) + '</div>' +
        c.mau.map(function (t, k) { return '<div class="en" lang="en">' + stress(t) + '</div>' + (k === 0 ? '<div class="vi">' + esc(c.vi) + '</div>' : ''); }).join('') +
        (canSpeak ? speakBtnsSp() : '') + '<div class="th">Mỗi khung có nhiều cách điền đúng; các câu trên chỉ là ví dụ. Với khung Toán, Thầy kiểm tra lại ý nghĩa phép tính.</div>';
    } else {
      h += '<div class="tag">Câu mẫu</div><div class="en" lang="en">' + stress(c.en) + '</div><div class="vi">' + esc(c.vi) + '</div>' + (canSpeak ? speakBtnsSp() : '');
    }
    if (sp.url) h += '<div class="row" style="margin:8px 0"><button data-act="smine">' + IC('play') + ' Nghe giọng của Thầy</button></div>';
    if (sp.heard) {
      var d = spDiff(c, sp.heard);
      h += '<div class="th">Máy nghe được: <span lang="en">' + esc(sp.heard) + '</span></div><div class="note">' + (sp.m === 'gc' ? 'Chữ gạch đỏ có thể chỉ là cách điền khác với câu mẫu, hoặc máy nghe nhầm.' : 'Chữ gạch đỏ là chữ máy không nghe ra.') + ' Máy có thể nghe nhầm, nên đây không phải điểm: Thầy tự nghe lại và đánh giá.</div>' +
        (isDl && d.total && sp.heard.split(/\s+/).filter(Boolean).length < d.total * 0.6 ? '<div class="warn">Máy mới nghe được một phần của đoạn (có thể máy dừng nghe giữa chừng), nên chữ gạch đỏ ở phần sau chưa chắc là Thầy đọc sai.</div>' : '') +
        '<div class="en" lang="en" style="font-size:1.1rem">' + diffHTML(d) + '</div>';
    } else if (!sp.url) h += '<div class="note">' + esc(sp.msg || 'Thầy tự so phần mình vừa nói với bản mẫu.') + '</div>';
    h += '<div class="row"><button data-act="srate" data-ok="0">Chưa được</button><button class="pri" data-act="srate" data-ok="1">Được rồi</button></div>';
  }
  v.innerHTML = h + '</div>';
}

// ---------- email mẫu (email.js) ----------
var EMS = { id: null, vals: {}, busy: false, warned: false };     // chữ Thầy gõ chỉ nằm ở đây, không ghi localStorage
function emList() { return window.EM ? EM.list(D.email, S.set.unrev) : []; }
function emItem() { var l = emList(); for (var i = 0; i < l.length; i++) if (l[i].id === EMS.id) return l[i]; return null; }
function renderEm(v) { v.innerHTML = EM.menu(emList(), { n: S.n, canSpeak: canSpeak }); }
function renderEmx(v) {
  var it = emItem();
  if (!it) { go('em'); return; }
  v.innerHTML = EM.view(it, EMS.vals, { n: S.n, canSpeak: canSpeak });
}
function emCopy() {
  var it = emItem(); if (!it || EMS.busy) return;
  var n = EM.empties(it, EMS.vals);
  if (n > 0 && !EMS.warned) {      // hỏi lại bằng dòng chữ trong trang (không dùng hộp thoại: lần bấm thứ hai vẫn là thao tác của người dùng nên iOS cho chép)
    EMS.warned = true; var wm = $('#emmsg');
    if (wm) { wm.style.display = 'block'; wm.textContent = 'Còn ' + n + ' chỗ trống, vẫn sao chép? Bấm Sao chép thêm một lần nữa để chép luôn, hoặc điền tiếp.'; }
    return;
  }
  EMS.busy = true;
  var id = it.id, p = EM.copy(EM.text(it, EMS.vals));
  p.then(function (ok) {
    EMS.busy = false;
    if (ok) { S.n.em = Math.min(999999, S.n.em + 1); save(); }
    if (VIEW !== 'emx' || EMS.id !== id) return;
    var mg = $('#emmsg'); if (!mg) return;
    mg.style.display = 'block';
    mg.textContent = ok ? 'Đã sao chép. Thầy mở Mail hoặc Zalo rồi dán vào.' : 'Máy không sao chép tự động được. Thầy bấm giữ vào bản email ở trên để chọn và sao chép.';
  }, function () { EMS.busy = false; });
}

// ---------- điều hướng ----------
var VIEW = 'home';
function go(name) {
  if (name !== 'emx') { EMS.id = null; EMS.vals = {}; EMS.warned = false; }   // chữ Thầy gõ trong email mẫu không được giữ lại khi rời màn
  spLeave(); VIEW = name; if (canSpeak) { try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } }
  render();
  window.scrollTo(0, 0);
}
function render() {
  var v = $('#view');
  if (VIEW === 'home') renderHome(v);
  else if (VIEW === 'session') renderSession(v);
  else if (VIEW === 'lib') renderLib(v);
  else if (VIEW === 'math') renderMath(v);
  else if (VIEW === 'listen') renderListen(v);
  else if (VIEW === 'lx') renderLx(v);
  else if (VIEW === 'lgen') renderLgen(v);
  else if (VIEW === 'speak') renderSpeak(v);
  else if (VIEW === 'sx') renderSx(v);
  else if (VIEW === 'nvm') renderNvm(v);
  else if (VIEW === 'em') renderEm(v);
  else if (VIEW === 'emx') renderEmx(v);
  else renderSettings(v);
  Array.prototype.forEach.call(document.querySelectorAll('nav button'), function (b) {
    var on = b.dataset.go === (['session', 'listen', 'lx', 'lgen', 'speak', 'sx', 'nvm', 'em', 'emx'].indexOf(VIEW) >= 0 ? 'home' : VIEW);
    b.classList.toggle('on', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  try { v.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }   // đưa tiêu điểm về nội dung mới cho người dùng đọc màn hình
}

// ---------- sự kiện ----------
function stopVoice() { if (canSpeak) { try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } } }
function curStep() { return SES && SES.steps[SES.si]; }
var lastAct = 0, lastSnd = {};
function dlBackup(blob, fn) {
  var a2 = document.createElement('a'); a2.href = URL.createObjectURL(blob); a2.download = fn;
  document.body.appendChild(a2); a2.click(); a2.remove();
  setTimeout(function () { try { URL.revokeObjectURL(a2.href); } catch (e) { /* bỏ qua */ } }, 4000);
}
function act(a, b) {
  var s;
  if (['rate', 'listen', 'termdone', 'dcheck', 'lrate', 'dpick', 'lnext', 'ldict', 'llia', 'ldlg', 'lshow2', 'lresume', 'sbegin', 'sstop', 'srate', 'sstart', 'dstep', 'nvnext', 'emcopy'].indexOf(a) >= 0) {   // chặn chạm đúp chấm nhầm thẻ kế tiếp
    var now = Date.now(); if (now - lastAct < 500) return; lastAct = now;
  } else if (['say', 'sayd', 'smodel', 'smine', 'dmodel', 'dsent', 'ghint', 'nvhear', 'emsay'].indexOf(a) >= 0) {   // nút nghe: chặn chạm đúp riêng từng nút, không cản nút khác
    var kk = a + '|' + (b.dataset.k || '') + (b.dataset.r || '') + (b.dataset.l || '') + (b.dataset.w || '') + (b.dataset.j || ''), tn = Date.now();
    if (lastSnd[kk] && tn - lastSnd[kk] < 400) return; lastSnd = {}; lastSnd[kk] = tn;
  }
  switch (a) {
    case 'start': startSession(); break;
    case 'say': say(CUR[b.dataset.k] != null ? CUR[b.dataset.k] : CUR.card, b.dataset.r); break;
    case 'sayd': {
      var dl = lsItems(); if (!dl || S.ls.mode !== 'dlg') break;
      var li = b.dataset.l != null ? parseInt(b.dataset.l, 10) : -1, lines = dl[0].lines;
      sayLines(li >= 0 && lines[li] ? [lines[li]] : lines, b.dataset.r); break;
    }
    case 'lmenu': go('listen'); break;
    case 'smenu': go('speak'); break;
    case 'nvmenu': go('nvm'); break;
    case 'emmenu': go('em'); break;
    case 'emopen': if (emList().some(function (x) { return x.id === b.dataset.id; })) { EMS.id = b.dataset.id; EMS.vals = {}; EMS.warned = false; go('emx'); } break;
    case 'emsay': { var emi = emItem(), emc = emi && emi.cum[parseInt(b.dataset.k, 10)]; if (emc) say(emc.en, b.dataset.r === 'slow' ? 'slow' : 'normal'); break; }
    case 'emcopy': emCopy(); break;
    case 'nvnext': if (SP && SP.m === 'nv' && NV.nextA(SP)) { spPersist(); render(); window.scrollTo(0, 0); nvAuto(); } break;
    case 'nvpick': if (SP && SP.m === 'nv' && NV.pick(SP, b.dataset.p)) { spPersist(); render(); } break;
    case 'nvhear': if (SP && SP.m === 'nv' && SP.ph === 'nvc') { var nu = SP.q[0].luot[SP.t], nc = nu && nu.chon[parseInt(b.dataset.w, 10)]; if (nc) say(nc.en, 'normal'); } break;
    case 'sstart': startSpeak(b.dataset.m, b.dataset.id); break;
    case 'sresume': resumeSpeak(); break;
    case 'sdrop': S.sp = null; save(); render(); break;
    case 'dmodel': if (SP && SP.m === 'dl') sayChain(SP.q[0].sents.map(function (t) { return t.en; }), b.dataset.r); break;
    case 'dsent': if (SP && SP.m === 'dl') { var ds = SP.q[0].sents[SP.j]; if (ds) say(ds.en, b.dataset.r); } break;
    case 'ghint': if (SP && SP.m === 'gc' && SP.ph === 'think') { var gh = SP.q[SP.i].goiy[parseInt(b.dataset.w, 10)]; if (gh) say(gh.replace(/^\([^)]*\)\s*/, ''), 'normal'); } break;
    case 'dstep': {
      if (!SP || SP.m !== 'dl' || ['d1', 'd2', 'd3'].indexOf(SP.ph) < 0) break;
      var to = b.dataset.to, dn = SP.q[0].sents.length;
      stopVoice(); spToken++;
      if (to === '1' || to === '2' || to === '3') { if (to === '2' && SP.ph === 'd1') SP.j = 0; SP.s = parseInt(to, 10); SP.ph = 'd' + to; }
      else if (to === 'jp') SP.j = Math.max(0, SP.j - 1);
      else if (to === 'jn') SP.j = Math.min(dn - 1, SP.j + 1);
      else break;
      spPersist(); render(); window.scrollTo(0, 0); break;
    }
    case 'sexit': go('speak'); break;
    case 'sbegin': spBegin(); break;
    case 'sstop': spStop(); break;
    case 'srate': spRate(b.dataset.ok === '1'); break;
    case 'smodel': spPlayModel(b.dataset.r); break;
    case 'smine': spPlayMine(); break;
    case 'playrec': playRec(parseInt(b.dataset.id, 10)); break;
    case 'rclear':
      if (confirm('Xoá hết ghi âm giọng Thầy trong máy này?')) { spStopAudio(); (window.NOI && NOI.canStore ? NOI.clear() : Promise.resolve()).then(function () { alert('Đã xoá ghi âm.'); if (VIEW === 'speak') render(); }, function () { alert('Không xoá được ghi âm.'); }); }
      break;
    case 'lgenv': LG.open = null; go('lgen'); break;
    case 'lexit': go('listen'); break;
    case 'ldrop': try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } S.ls = null; save(); render(); break;
    case 'lresume': if (lsItems()) { LXS = freshLXS(); go('lx'); } else { S.ls = null; save(); render(); } break;
    case 'ldict': case 'llia': case 'ldlg': startListen(a === 'ldict' ? 'dict' : a === 'llia' ? 'lia' : 'dlg', b.dataset.id); break;
    case 'dcheck': {
      var L = S.ls, its = lsItems(); if (!L || !its || L.mode !== 'dict' || LXS.fb != null || L.r.length >= its.length) break;
      var ans = ($('#dt') || {}).value || '';
      if (!ans.trim()) { alert('Hãy gõ câu Thầy nghe được trước.'); break; }
      var df = diffWords(its[L.r.length].en, ans);
      L.r.push(Math.round(df.score * 100) / 100); LXS.fb = L.r.length - 1; LXS.d = df;
      if (L.r.length >= its.length && canSpeak) S.l.dict++;
      save(); render(); break;
    }
    case 'lrate': {
      var L2 = S.ls, its2 = lsItems(); if (!L2 || !its2 || L2.mode !== 'lia' || !LXS.rev || L2.r.length >= its2.length) break;
      L2.r.push(b.dataset.ok === '1' ? 1 : 0); LXS.rev = false;
      if (L2.r.length >= its2.length && canSpeak) S.l.lia++;
      save(); render(); break;
    }
    case 'lshow2': LXS.rev = true; render(); break;
    case 'dpick': {
      var L3 = S.ls, its3 = lsItems(); if (!L3 || !its3 || L3.mode !== 'dlg' || LXS.fb != null) break;
      var qs = its3[0].qs;
      if (L3.r.length >= qs.length) break;
      var pk = parseInt(b.dataset.i, 10); if (!(pk >= 0 && pk <= 2)) break;
      L3.r.push(pk); LXS.fb = L3.r.length - 1;
      if (L3.r.length >= qs.length) {
        var sc = 0; qs.forEach(function (qq, i) { if (L3.r[i] === qq.a) sc++; });
        var old = S.l.dlg[its3[0].id] || { best: 0, n: 0 };
        S.l.dlg[its3[0].id] = { best: Math.max(old.best, sc), n: old.n + 1 };
      }
      save(); render(); break;
    }
    case 'lnext': try { speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } LXS.fb = null; LXS.d = null; LXS.rev = false; render(); window.scrollTo(0, 0); break;
    case 'lshowtext': LXS.show = !LXS.show; render(); break;
    case 'gopen': stopVoice(); LG.open = b.dataset.id; render(); break;
    case 'gback': stopVoice(); LG.open = null; render(); break;
    case 'sayparts': {
      var t = allTerms().filter(function (x) { return x.en === CUR.term; })[0];
      if (t) say(spokenParts(t).join('. '), b.dataset.r);
      break;
    }
    case 'reveal': if (SES) SES.rev = true; render(); break;
    case 'rate': {
      s = curStep(); if (!s || !s.q || !s.q.length) break;
      var c = s.q.shift(), ok = b.dataset.ok === '1', first = !SES.again[c.id];
      if (first) {      // lần làm lại trong cùng buổi (sau "Chưa nhớ") không làm thẻ thăng hạng
        rateCard(c, ok);
        if (s.k === 'review') SES.stat.rev++; else SES.stat.nw++;
        if (!ok) { SES.again[c.id] = 1; s.q.push(c); }
      }
      SES.did++; SES.rev = false; render(); break;
    }
    case 'lshow': curStep().shown = true; render(); break;
    case 'listen': {
      s = curStep();
      SES.stat.listen = b.dataset.ok === '1' ? 'hiểu rồi' : 'chưa hiểu hết (nên nghe lại câu này)';
      if (b.dataset.ok !== '1') { var p = S.cards[s.card.id]; if (p) p.due = Math.min(p.due, dayNum() + 1); }
      SES.did++; save(); SES.si++; SES.rev = false; render(); break;
    }
    case 'termdone': S.mathSeen[curStep().term.id] = ymd(); SES.stat.term = curStep().term.en; SES.did++; save(); SES.si++; render(); break;
    case 'skip': SES.si++; SES.rev = false; render(); break;
    case 'topen': stopVoice(); MATH.open = b.dataset.id; render(); break;
    case 'tback': stopVoice(); MATH.open = null; render(); break;
    case 'lopen': stopVoice(); LIB.open = b.dataset.id; render(); break;
    case 'theme': S.set.theme = S.set.theme === 'dark' ? 'light' : 'dark'; save(); applyTheme(); render(); break;
    case 'lback': stopVoice(); LIB.open = null; render(); break;
    case 'addc': {
      var en = $('#ae').value.trim(), vi = $('#av').value.trim();
      if (!en || !vi) { alert('Cần nhập cả câu tiếng Anh và nghĩa tiếng Việt.'); break; }
      S.custom.push({ id: 'U' + Date.now(), en: en, vi: vi, nhom: 'Câu của Thầy', muc: 1, tinhhuong: '', loi: '', noiam: '', duyet: 'thay' });
      LIB.nhom = ''; save(); render(); break;
    }
    case 'delc':
      if (LIB.open && confirm('Xoá câu này khỏi danh sách?')) {
        S.custom = S.custom.filter(function (x) { return x.id !== LIB.open; }); delete S.cards[LIB.open];
        LIB.open = null; save(); render();
      }
      break;
    case 'export': {
      var blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
      var fn = 'TiengAnh_SaoLuu_' + ymd() + '.json';
      // iPhone: dùng bảng Chia sẻ (Lưu vào Tệp, AirDrop…) nếu có; không được thì tải xuống như thường
      try {
        var fobj = new File([blob], fn, { type: 'application/json' });
        if (navigator.canShare && navigator.share && navigator.canShare({ files: [fobj] })) {
          navigator.share({ files: [fobj], title: fn }).catch(function (er) { if (!er || er.name !== 'AbortError') dlBackup(blob, fn); });
          break;
        }
      } catch (e3) { /* dùng cách tải xuống */ }
      dlBackup(blob, fn); break;
    }
    case 'import': $('#imp').click(); break;
    case 'reset':
      if (confirm('Xoá toàn bộ tiến độ và câu Thầy đã thêm trong máy này? Nên xuất sao lưu trước.')) { if (window.NOI && NOI.canStore) NOI.clear().catch(function () { /* bỏ qua */ }); S = defaults(); save(); applyTheme(); render(); }
      break;
  }
}
document.addEventListener('click', function (e) {
  var g = e.target.closest('[data-go]'); if (g) { MATH.open = null; LIB.open = null; go(g.dataset.go); return; }
  var b = e.target.closest('[data-act]'); if (b) act(b.dataset.act, b);
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.id === 'ln') { LIB.nhom = t.value; render(); }
  else if (t.id === 'mm') { MATH.mang = t.value; $('#mlist').innerHTML = mathList(); }
  else if (t.id === 'imp') {
    var f = t.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var o = null;
      try { o = JSON.parse(r.result); } catch (er) { o = null; }
      if (!isObj(o) || !isObj(o.cards) || !isObj(o.set)) { alert('File này không phải file sao lưu của app.'); return; }
      if (!confirm('Thay toàn bộ tiến độ hiện tại bằng file sao lưu này?')) return;
      S = normalize(o); save(); applyTheme(); render(); alert('Đã nhập sao lưu.');
    };
    r.onerror = function () { alert('Không đọc được file.'); };
    r.readAsText(f);
    t.value = '';       // cho phép chọn lại đúng file đó
  } else if (t.dataset.set) {
    var k = t.dataset.set, val = t.type === 'checkbox' ? t.checked : (k === 'newPerDay' ? parseInt(t.value, 10) : t.value);
    if (k === 'unrev' && val === false && (S.sp || S.ls) && !confirm('Tắt hiện nội dung chưa duyệt có thể làm bài nói/nghe đang dở không tiếp được (vì mọi nội dung mới đều chưa duyệt). Vẫn tắt?')) { t.checked = true; return; }
    S.set[k] = val; save(); applyTheme();
  }
});
document.addEventListener('input', function (e) {
  if (e.target.dataset && e.target.dataset.emf != null && VIEW === 'emx') {   // ô điền email mẫu: chỉ cập nhật bản xem trước, không dựng lại màn (giữ con trỏ), không lưu
    var ei = emItem(), li = parseInt(e.target.dataset.emf, 10);
    if (ei && ei.labels[li] != null) {
      EMS.vals['k:' + ei.labels[li]] = String(e.target.value).slice(0, window.EM.MAXVAL); EMS.warned = false;
      $('#emprev').innerHTML = EM.previewHTML(ei, EMS.vals); $('#emfillmsg').textContent = EM.noteHTML(ei, EMS.vals);
      var mg = $('#emmsg'); if (mg) mg.style.display = 'none';
    }
    return;
  }
  if (e.target.id === 'mq') { MATH.q = e.target.value; $('#mlist').innerHTML = mathList(); }
});

applyTheme();
render();
if (window.NOI && NOI.canStore) NOI.sweep().catch(function () { /* bỏ qua */ });   // xoá ghi âm quá 7 ngày ngay khi mở app
document.addEventListener('visibilitychange', function () { if (document.hidden && SP && SP.ph === 'talk') spStop(); });
})();
