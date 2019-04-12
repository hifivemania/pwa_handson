(async () => {
  // Service Workerへの対応を確認
  if ('serviceWorker' in navigator) {
  } else {
    return;
  }
  // KEYを生成した公開鍵に書き換えます
  const key = 'KEY';
  if (key === 'KEY') {
    alert('KEYを書き換えてください');
    return;
  }
  // キーを変換します
  const convertedVapidKey = urlBase64ToUint8Array(key);
  // Service Workerのインストール
  await navigator.serviceWorker.register('./sw.js');
  // プッシュ通知のサポートを確認
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    // プッシュ通知がサポートされていない場合
    return;
  }
  // プッシュ通知を拒否されているか確認
  if (Notification.permission === 'denied') {
    // プッシュ通知を拒否された場合
    return;
  }
  // Pushマネージャの存在確認
  if (!('PushManager' in window)) {
    // PushManagerが存在しない場合
    return;
  }
  // Service Workerを有効にする
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  // 購読情報を取得
  let subscription = await serviceWorkerRegistration.pushManager.getSubscription();
  if (subscription) {
    // すでに購読中
  } else {
    // 未購読
    // 購読の確認
    subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
  }
  // プロンプトに表示（コピー用）
  prompt('コピーしてください', JSON.stringify(subscription));
})();

// 文字列をUnit8の配列に変換
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
