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
  // Publish a message
  client.publish('your-topic', 'Hello MQTT with TLS!', { qos: 1 }, (err) => {
    if (err) {
      console.error('Error publishing message:', err);
    } else {
      console.log('Message published');
    }
    client.end(); // Close the connection after publishing
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  client.end(); // Close the connection after receiving a message
});

client.on('error', (err) => {
  console.error('Error:', err);
  client.end(); // Close the connection in case of an error
});
