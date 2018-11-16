if ('serviceWorker' in navigator) {
  // Service Worker対応
  navigator.serviceWorker
    .register('/sw.js')
    .then(function(registration) {
      // 登録成功
      registration.onupdatefound = function() {
        console.log('アップデートがあります！');
      }
      // WebPushの処理（6章で行います）
    })
    .catch(function(err) {
      // 登録失敗 :(
      console.log('ServiceWorker registration failed: ', err);
  });
}
