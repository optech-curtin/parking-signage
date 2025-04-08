// (A) FILES TO CACHE
const cacheName  = "js-sign-cache",

const filesToCache  = [
  // (A1) STATIC FILES
 "/",
 "/js",
 "/js/GallagherAlarmChecker.js",
 "/js/Offline.js",
 "/js/parkingLots.js",
 "/js/ScheduleManager.js",
 "/js/SignManager.js",
 "/js/staticSignDisplayPreview.js",
 "/media",
 "/media/images",
 "/media/images/rolling_images",
 "media/images/main_images", 
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
  );
});

// the fetch event handler, to intercept requests and serve all 
// static assets from the cache
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
    .then(response => response ? response : fetch(e.request))
  )
});