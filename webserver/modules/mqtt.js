const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const { validateData } = require("../functions/validateData.js");

const brokerUrl = 'mqtt://mqtt.teeseng.uk';
const options = {
  port: 8883, 
  username: process.env.MQTT_USER, 
  password: process.env.MQTT_PASS, 
  protocol: 'mqtts', // Use MQTT over TLS
  key: fs.readFileSync(path.resolve(__dirname, '../cert/privkey.pem')), 
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem')), 

};

const client = mqtt.connect(brokerUrl, options);

module.exports = client;


