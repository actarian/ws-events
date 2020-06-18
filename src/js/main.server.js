const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const path = require('path');

const PORT = process.env.PORT || 5000;

var app = express();

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, '../../docs/')));

app.use('/ws-events', serveStatic(path.join(__dirname, '../../docs/')));
app.use('/Modules/Events/Client/docs/', serveStatic(path.join(__dirname, '../../docs/')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, '../../docs/index.html'));
});

app.listen(PORT, () => {
	console.log(`Listening on ${ PORT }`);
});
