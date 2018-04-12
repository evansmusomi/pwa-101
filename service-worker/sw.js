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

  // 4. Cache with Network Update
  event.respondWith(
    caches.open(pwaCache).then(cache => {
      // return from cache
      return cache
        .match(event.request)
        .then(response => {
          //update cache from network
          let updatedResponse = fetch(event.request)
            .then(newResponse => {
              cache.put(event.request, newResponse.clone());
              return newResponse;
            })
            .catch(console.log);

          return response || updatedResponse;
        })
        .catch(console.log);
    })
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
