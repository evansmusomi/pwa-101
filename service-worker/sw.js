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

  // 5. Cache and Network Race
  let firstResponse = new Promise((resolve, reject) => {
    
    // track rejections
    let firstRejectionReceived = false;
    let rejectOnce = () => {
      if (firstRejectionReceived){
        reject('No response received');
      }else{
        firstRejectionReceived = true;
      }
    }
    
    // try network
    fetch(event.request).then(response => {
      response.ok ? resolve(response) : rejectOnce();
    }).catch(rejectOnce);
    
    // try cache
    caches.match(event.request).then(response => {
      response ? resolve(response) : rejectOnce();
    }).catch(rejectOnce());
    
  });
  event.respondWith(firstResponse);
});

self.addEventListener("message", event => {
  console.log(`SW Message: ${event.data}`);
});

self.addEventListener("push", event => {
  console.log(`SW Push: ${event.data.text()}`);
  let notification = self.registration.showNotification("PWA SW Notification");
  event.waitUntil(notification);
});
