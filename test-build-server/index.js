require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');
const os = require('os');
const app = express();

const hostPort = process.env.TEST_SERVER_PORT || 3000;
const hostIP =
	process.env.TEST_SERVER_IP ||
	Object.values(os.networkInterfaces())
		.flat()
		.find((iface) => iface.family === 'IPv4' && !iface.internal).address;

const options = {
	pfx: fs.readFileSync(path.resolve(__dirname, '../credentials/astra-local.ds.pfx')),
	passphrase: 'DSPass2024',
};

/* App Config */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));

/* Server Initialization */
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../build', 'index.html')));

https.createServer(options, app).listen(hostPort, hostIP, () => {
	console.log(`Server initialized on: https://${hostIP}:${hostPort} // ${new Date()}`);
});
