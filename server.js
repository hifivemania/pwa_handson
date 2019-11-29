// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const fs = require('fs');
const {promisify} = require('util');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/key', async function(req, res) {
  try {
    const content = await promisify(fs.readFile)('./application-server-keys.json', 'utf8');
    const json = JSON.parse(content);
    res.json({key: json.publicKey});
  } catch (err) {
    res.status(404).render({});
  }
});

// listen for requests :)
const port = 3000;
const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});