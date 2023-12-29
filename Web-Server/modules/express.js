/*
1) api route 
2) enforce best practice for api routes
*/
const express = require("express");
const helmet = require('helmet')

const app = express();
app.use(helmet())
const port = 80;

//disable x-powered-by header for security reasons
app.disable('x-powered-by')

app.use(express.json());
app.set('json spaces', 2);

const { APIlogger } = require('../middleware/ApiLogger.js');
const { json } = require("body-parser");

//middleware logic
//app.use('/api/v1', require('../middleware/ApiKey.js'));
app.use('/api/v0', APIlogger );

//route logic 
app.use('/api/v0', require('../routes/api_route.js'));

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

module.exports = { app };


