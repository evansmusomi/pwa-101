// Progressive Enhancement (SW support)

if (navigator.serviceWorker){
    // register the SW
    navigator.serviceWorker.register('/sw.js').then(function(registration){
        console.log('SW Registered');
    }).catch(console.log());
}