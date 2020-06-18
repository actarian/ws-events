/**
 * @license ws-events v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var https = _interopDefault(require('https'));
var fs = _interopDefault(require('fs'));
var bodyParser = _interopDefault(require('body-parser'));
var path = _interopDefault(require('path'));

var PORT = process.env.PORT || 5000;
var app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, '../../docs/')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '../../docs/index.html'));
});
https.createServer({
  key: fs.readFileSync(path.join(__dirname, '../../certs/client-key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(__dirname, '../../certs/client-cert.pem'), 'utf8')
}, app).listen(PORT, function () {
  console.log("Example app listening on port " + PORT + "! Go to https://192.168.1.2:" + PORT + "/");
});
//# sourceMappingURL=main.js.map
