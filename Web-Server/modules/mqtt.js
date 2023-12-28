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
  key: fs.readFileSync(path.resolve(__dirname, '../../cert/privkey.pem')), 
  cert: fs.readFileSync(path.resolve(__dirname, '../../cert/cert.pem')), 

};

const client = mqtt.connect(brokerUrl, options);


// Event handlers
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('iot-data'); 
});

client.on('message', (topic, message) => {
  //console.log(`Received message on topic ${topic}: ${message}`);
  let data = JSON.parse(message);
  if (validateData(data)) {
    //upload to db logic here
  }
  else {
    console.log("Data is invalid");
  }
});

client.on('error', (err) => {
  console.error('Error:', err);
  client.end(); 
});

client.on('end', () => {
  console.log('Disconnected from MQTT broker');
  client.reconnect = true;
}
);

