/* Luyện nói (giai đoạn 3): ghi âm + nhận giọng nói của trình duyệt + kho ghi âm trong máy (IndexedDB, tự xoá sau 7 ngày).
   Không gửi gì lên máy chủ của app. (Nhận giọng nói của trình duyệt có thể dùng máy chủ của Apple/Google — xem HUONG_DAN.md.) */
(function () {
'use strict';
var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
var DB_NAME = 'tagt_ghiam', STORE = 'g', DAYS = 7, MAXKEEP = 40;
var N = {};
N.canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
N.canAsr = !!SR;
N.canStore = !!window.indexedDB;

// ---------- kho ghi âm ----------
function openDB() {
  return new Promise(function (ok, no) {
    if (!window.indexedDB) { no(new Error('no-idb')); return; }
    var rq, fin = false;
    setTimeout(function () { if (!fin) { fin = true; no(new Error('timeout')); } }, 3000);   // Safari đôi khi treo không trả lời
    try { rq = indexedDB.open(DB_NAME, 1); } catch (e) { fin = true; no(e); return; }
    rq.onupgradeneeded = function () { rq.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true }); };
    rq.onsuccess = function () { if (fin) { try { rq.result.close(); } catch (e) { /* bỏ qua */ } return; } fin = true; ok(rq.result); };
    rq.onerror = function () { no(rq.error || new Error('idb')); };
    rq.onblocked = function () { if (!fin) { fin = true; no(new Error('blocked')); } };
  });
}
function tx(mode, fn) {
  return openDB().then(function (db) {
    return new Promise(function (ok, no) {
      var t, res;
      try { t = db.transaction(STORE, mode); res = fn(t.objectStore(STORE)); } catch (e) { db.close(); no(e); return; }
      t.oncomplete = function () { db.close(); ok(res && typeof res === 'object' && 'result' in res ? res.result : res); };
      t.onerror = t.onabort = function () { db.close(); no(t.error || new Error('tx')); };
    });
  });
}
N.save = function (rec) { return tx('readwrite', function (st) { return st.add(rec); }); };
N.all = function () { return tx('readonly', function (st) { return st.getAll(); }).then(function (a) { return Array.isArray(a) ? a : []; }); };
N.get = function (id) { return tx('readonly', function (st) { return st.get(id); }); };
N.clear = function () { return tx('readwrite', function (st) { return st.clear(); }); };
// Xoá bản quá 7 ngày và bản dư (giữ tối đa MAXKEEP bản mới nhất). Trả về danh sách bản còn lại (mới nhất trước), chỉ đọc kho một lần.
N.sweep = function () {
  var limit = Date.now() - DAYS * 86400000;
  return N.all().then(function (a) {
    a.sort(function (x, y) { return (Number(y.ts) || 0) - (Number(x.ts) || 0); });
    var del = a.filter(function (r, i) { return !(Number(r.ts) >= limit) || i >= MAXKEEP; });
    var keep = a.filter(function (r) { return del.indexOf(r) < 0; });
    if (!del.length) return keep;
    return tx('readwrite', function (st) { del.forEach(function (r) { st.delete(r.id); }); }).then(function () { return keep; }, function () { return a; });   // xoá lỗi thì vẫn trả danh sách đọc được
  });
};
N.days = DAYS;

// ---------- ghi âm + nhận giọng ----------
var cur = null;   // phiên đang chạy
function pickMime() {
  var c = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
  for (var i = 0; i < c.length; i++) { try { if (MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) { /* bỏ qua */ } }
  return '';
}
// opts: { rec: bool, asr: bool }, onText(text): gọi mỗi khi có chữ mới.
// Trả về Promise: resolve({rec:bool, asr:bool}) khi đã bắt đầu; reject({code:'denied'|'unsupported'|'other'}).
N.start = function (opts, onText) {
  N.cancel();
  var s = { stream: null, mr: null, chunks: [], mime: '', text: '', sr: null, asrOn: false, recOn: false, closed: false };
  cur = s;
  var wantRec = !!(opts && opts.rec && N.canRec), wantAsr = !!(opts && opts.asr && N.canAsr);
  var p = wantRec ? navigator.mediaDevices.getUserMedia({ audio: true }) : Promise.resolve(null);
  return p.then(function (stream) {
    if (s.closed) { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); throw { code: 'other' }; }
    s.stream = stream;
    if (stream) {
      try {
        s.mime = pickMime();
        s.mr = s.mime ? new MediaRecorder(stream, { mimeType: s.mime }) : new MediaRecorder(stream);
        s.mr.ondataavailable = function (e) { if (e.data && e.data.size) s.chunks.push(e.data); };
        s.mr.start(); s.recOn = true;
      } catch (e) { s.recOn = false; if (!wantAsr && stream) stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e2) { /* bỏ qua */ } }); }
    }
    if (wantAsr) {
      try {
        var r = new SR(); r.lang = 'en-US'; r.interimResults = true; r.continuous = true; r.maxAlternatives = 1;
        r.onresult = function (ev) {
          var t = '';
          for (var i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript + ' ';
          s.text = t.trim(); if (onText && !s.closed) onText(s.text);
        };
        r.onerror = function () { s.asrErr = true; };   // vẫn ghi âm; app báo là máy không hiện được chữ
        r.onend = function () { s.asrOn = false; };
        r.start(); s.sr = r; s.asrOn = true;
      } catch (e) { s.asrOn = false; }
    }
    return { rec: s.recOn, asr: s.asrOn };
  }, function (err) {
    s.closed = true; if (cur === s) cur = null;
    var n = err && err.name;
    throw { code: (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') ? 'denied' : (n === 'NotFoundError' ? 'nomic' : 'other') };
  });
};
// Dừng và lấy kết quả: Promise<{blob|null, mime, text}>
N.stop = function () {
  var s = cur; cur = null;
  if (!s) return Promise.resolve({ blob: null, mime: '', text: '' });
  s.closed = true;
  return new Promise(function (done) {
    var fin = function () {
      if (s.stream) s.stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) { /* bỏ qua */ } });
      var blob = s.chunks.length ? new Blob(s.chunks, { type: s.mime || (s.chunks[0] && s.chunks[0].type) || 'audio/mp4' }) : null;
      var empty = !!blob && blob.size < 500;
      done({ blob: empty ? null : blob, mime: blob ? blob.type : '', text: s.text, asrErr: !!s.asrErr, empty: empty || (s.recOn && !blob) });
    };
    var go = function () {
    if (s.mr && s.mr.state !== 'inactive') {
      var d = false, once = function () { if (d) return; d = true; fin(); };
      s.mr.onstop = once; setTimeout(once, 1500);
      try { s.mr.stop(); } catch (e) { once(); }
    } else fin();
    };
    if (s.sr && s.asrOn) {      // đợi chữ cuối của nhận giọng (tối đa 0,7 giây)
      var g = false, once2 = function () { if (g) return; g = true; go(); };
      s.sr.onend = once2; setTimeout(once2, 700);
      try { s.sr.stop(); } catch (e) { once2(); }
    } else go();
  });
};
N.cancel = function () {
  var s = cur; cur = null; if (!s) return;
  s.closed = true;
  try { if (s.sr) { s.sr.onresult = null; s.sr.abort(); } } catch (e) { /* bỏ qua */ }
  try { if (s.mr && s.mr.state !== 'inactive') { s.mr.onstop = null; s.mr.stop(); } } catch (e) { /* bỏ qua */ }
  if (s.stream) s.stream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) { /* bỏ qua */ } });
};
N.active = function () { return !!cur; };

window.NOI = N;
})();
