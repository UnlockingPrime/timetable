/*
 * Service worker: makes Semester load instantly and work offline.
 * Bump VERSION whenever you change any file, so phones pick up the new build.
 */
const VERSION = "semester-app-v1";
const FONTS = "semester-fonts";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.svg"
];

// cache: "reload" skips the browser's HTTP cache, so a new version never precaches stale files.
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(CORE.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    e.respondWith(req.mode === "navigate" ? networkFirst(req) : staleWhileRevalidate(req, e));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(cacheFirst(req));
  }
});

/** Pages: try the network (with a timeout) so updates show up, fall back to the cached shell. */
async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000))
    ]);
    if (res && res.ok) cache.put("./index.html", res.clone());
    return res;
  } catch (err) {
    return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
  }
}

/** Other files: answer from cache immediately, refresh the cache in the background. */
async function staleWhileRevalidate(req, event) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(req, { ignoreSearch: true });
  const fresh = fetch(req, { cache: "no-cache" }).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  if (cached) {
    event.waitUntil(fresh);
    return cached;
  }
  return (await fresh) || Response.error();
}

/** Google Fonts never change for a given URL, so cache them forever. */
async function cacheFirst(req) {
  const cache = await caches.open(FONTS);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return Response.error();
  }
}
