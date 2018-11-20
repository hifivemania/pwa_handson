// キャッシュ名
const CACHE_NAME = 'YOUR_CACHE_NAME';
// キャッシュするURL
const urlsToCache = [
  "/vendors/bootstrap/css/bootstrap.min.css",
  "/vendors/bootstrap/js/bootstrap.bundle.min.js",
  "/vendors/jquery/jquery.min.js",
  "/vendors/hifive/h5.js",
  "/vendors/hifive/ejs-h5mod.js",
  "/vendors/hifive/h5.css",
  "/vendors/hifive/h5.js.map",
  "/vendors/hifive/h5.dev.js",
  "/manifest.json",
  "/icon.png",
  "/js/app.push.js",
  "/js/todo.js",
  "/js/app.js",
  "/sw.js",
  "/",
  "/components/loader.css",
  "/components/loader.js"
];

// Service Workerがインストールされた時に呼ばれる処理
self.addEventListener('install', event => {
  // Service Workerがバージョンアップしている時に、新しいものを有効にする処理
  event.waitUntil(self.skipWaiting());
  // キャッシュ登録処理を完了するのを保証する
  event.waitUntil(
    // キャッシュを開く
    caches.open(CACHE_NAME)
      // 指定したURLをキャッシュに登録する
      .then(cache => {
        urlsToCache.map(url => {
          // アクセスして結果を受け取る
          fetch(new Request(url))
            .then(response => {
              // 結果をキャッシュに登録する
              return cache.put(url, response);
            }, err =>  console.log(err));
        });
      })
  );
});

// Service Workerがバージョンアップしている時に、新しいものを有効にする処理
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// ネットワークアクセス時に使われるfetchイベント
self.addEventListener('fetch', async (event) => {
  // ここに記述してください（第4章）
});

// Todoの一覧を更新する処理（第5章）

// Webプッシュ通知の処理（第7章）
self.addEventListener('push', ev => {
  // payloadの取得
  const {title, msg, icon} = ev.data.json();
  self.registration.showNotification(title, {
    icon: icon,
    body: msg
  });
});