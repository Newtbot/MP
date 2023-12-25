const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

// Configuration
const brokerUrl = 'mqtt://mqtt.teeseng.uk';
const options = {
  port: 8883, // MQTT broker port with TLS
  username: process.env.MQTT_USER, 
  password: process.env.MQTT_PASS, 
  protocol: 'mqtts', // Use MQTT over TLS
  key: fs.readFileSync(path.resolve(__dirname, '../../cert/privkey.pem')), // Private key for the client
    cert: fs.readFileSync(path.resolve(__dirname, '../../cert/cert.pem')), // Client certificate

};

// Create MQTT client
const client = mqtt.connect(brokerUrl, options);

module.exports = client;

// Event handlers
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('your-topic'); // Subscribe to a topic
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  // Additional processing for received message
});

client.on('error', (err) => {
  console.error('Error:', err);
  client.end(); // Close the connection in case of an error
});
