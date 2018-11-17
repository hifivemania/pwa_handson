const webpush = require("web-push");
const fs = require('fs');
const {promisify} = require('util');

const json = JSON.stringify(webpush.generateVAPIDKeys());
(async () => {
  const fileName = 'application-server-keys.json';
  try {
    await promisify(fs.stat)(`./${fileName}`);
    console.log(`すでに ${fileName} があります。`);
    return;
  } catch (err) {
  }
  promisify(fs.writeFile)(`./${fileName}`, json, 'utf8');
  console.log(`${fileName}を作成しました。`);
})();
