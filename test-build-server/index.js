const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

console.log(process.env.NODE_ENV);
const hostPort = process.env.TEST_SERVER_PORT || 3000;

/* App Config */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));

/* Server Initialization */
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../build', 'index.html')));
app.listen(hostPort, () =>
	console.log(
		`Server initialized on: http://localhost:${hostPort} // ${new Date()}`,
	),
);
