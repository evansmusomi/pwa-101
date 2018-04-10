// Progressive Enhancement (SW support)

if (navigator.serviceWorker) {
  // register the SW and post message
  navigator.serviceWorker
    .register("./sw.js")
    .then(function(registration) {
      console.log("SW Registered");
      registration.active.postMessage("Hello from Main.js");
    })
    .catch(console.log());
}

// notification support
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
