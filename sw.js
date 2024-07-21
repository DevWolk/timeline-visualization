const CACHE_NAME = 'ua-anti-corruption-v1';
const urlsToCache = [
    '/timeline-visualization/',
    '/timeline-visualization/index.html',
    '/timeline-visualization/favicon/favicon.ico',
    '/timeline-visualization/favicon/android-chrome-192x192.png',
    '/timeline-visualization/favicon/android-chrome-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css',
    'https://gist.githubusercontent.com/DevWolk/2265f9f62ead2282e7d47e653addd94f/raw/78dda256a01666015c11e3d4aa02457ca50b3b36/data_for_the_timeline.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream and because we want the browser to
                        // consume the response as well as the cache consuming the response, we need to clone it so we
                        // have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});