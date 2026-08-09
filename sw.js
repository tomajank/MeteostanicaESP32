const CACHE_NAME = "thingspeak-graph-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon.svg"
];


// =========================================================
// INSTALL
// =========================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))

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

    const request = event.request;


    /*
       ThingSpeak API necháme ísť priamo
       na internet.

       Nechceme cacheovať namerané dáta.
    */

    if (
        request.url.includes(
            "api.thingspeak.com"
        )
    ) {

        event.respondWith(

            fetch(request, {
                cache: "no-store"
            })

        );

        return;

    }


    /*
       Ostatné súbory:

       najprv internet,
       pri probléme použijeme cache.
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
