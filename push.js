const webpush = require("web-push");
const keys = require("./application-server-keys.json");
webpush.setVapidDetails(
  "mailto:info@moongift.jp",
  keys.publicKey,
  keys.privateKey
);
const token = require('./token');

(async () => {
  const icon = `icon.png`;
  const params = {
    title: "プッシュ通知です！",
    msg: `これはサーバから送っています. 今は ${new Date().toLocaleString()} です。 メッセージとアイコンも送っています `,
    icon:  icon
  };
  const res = await webpush.sendNotification(token, JSON.stringify(params), {});
  console.log(res);
})();
