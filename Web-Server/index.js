const { app } = require("./modules/express.js");
const client   = require("./modules/mqtt");
const { validateData } = require("./functions/validateData.js");
const { insertData } = require("./functions/Database.js");
/*
1) validate data from IoT sensor
2) upload data to database
3) add more routes to api
4) add swagger documentation
5) add middleware for authentication
*/

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
        insertData(data);
      
    }
    else {
      console.log("Data is invalid");
      throw new Error("Data is invalid");
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
  
  





