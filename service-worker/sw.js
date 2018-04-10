//SW

self.addEventListener("install", e => {
  console.log("SW Install");
});

self.addEventListener("activate", e => {
  console.log("SW Activate");
});

self.addEventListener("fetch", e => {
  console.log("SW Fetch: " + e.request.url);
});

self.addEventListener("message", e => {
  console.log(`SW Message: ${e.data}`);
});

self.addEventListener("push", e => {
  console.log(`SW Push: ${e.data.text()}`);
  let notification = self.registration.showNotification("PWA SW Notification");
  e.waitUntil(notification);
});
