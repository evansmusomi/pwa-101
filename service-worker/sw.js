// Service Worker

const pwaCache = "pwa-cache-v2";
const staticCache = ["./", "./style.css", "./thumb.png", "./main.js"];

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

  event.waitUntil(cacheCleaned);
});

self.addEventListener("fetch", event => {
  console.log("SW Fetch: " + event.request.url);

  // 3. Network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // cache latest version
        caches.open(pwaCache).then(cache => cache.put(event.request, response));
        return response.clone();

        // fallback to cache
      })
      .catch(error => caches.match(event.request))
  );
});

self.addEventListener("message", event => {
  console.log(`SW Message: ${event.data}`);
});

self.addEventListener("push", event => {
  console.log(`SW Push: ${event.data.text()}`);
  let notification = self.registration.showNotification("PWA SW Notification");
  event.waitUntil(notification);
});
