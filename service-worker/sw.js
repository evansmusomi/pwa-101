// Service Worker

const pwaCache = "pwa-cache-v2";

self.addEventListener("install", event => {
  console.log("SW Install");
  let cacheReady = caches.open(pwaCache).then(cache => {
    console.log("SW Cache Ready");
    return cache.addAll(["./", "./style.css", "./icon.png", "./main.js"]);
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

  // skip for remote fetch
  if (!event.request.url.match(`${location.origin}/service-worker`)) return;
  // serve local fetch from cache
  let newResponse = caches.open(pwaCache).then(cache => {
    return cache.match(event.request).then(response => {
      // check request was found in cache
      if (response) {
        console.log(`Serving ${response.url} from cache.`);
        return response;
      }

      // fetch on behalf of client and cache
      return fetch(event.request).then(fetchResponse => {
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      });
    });
  });

  event.respondWith(newResponse);
});

self.addEventListener("message", event => {
  console.log(`SW Message: ${event.data}`);
});

self.addEventListener("push", event => {
  console.log(`SW Push: ${event.data.text()}`);
  let notification = self.registration.showNotification("PWA SW Notification");
  event.waitUntil(notification);
});
