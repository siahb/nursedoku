const CACHE='nursedoku-20261009-large-stars';
const ASSETS=["./","index.html","manifest.webmanifest","icon.svg","assets/app.2127f8accf.js","assets/styles.2bf4edfc6d.css","assets/puzzles.ad028b6d5f.js","assets/large-puzzles.b5dbb536ca.js","assets/account-config.acc6cc855d.js","assets/accounts.6e43497164.js","assets/appearance.1c2e683a76.js","assets/tutorial.eb4797bace.js","assets/shift000.98c6180a8e.js","assets/leaderboard.612406020a.js"];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
// Activate on the next visit, keeping an in-progress board on a consistent version.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nursedoku-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match('index.html'))));
 else event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});




