const coap = require('coap');

const serverUri = 'coap://localhost:5683'; 

// Create a CoAP request
const req = coap.request({
  hostname: 'localhost', // Replace with your server's hostname
  port: 5683,              // Replace with your server's port
  method: 'PUT',           // Use the CoAP method you need (e.g., PUT, POST)
  pathname: '/resource',   // Replace with your server's resource path
});

// Set the payload (data to be sent to the server)
const payload = 'Hello, CoAP Server!'; // Replace with your data
req.write(payload);

// Event handler for the response
req.on('response', (res) => {
  console.log('CoAP server responded with:', res.payload.toString());
  req.end();
});

// Send the CoAP request
req.end();
