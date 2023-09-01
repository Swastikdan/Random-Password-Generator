// const filesToCache = [
//   '/',
//   '/index.html',
//   '/404.html',
//   'style.css',
//   'js/main.js',
//   'js/preline.js',
//   '/fonts/space-grotesk-latin-700.woff',
//   '/fonts/space-grotesk-latin-700.woff2',
//   '/favicon.png',
//   '/squared-bg-element-dark.svg',
//   '/service-worker.js',
//   '/site.webmanifest',
//   '/android-chrome-512x512.png',
//   '/android-chrome-192x192.png',
//   '/apple-touch-icon.png',
//   '/favicon-32x32.png',
//   '/favicon-16x16.png',
//   '/favicon.ico',

// ];

// const CACHE_NAME = 'Password-Generator';

// self.addEventListener('activate', event => {
//   event.waitUntil(
//       caches.keys().then(keyList => {
//           return Promise.all(keyList.map(key => {
//               if (key !== CACHE_NAME) {
//                   return caches.delete(key);
//               }
//           }));
//       })
//   );

//   // Send a message to the client to reload the page
//   self.clients.matchAll().then(clients => {
//       clients.forEach(client => client.postMessage({ type: 'RELOAD_PAGE' }));
//   });
// });



// self.addEventListener('fetch', event => {
//   event.respondWith(
//       caches.match(event.request)
//       .then(response => response || fetch(event.request))

//   );
// });
// self.addEventListener('message', event => {
//   if (event.data === 'checkDownloadStatus') {
//       caches.open(CACHE_NAME)
//           .then(cache => {
//               const areFilesCached = filesToCache.every(file => cache.match(file));
//               if (areFilesCached) {
//                   self.clients.matchAll()
//                       .then(clients => {
//                           clients.forEach(client => client.postMessage('Files are downloaded.'));
//                       })
//               } else {

//               }
//           })
//   }
// });

const filesToCache = [
    '/',
    '/index.html',
    '/404.html',
    '/style.css',          // Added a leading slash to the path
    '/js/main.js',         // Added a leading slash to the path
    '/js/preline.js',      // Added a leading slash to the path
    '/fonts/space-grotesk-latin-700.woff',
    '/fonts/space-grotesk-latin-700.woff2',
    '/favicon.png',
    '/squared-bg-element-dark.svg',
    '/service-worker.js',
    '/site.webmanifest',
    '/android-chrome-512x512.png',
    '/android-chrome-192x192.png',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/favicon.ico',
  ];
  
  const CACHE_NAME = 'Password-Generator';
  
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(filesToCache);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }));
      })
    );
  
    // Send a message to the client to reload the page
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({ type: 'RELOAD_PAGE' }));
    });
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // If the request is in the cache, serve it from there
        if (cachedResponse) {
          return cachedResponse;
        }
  
        // If the request is not in the cache, fetch it from the network
        return fetch(event.request).then(networkResponse => {
          // Clone the network response before caching it
          const responseToCache = networkResponse.clone();
  
          caches.open(CACHE_NAME).then(cache => {
            // Cache the network response for future use
            cache.put(event.request, responseToCache);
          });
  
          return networkResponse;
        }).catch(error => {
          // Handle fetch errors here
          // You can customize this part based on your needs
          console.error('Fetch error:', error);
        });
      })
    );
  });
  
  
  self.addEventListener('message', event => {
    if (event.data === 'checkDownloadStatus') {
      caches.open(CACHE_NAME).then(cache => {
        const areFilesCached = filesToCache.every(file => cache.match(file));
        if (areFilesCached) {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage('Files are downloaded.'));
          });
        } else {
          // Handle the case where not all files are cached
        }
      });
    }
  });
  