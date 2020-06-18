/**
 * @license ws-events v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
require('fs');
var bodyParser = _interopDefault(require('body-parser'));
var serveStatic = _interopDefault(require('serve-static'));
var path = _interopDefault(require('path'));

var PORT = process.env.PORT || 5000;
var app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, '../../docs/')));
app.use('/ws-events', serveStatic(path.join(__dirname, '../../docs/')));
app.use('/Modules/Events/Client/docs/', serveStatic(path.join(__dirname, '../../docs/')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '../../docs/index.html'));
});
app.listen(PORT, function () {
  console.log("Listening on " + PORT);
});
//# sourceMappingURL=main.js.map
