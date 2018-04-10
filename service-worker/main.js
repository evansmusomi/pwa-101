// Progressive Enhancement (SW support)

if (navigator.serviceWorker) {
  // register the SW
  navigator.serviceWorker
    .register("./sw.js")
    .then(function(registration) {
      console.log("SW Registered");
      registration.active.postMessage("Hello from Main.js");
    })
    .catch(console.log());
}
