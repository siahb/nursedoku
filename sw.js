const CACHE='nursedoku-ece0370925';
const ASSETS=["./","index.html","manifest.webmanifest","icon.svg","assets/app.788aabc454.js","assets/styles.0a3217cb77.css","assets/puzzles.7928824603.js","assets/large-puzzles.f94920ef9e.js","assets/account-config.60877276eb.js","assets/accounts.806b219d88.js","assets/appearance.1f6145a180.js","assets/tutorial.6d3aa84de1.js","assets/shift000.42631442dc.js"];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
// Activate on the next visit, keeping an in-progress board on a consistent version.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nursedoku-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match('index.html'))));
 else event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});


