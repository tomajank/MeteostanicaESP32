const CACHE_NAME = "thingspeak-graph-v2"; // treba po zmene manifest.json, sw.js, app.html alebo app.css aktualizovat kvoli cache. Zmenou thingspeak-graph-v1 -> v2 sa pri aktivácii automaticky odstráni thingspeak-graph-v1

const APP_FILES = [ //obsahuje vsetky subory potrebne pre beh PWA apky
    "./",
    "./index.html",
    "./app.html",
    "./app.css",
    "./manifest.json",
    "./icon.svg",
    "./icon-180.png",
    "./icon-192.png",
    "./icon-512.png"
];

// =========================================================
// INSTALL
// =========================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(
                    APP_FILES
                );

            })

    );

    self.skipWaiting();

});


// =========================================================
// ACTIVATE
// =========================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key =>
                        key !== CACHE_NAME
                    )
                    .map(key =>
                        caches.delete(key)
                    )

            );

        })

    );

    self.clients.claim();

});


// =========================================================
// FETCH
// =========================================================

self.addEventListener("fetch", event => {

    const request =
        event.request;


    /*
     * ThingSpeak API necháme ísť
     * priamo na internet.
     *
     * Namerané dáta nechceme cacheovať.
     */

    if (
        request.url.includes(
            "api.thingspeak.com"
        )
    ) {

        event.respondWith(

            fetch(
                request,
                {
                    cache: "no-store"
                }
            )

        );

        return;

    }


    /*
     * Ostatné súbory:
     *
     * najprv internet,
     * pri probléme cache.
     */

    event.respondWith(

        fetch(request)

            .then(response => {

                const copy =
                    response.clone();


                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(
                            request,
                            copy
                        );

                    });


                return response;

            })

            .catch(() => {

                return caches.match(
                    request
                );

            })

    );

});
