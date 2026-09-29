/* Service Worker: كاش للتطبيق عشان يفتح فوراً وبدون نت.
   غيّر رقم النسخة لما تعدّل الملفات عشان التحديث يوصل. */
const VERSION = 'study-os-v2';
const FILES = ['studyos.html', 'studyos.webmanifest',
  'studyos-icon-192.png', 'studyos-icon-512.png', 'studyos-icon-maskable.png', 'studyos-apple-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('studyos.html')))
  );
});
