// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const fs = require('fs');
const {promisify} = require('util');
const cors = require('cors');
const Datastore = require('nedb');
const db = new Datastore({ filename: '.data/datafile', autoload: true });
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post("/todos/:name", async (req, res) => {
  db.find({name: req.params.name}, (err, results) => {
    let result = results[0];
    if (!result) {
      result = {name: req.params.name, todos: [req.body.todo]};
      db.insert(result);
    } else {
      result.todos.push(req.body.todo);
      const id = result._id;
      delete result._id;
      db.update({_id: id} , result);
    }
    res.json({status: 'created', todo: req.body.todo});
  });
});

app.get("/todos/:name", function (req, res) {
  db.find({name: req.params.name}, (err, results) => {
    res.json(results[0] ? results[0].todos : [])
  });
});

app.delete("/todos/:name/:todo", function (req, res) {
  db.find({name: req.params.name}, (err, results) => {
    let result = results[0];
    if (!result) {
      return res.json({});
    } else {
      for (let i = 0; i < result.todos.length; i += 1) {
        result.todos = result.todos.filter(todo => todo != req.params.todo)
      }
      const id = result._id;
      delete result._id;
      db.update({_id: id} , result);
    }
    res.json({status: 'deleted', todo: req.params.todo});
  });
});

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
