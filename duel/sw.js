const CACHE='wuxia-duel-v1-20260930';
const FILES=['./','./index.html','./style.css','./manifest.webmanifest','./js/game.js','./js/assets.js','./js/fx.js','./js/render.js','./js/audio.js','./assets/fighter-v2.webp','./assets/dragon.webp','./assets/arena.webp','./assets/icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('wuxia-duel-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request)));});
