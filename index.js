var cors = require('cors');
var express = require('express');
var fs = require('fs');
var https = require('https');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'demo'
});
connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get('/', function (req, res) {
  const username = req.query.username || '';
  const password = req.query.password || '';
  const query = "SELECT `username`, `password` FROM `user` WHERE `username`='" + username + "'";
  connection.query(query, function (err, rows) {
    if (err || !rows.length) {
       res.json({
         success: false
       });
    } else {
      if (password === rows[0].password) {
        const token = jwt.sign({
          now: Date.now(),
          username: username
        }, 'secret');
        res.json({
          success: true,
          token: token
        });
      }
    }
  });
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
  .listen(3777, function () {
    console.log('Example app listening on port 3000! Go to https://localhost:3777/')
  })
