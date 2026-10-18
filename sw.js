const CACHE_NAME = 'kho-anninh-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.svg'
];

// Cài đặt và ép Service Worker mới kích hoạt ngay
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Xóa sạch toàn bộ cache phiên bản cũ khi có bản mới
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Xóa cache cũ:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Chiến lược Network-First: Ưu tiên tải file mới nhất từ GitHub khi có mạng (Wi-Fi / 4G)
// Khi mất mạng thì tự động lấy từ Cache ngoại tuyến
self.addEventListener('fetch', (e) => {
  // Chỉ cache các request cùng origin và phương thức GET
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return networkRes;
      })
      .catch(() => caches.match(e.request))
  );
});
