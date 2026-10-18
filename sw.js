const CACHE='nursedoku-94fdf37919';
const ASSETS=["./","index.html","manifest.webmanifest","icon.svg","./icons/icon-192.png?v=20261017-home-icons","./icons/icon-512.png?v=20261017-home-icons","./icons/monochrome-512.png?v=20261017-home-icons","icons/icon-180.png?v=20261017-home-icons","assets/app.52998e1bce.js","assets/styles.340d460372.css","assets/puzzles.ad028b6d5f.js","assets/large-puzzles.b5dbb536ca.js","assets/account-config.acc6cc855d.js","assets/accounts.fd619426a1.js","assets/appearance.7c818eb271.js","assets/tutorial.eb4797bace.js","assets/shift000.98c6180a8e.js","assets/leaderboard.5762bde592.js"];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
// Activate on the next visit, keeping an in-progress board on a consistent version.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nursedoku-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match('index.html'))));
 else event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});





