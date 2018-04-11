// Progressive Enhancement (SW support)

// Service Workers
if (navigator.serviceWorker) {
  // convert key to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  // register the SW
  navigator.serviceWorker
    .register("./sw.js")
    .then(function(registration) {
      console.log("SW Registered");
      // post message from app context to SW
      registration.active.postMessage("Hello from Main.js");

      // push server notification
      const publicKey =
        "BIC73pcYnp5BUZPveTbjIqJEaJQUVcelKpvlt_25Efr0_t68Ofng4vYdZF-WVReTjoDl6scX-cE5TDTXw1pUhsA";

      registration.pushManager
        .getSubscription()
        .then(subscription => {
          if (subscription) return subscription;

          const applicationServerKey = urlBase64ToUint8Array(publicKey);
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
          });
        })
        .then(subscription => subscription.toJSON())
        .then(console.log)
        .catch(console.log);
    })
    .catch(console.log());
}

// Notification support
if (window.Notification) {
  function showNotification() {
    const notificationOptions = {
      body: "PWAs rock and are the way to go 😎",
      icon: "./icon.png"
    };
    new Notification("PWA Notification", notificationOptions);
  }

  // manage permission
  if (Notification.permission === "granted") {
    showNotification();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        showNotification();
      }
    });
  }
}
