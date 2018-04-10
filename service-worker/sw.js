//SW

self.addEventListener('install', (e) => {
    console.log('SW: Install Event');
});

self.addEventListener('activate', (e) => {
    console.log('SW: Activate Event');
});