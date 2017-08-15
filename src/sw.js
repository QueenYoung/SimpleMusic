// const CACHE_NAME = `cache-${new Date().getMonth()}-${new Date().getDate()}`;
/*@eslint-disable*/
const CACHE_NAME = 'mycache';
window.self.addEventListener('install', event => {
  console.log('what?');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '../UI',
        '../UI/GridList.jsx',
        '../UI/ListDialog.jsx'
      ]);
    })
  );
});
window.self.addEventListener('fetch', event => {
  console.log('what is the fuck?');
  if (event.request.method === 'GET') {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then(cache => {
          return cache.match(event.request).then(resp => {
            return (
              resp ||
              fetch(event.request).then(response => {
                cache.put(event.request, response.clone());
                return response;
              })
            );
          });
        })
        .catch(() => caches.match('/serverworker/yeah.html'))
    );
  }
});
