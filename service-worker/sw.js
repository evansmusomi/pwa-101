// Service Worker

const pwaCache = "pwa-cache-v3";
const staticCache = [
  "./",
  "./index.html",
  "./page2.html",
  "./style.css",
  "./thumb.png",
  "./placeholder.png",
  "./main.js"
];

self.addEventListener("install", event => {
  console.log("SW Install");
  let cacheReady = caches.open(pwaCache).then(cache => {
    console.log("SW Cache Ready");
    return cache.addAll(staticCache);
  });

  event.waitUntil(cacheReady);
});

self.addEventListener("activate", event => {
  console.log("SW Activate");

  // delete redundant caches
  let cacheCleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== pwaCache) return caches.delete(key);
    });
  });

  self.registration.showNotification("PWA SW Notification", {
    body: "PWAs rock and are the way to go 😎",
    icon: "./icon.png"
  });

  event.waitUntil(cacheCleaned);
});

self.addEventListener("fetch", event => {
  console.log("SW Fetch: " + event.request.url);

  // Cache with network fallback
  let response = caches.match(event.request).then(result => {
    if (result) return result;
    return fetch(event.request).then(fetchResponse => {
      caches
        .open(pwaCache)
        .then(cache => cache.put(event.request, fetchResponse));
      return fetchResponse.clone();
    });
  });

  // respond
  event.respondWith(response);
});

self.addEventListener("message", event => {
  console.log(`SW Message: ${event.data}`);
});

self.addEventListener("push", event => {
  console.log(`SW Push: ${event.data.text()}`);
  let notification = self.registration.showNotification("PWA SW Notification");
  event.waitUntil(notification);
});
