const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

const path = require('path');

const PORT = process.env.PORT || 5000;

var app = express();

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, '../../docs/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, '../../docs/index.html'));
});

https
	.createServer({
		key: fs.readFileSync(path.join(__dirname, '../../certs/client-key.pem'), 'utf8'),
		cert: fs.readFileSync(path.join(__dirname, '../../certs/client-cert.pem'), 'utf8')
	}, app)
	.listen(PORT, function() {
		console.log(`Example app listening on port ${PORT}! Go to https://192.168.1.2:${PORT}/`);
	});
