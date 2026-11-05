/* sw.js - lưu file app để chạy khi mất mạng. Đổi file nào thì TĂNG SỐ CACHE bên dưới. */
var CACHE = 'tagt-v11';
var FILES = ['./', 'index.html', 'style.css', 'app.js', 'icons.js', 'noi.js', 'nhapvai.js', 'email.js',
  'data/cau_chao_lop.js', 'data/cau_giang_toan.js', 'data/cau_giao_bai.js', 'data/cau_hoi_dap.js', 'data/cau_khen_nhac.js', 'data/cau_quan_lop.js', 'data/cau_dong_nghiep.js', 'data/cau_hoi_thao.js', 'data/toan.js', 'data/toan2.js', 'data/hoithoai.js',
  'data/mau.js', 'data/doan.js', 'data/tinhhuong.js', 'data/email.js',
  'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;
  // ưu tiên bản mới trên mạng (đổi file là thấy ngay), mất mạng thì dùng bản đã lưu
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); });
  }));
});
