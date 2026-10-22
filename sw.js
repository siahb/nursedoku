const CACHE='nursedoku-577294849e';
const ASSETS=["./","index.html","manifest.webmanifest","icon.svg","icon.svg?v=20261020-puzzle-logo","pwa.js?v=20261020-connection","./icons/icon-192.png?v=20261020-puzzle-logo","./icons/icon-512.png?v=20261020-puzzle-logo","./icons/maskable-512.png?v=20261020-puzzle-logo","icons/icon-180.png?v=20261020-puzzle-logo","assets/app.083d5056b4.js","assets/styles.7ee2782fc2.css","assets/puzzles.f65a8e5e36.js","assets/large-puzzles.e8d0d5e480.js","assets/account-config.31855201b0.js","assets/accounts.207c66157f.js","assets/appearance.c9f770b30c.js","assets/tutorial.6a736fc2f7.js","assets/shift000.16728e9d85.js","assets/leaderboard.ae241854b2.js"];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
// Activate on the next visit, keeping an in-progress board on a consistent version.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nursedoku-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 const sharedAsset=ASSETS.some(asset=>new URL(asset,scope).href===url.href);
 if(event.request.method!=='GET'||url.origin!==scope.origin||(!url.pathname.startsWith(scope.pathname)&&!sharedAsset))return;
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(async cache=>{const page=await cache.match(scope.href)||await cache.match('index.html');return page?new Response(page.body,{status:page.status,statusText:page.statusText,headers:page.headers}):Response.error();})));
 else event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});





