// imports

importScripts('js/sw-utils.js');


/*
    * Lo primero que hacemos es identificar los tres tipos 
    * de cache que tendremos en nuestra APP y definir el
    * APP_SHELL
    
    * Para esto identificamos aquellos recursos que son propios
    * y puedo cambiar (estaticos), que son de terceros y no cambiare
    * (inmutables), y los que se iran o se pueden ir cargando de 
    * forma dinamica (dinamicos)
 */

const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

// !Se puede usar con "/" o sin al inicio
const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', event => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', event => {
    
    const response = caches.keys().then( keys => {
        keys.forEach( key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
               return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
             }
        })
    });


    event.waitUntil(response);
});


self.addEventListener('fetch', event => {


    const response = caches.match(event.request).then(resp => {
        if (resp) {
            return resp;
        } else {
            return fetch(event.request).then(newResp => {
                return updateCacheDynamic(DYNAMIC_CACHE, event.request, newResp);
            });
        }
    });


    event.respondWith(response);
})