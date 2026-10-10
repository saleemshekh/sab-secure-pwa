const CACHE_NAME="sab-v13-final";
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(["./","./index.html","./manifest.json"])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res.status===200){const cl=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,cl));}
    return res;
  }).catch(()=>e.request.headers.get("accept")?.includes("text/html")?caches.match("./index.html"):null)));
});